const crypto = require('crypto');
const store = require('./meetingStore');
const { normalizeMeetingSlots, validTimeZone } = require('./meetingTime');
const { normalizeName, publicMeeting } = require('./findatimeMeeting');

class MeetingError extends Error {
  constructor(status, message, code) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

async function createMeeting(input = {}) {
  const title = String(input.title || '').trim().slice(0, 80);
  const duration = Number(input.duration);
  const submittedSlots = Array.isArray(input.slots) ? input.slots : [];
  const submittedTimeZone = input.timezone;
  const timezone = submittedTimeZone == null ? 'Asia/Shanghai' : String(submittedTimeZone);
  const slots = normalizeMeetingSlots(submittedSlots, submittedTimeZone == null);
  const creatorName = normalizeName(input.name);

  if (!title) throw new MeetingError(400, '请输入约会名称', 'enterMeetingName');
  if (!creatorName) throw new MeetingError(400, '请输入姓名', 'enterParticipantName');
  if (!Number.isInteger(duration) || duration < 30 || duration > 480 || duration % 30 !== 0) {
    throw new MeetingError(400, '时长必须为 30 分钟到 8 小时，并以 30 分钟递增');
  }
  if (!validTimeZone(timezone)) throw new MeetingError(400, '浏览器时区无效');
  if (!slots || !slots.length || slots.length > 10) {
    throw new MeetingError(400, '请选择 1–10 个有效的整点或半点时间');
  }

  const id = `ua${crypto.randomBytes(7).toString('hex')}`;
  const creatorToken = crypto.randomBytes(18).toString('base64url');
  const meetingSlots = slots.map((start, index) => ({ id: `t${index + 1}`, start }));
  const meeting = { id, title, duration, timezone, createdAt: new Date().toISOString(), slots: meetingSlots };
  const creator = {
    token: creatorToken, name: creatorName, availability: meetingSlots.map(slot => slot.id),
    unavailable: false, submittedAt: new Date().toISOString()
  };
  await store.createMeeting(meeting, creator);
  return { id, creatorToken, url: `/findatime/uuid/${id}` };
}

async function loadMeeting(id) {
  if (!/^ua[a-f0-9]{14}$/.test(id)) throw new MeetingError(404, '找不到这个约会');
  const meeting = await store.getMeeting(id);
  if (!meeting) throw new MeetingError(404, '找不到这个约会');
  return meeting;
}

async function getMeeting(id) {
  return publicMeeting(await loadMeeting(id));
}

// The REST handler already loads this meeting for comment routing and method checks.
async function submitAvailability(meeting, input = {}) {
  const name = normalizeName(input.name);
  const unavailable = input.unavailable === true;
  const validSlotIds = new Set(meeting.slots.map(slot => slot.id));
  const availability = unavailable ? [] : [...new Set(Array.isArray(input.availability) ? input.availability : [])]
    .filter(slotId => validSlotIds.has(slotId));
  const suppliedToken = String(input.participantToken || '');
  const participantToken = /^[A-Za-z0-9_-]{16,64}$/.test(suppliedToken)
    ? suppliedToken : crypto.randomBytes(18).toString('base64url');

  if (!name) throw new MeetingError(400, '请输入姓名', 'enterParticipantName');
  if (!unavailable && !availability.length) {
    throw new MeetingError(400, '请至少选择一个方便的时间，或选择“无法参加”', 'chooseAvailability');
  }
  const updated = await store.saveParticipant(meeting.id, {
    token: participantToken, name, availability, unavailable, submittedAt: new Date().toISOString()
  });
  return { meeting: publicMeeting(updated), participantToken };
}

module.exports = { MeetingError, createMeeting, loadMeeting, getMeeting, submitAvailability };
