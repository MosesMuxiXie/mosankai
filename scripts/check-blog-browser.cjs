const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const fs = require('node:fs/promises');
const net = require('node:net');
const os = require('node:os');
const path = require('node:path');
const { chromium } = require(process.env.MOSANKAI_PLAYWRIGHT || 'playwright');

const richUrl = '/blog/%E6%A8%A1%E7%B5%84';
const articles = [
  {
    id: 'fixture-rich', slug: '模組', title: '模組筆記', date: '2026-08-02',
    author: 'Moses', excerpt: 'A rich article', tags: ['Minecraft'], image: '/favicon.png',
    contentFormat: 'html',
    contentHtml: '<p>Rich <strong>text</strong> and <a href="/gallery">a link</a>.</p>'
      + '<img src="/favicon.png" alt="Article image">'
      + '<a href="data:text/plain;base64,SGVsbG8=" download="notes.txt">Download notes</a>',
    comments: [{ name: 'Earlier reader', text: 'A saved comment.', date: '2026-08-03' }]
  },
  {
    id: '1751211619856', title: 'Legacy note', date: '2025-06-29',
    content: 'First line\nSecond line',
    comments: []
  }
];

async function isolatedServer(dataFile) {
  const listener = net.createServer();
  await new Promise((resolve, reject) => listener.once('error', reject).listen(0, resolve));
  const port = listener.address().port;
  await new Promise((resolve, reject) => listener.close(error => error ? reject(error) : resolve()));
  const env = { ...process.env, PORT: String(port), BLOG_DATA_FILE: dataFile, FINDATIME_SKIP_ENV_FILE: 'true' };
  for (const key of ['UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN', 'KV_REST_API_URL', 'KV_REST_API_TOKEN']) {
    delete env[key];
  }
  const server = spawn(process.execPath, ['server.js'], {
    cwd: path.join(__dirname, '..'), env, stdio: ['ignore', 'pipe', 'inherit']
  });
  return server;
}

async function main() {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'mosankai-blog-browser-'));
  const dataFile = path.join(directory, 'blogs.json');
  const snapshot = process.env.BLOG_BROWSER_SNAPSHOT
    ? JSON.parse(await fs.readFile(process.env.BLOG_BROWSER_SNAPSHOT, 'utf8'))
    : null;
  await fs.writeFile(dataFile, JSON.stringify(snapshot?.details || articles));
  let server;
  let browser;
  try {
    // Use the test process's loopback listener port as reported by the child.
    server = await isolatedServer(dataFile);
    const base = await new Promise((resolve, reject) => {
      let output = '';
      const timer = setTimeout(() => reject(new Error('Blog server did not start')), 8000);
      server.once('error', reject);
      server.once('exit', code => reject(new Error('Blog server exited with ' + code)));
      server.stdout.on('data', chunk => {
        output += chunk;
        const address = output.match(/http:\/\/localhost:(\d+)/);
        if (address) {
          clearTimeout(timer);
          resolve('http://localhost:' + address[1]);
        }
      });
    });
    browser = await chromium.launch({ channel: 'msedge' });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, locale: 'en-US' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('https://www.googletagmanager.com/**', route => route.abort());
    await page.goto(base + '/blog');

    if (snapshot) {
      const index = await (await page.request.get(base + '/api/blogs')).json();
      assert.deepEqual(index, snapshot.index);
      await page.locator('main').getByRole('link', { name: index[0].title, exact: true }).waitFor();
      assert.deepEqual(await page.locator('main article h2').allTextContents(), index.map(post => post.title));
      for (const [position, article] of snapshot.details.entries()) {
        const href = '/blog/' + encodeURIComponent(index[position].slug);
        await page.locator('main').getByRole('link', { name: article.title, exact: true }).click();
        await page.waitForURL(base + href);
        await page.getByRole('heading', { level: 1, name: article.title }).waitFor();
        const body = page.locator('.blog-content');
        if (article.contentFormat === 'html') {
          assert.equal(await body.innerHTML(), article.contentHtml);
        } else {
          assert.equal(await body.textContent(), article.content);
        }
        for (const comment of article.comments) {
          await page.locator('.comment-item').filter({ hasText: comment.withdrawn ? 'This comment has been withdrawn.' : comment.text }).first().waitFor();
        }
        assert.equal(await page.locator('.comment-item').count(), article.comments.length);
        for (const identifier of new Set([article.id, index[position].slug])) {
          const encoded = encodeURIComponent(identifier);
          const detail = await (await page.request.get(base + '/api/blogs/' + encoded)).json();
          assert.deepEqual(detail, article);
          await page.goto(base + '/blog/' + encoded);
          await page.getByRole('heading', { level: 1, name: article.title }).waitFor();
        }
        await page.getByRole('link', { name: 'Back to Articles' }).click();
      }
      console.log('Verified ' + index.length + ' production articles and their comments through the redesigned site');
    } else {
      const entry = page.getByRole('link', { name: '模組筆記', exact: true });
      await entry.waitFor({ timeout: 3500 });
      assert.equal(await entry.getAttribute('href'), richUrl);
      assert.equal(await entry.locator('time').getAttribute('datetime'), '2026-08-02');
      await entry.getByText('A rich article', { exact: true }).waitFor();
      await entry.getByText('Moses', { exact: true }).waitFor();
      await entry.getByText('Minecraft', { exact: true }).waitFor();
      assert.ok((await entry.boundingBox()).y < 235, 'The first post should be near the top');
      assert.equal(await page.locator('body img').count(), 0, 'The archive has no decorative images');
      await entry.focus();
      assert.equal(await entry.evaluate(link => link.matches(':focus-visible')), true);
      await page.keyboard.press('Enter');
      await page.waitForURL(base + richUrl);
      await page.getByRole('heading', { level: 1, name: '模組筆記' }).waitFor();
      assert.equal(await page.getByRole('link', { name: 'a link' }).getAttribute('href'), '/gallery');
      await page.getByRole('img', { name: 'Article image' }).waitFor();
      await page.getByRole('img', { name: 'Blog cover' }).waitFor();
      const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.getByRole('link', { name: 'Download notes' }).click()
      ]);
      assert.equal(download.suggestedFilename(), 'notes.txt');

      await page.locator('#c-name').fill('A "quoted" name');
      await page.locator('#c-text').fill('New comment');
      await page.getByRole('button', { name: 'Post Comment' }).click();
      const ownComment = page.locator('.comment-item').filter({ hasText: 'New comment' });
      await ownComment.waitFor();
      assert.equal(await page.locator('#c-name').inputValue(), 'A "quoted" name');
      await ownComment.getByRole('button', { name: 'Reply' }).click();
      await page.locator('.reply-comment-form textarea').fill('A reply');
      await page.getByRole('button', { name: 'Post reply' }).click();
      await page.locator('.comment-reply').filter({ hasText: 'A reply' }).waitFor();
      await page.reload();
      await ownComment.getByRole('button', { name: 'Edit', exact: true }).first().click();
      await page.locator('.edit-comment-form textarea').fill('Edited comment');
      await page.getByRole('button', { name: 'Save changes' }).click();
      const editedComment = page.locator('.comment-item').filter({ hasText: 'Edited comment' });
      await editedComment.waitFor();
      page.once('dialog', dialog => dialog.accept());
      await editedComment.getByRole('button', { name: 'Withdraw', exact: true }).first().click();
      await page.getByText('This comment has been withdrawn.').waitFor();
      await page.locator('.comment-reply').filter({ hasText: 'A reply' }).waitFor();

      await page.getByRole('link', { name: 'Back to Articles' }).click();
      await entry.waitFor();
      await page.goBack();
      await page.getByRole('heading', { level: 1, name: '模組筆記' }).waitFor();
      await page.goto(base + '/blog/1751211619856');
      await page.getByRole('heading', { level: 1, name: 'Legacy note' }).waitFor();
      assert.equal(await page.locator('.blog-content').textContent(), 'First line\nSecond line');

      await page.goto(base + '/blog/not-found');
      await page.getByText('Article not found.').waitFor();
      await page.locator('[data-language="zh-CN"]').click();
      await page.getByText('找不到这篇文章。').waitFor();
      await page.getByRole('link', { name: '返回文章列表' }).click();
      await page.setViewportSize({ width: 390, height: 844 });
      await entry.waitFor();
      const date = await entry.locator('time').boundingBox();
      const title = await entry.getByRole('heading').boundingBox();
      assert.ok(date.y < title.y && title.y < 235, 'On mobile the date is above the first title');
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await page.locator('[data-language="en"]').click();

      await page.route('**/api/blogs', route => route.fulfill({ status: 503, body: '' }), { times: 1 });
      await page.reload();
      await page.getByText('Could not load articles.').waitFor();
      await page.getByRole('button', { name: 'Try again' }).click();
      await entry.waitFor();

      await page.goto(base + '/blog-MosesX1.html');
      await page.waitForURL(base + '/blog', { timeout: 3500 });
      await entry.waitFor();
      console.log('Verified archive, keyboard navigation, rich text, downloads, comments, mobile, language and errors');
    }
    assert.deepEqual(errors, []);
  } finally {
    await browser?.close();
    if (server && server.exitCode === null && server.signalCode === null) {
      const stopped = new Promise(resolve => server.once('exit', resolve));
      server.kill();
      await stopped;
    }
    // This directory contains only files created by the test.
    await fs.rm(dataFile, { force: true });
    await fs.rmdir(directory);
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
