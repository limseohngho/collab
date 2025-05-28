const db = require('../config/db');

// 일정 추가
async function createEvent(projectId, title, startTime, endTime, description, createdBy) {
  const query = `
    INSERT INTO calendar_events (project_id, title, start_time, end_time, description, created_by)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const [result] = await db.query(query, [projectId, title, startTime, endTime, description, createdBy]);
  return result;
}

// 일정 조회 (단건)
async function getEventById(eventId) {
  const query = 'SELECT * FROM calendar_events WHERE id = ?';
  const [result] = await db.query(query, [eventId]);
  return result;
}

// 일정 수정
async function updateEvent(eventId, title, startTime, endTime, description) {
  const query = `
    UPDATE calendar_events 
    SET title = ?, start_time = ?, end_time = ?, description = ? 
    WHERE id = ?
  `;
  const [result] = await db.query(query, [title, startTime, endTime, description, eventId]);
  return result;
}

// 일정 삭제
async function deleteEvent(eventId) {
  const query = 'DELETE FROM calendar_events WHERE id = ?';
  const [result] = await db.query(query, [eventId]);
  return result;
}

// 프로젝트별 일정 목록 조회
async function getEventsByProjectId(projectId) {
  const query = 'SELECT * FROM calendar_events WHERE project_id = ?';
  const [result] = await db.query(query, [projectId]);
  return result;
}

module.exports = {
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventsByProjectId,
};