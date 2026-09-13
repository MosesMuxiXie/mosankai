const crypto = require('crypto');
const {
  getComments,
  saveComment,
  withdrawComment
} = require('../../lib/meetingStore');
const { publicMeeting } = require('../../lib/findatimeMeeting');
const { loadMeeting, submitAvailability, MeetingError } = require('../../lib/findatimeService');

function sendError(res, status, error, code) {
  return res.status(status).json({ error, ...(code ? { code } : {}) });
}

function publicComment(comment, participantToken = '') {
  return {
    id: comment.id,
    parentId: comment.parentId || null,
    name: comment.name,
    text: comment.withdrawn ? '' : comment.text,
    createdAt: comment.createdAt,
    withdrawn: Boolean(comment.withdrawn),
    owned: Boolean(participantToken && comment.participantToken === participantToken)
  };
}

function headerParticipantToken(req) {
  return String(
    req.headers?.['x-participant-token']
    || req.headers?.['X-Participant-Token']
    || ''
  );
}

async function handleComments(req, res, meeting, id) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'GET') {
    const comments = await getComments(id);
    const participantToken = headerParticipantToken(req);
    return res.status(200).json({
      comments: comments.map(comment => publicComment(comment, participantToken))
    });
  }
  if (req.method !== 'POST' && req.method !== 'DELETE') {
    return sendError(res, 405, 'Method not allowed');
  }

  const participantToken = String(req.body?.participantToken || '');
  const participant = (meeting.participants || []).find(person => person.token === participantToken);
  if (!participant || !/^[A-Za-z0-9_-]{16,64}$/.test(participantToken)) {
    return sendError(
      res,
      403,
      'Submit your availability before joining the conversation.',
      'submitAvailabilityFirst'
    );
  }

  if (req.method === 'DELETE') {
    const commentId = String(req.body?.commentId || '');
    if (!/^c[a-f0-9]{16}$/.test(commentId)) {
      return sendError(res, 400, 'This comment cannot be withdrawn.', 'invalidComment');
    }

    const result = await withdrawComment(id, commentId, participantToken);
    if (result.status === 'meetingNotFound') {
      return sendError(res, 404, 'This meeting could not be found.', 'meetingNotFound');
    }
    if (result.status === 'notFound') {
      return sendError(res, 404, 'This comment no longer exists.', 'commentNotFound');
    }
    if (result.status === 'forbidden') {
      return sendError(res, 403, 'You can only withdraw your own comments.', 'notCommentOwner');
    }
    return res.status(200).json({
      comments: result.comments.map(comment => publicComment(comment, participantToken))
    });
  }

  const text = String(req.body?.text || '').trim().slice(0, 1000);
  if (!text) return sendError(res, 400, 'Write a comment first.', 'writeCommentFirst');

  const parentId = req.body?.parentId == null ? null : String(req.body.parentId);
  if (parentId) {
    if (!/^c[a-f0-9]{16}$/.test(parentId)) {
      return sendError(res, 400, 'This comment cannot be replied to.', 'invalidReplyTarget');
    }
    const comments = await getComments(id);
    const parent = comments.find(comment => comment.id === parentId);
    if (!parent || parent.parentId || parent.withdrawn) {
      return sendError(res, 400, 'This comment cannot be replied to.', 'invalidReplyTarget');
    }
  }

  const comment = {
    id: `c${crypto.randomBytes(8).toString('hex')}`,
    parentId,
    participantToken,
    name: participant.name,
    text,
    createdAt: new Date().toISOString()
  };
  const comments = await saveComment(id, comment);
  if (!comments) return sendError(res, 404, 'This meeting could not be found.', 'meetingNotFound');

  return res.status(201).json({
    comment: publicComment(comment, participantToken),
    comments: comments.map(item => publicComment(item, participantToken))
  });
}

module.exports = async function handler(req, res) {
  const id = String(req.query?.id || req.params?.id || '');
  if (!/^ua[a-f0-9]{14}$/.test(id)) {
    return res.status(404).json({ error: '找不到这个约会' });
  }

  try {
    const meeting = await loadMeeting(id);

    const commentsRequest = req.query?.comments === '1'
      || req.body?.action === 'comment'
      || req.body?.action === 'withdrawComment';
    if (commentsRequest) return handleComments(req, res, meeting, id);

    if (req.method === 'GET') return res.status(200).json(publicMeeting(meeting));
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    return res.status(200).json(await submitAvailability(meeting, req.body || {}));
  } catch (error) {
    if (error instanceof MeetingError) return sendError(res, error.status, error.message, error.code);
    console.error(error);
    return res.status(500).json({ error: '暂时无法保存，请稍后重试' });
  }
};
