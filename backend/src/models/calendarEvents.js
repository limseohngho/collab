const db = require('../config/db');

// 일정 추가
const createEvent = async (projectId, title, startTime, endTime, description, createdBy) => {
  const query = `
    INSERT INTO calendar_events (project_id, title, start_time, end_time, description, created_by)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const [result] = await db.query(query, [projectId, title, startTime, endTime, description, createdBy]);
  return result;
};

// 일정 조회
const getEventById = async (eventId) => {
  const query = 'SELECT * FROM calendar_events WHERE id = ?';
  const [result] = await db.query(query, [eventId]);
  return result;
};

// 일정 수정
const updateEvent = async (eventId, title, startTime, endTime, description) => {
  const query = `
    UPDATE calendar_events 
    SET title = ?, start_time = ?, end_time = ?, description = ? 
    WHERE id = ?
  `;
  const [result] = await db.query(query, [title, startTime, endTime, description, eventId]);
  return result;
};

// 일정 삭제
const deleteEvent = async (eventId) => {
  const query = 'DELETE FROM calendar_events WHERE id = ?';
  const [result] = await db.query(query, [eventId]);
  return result;
};

module.exports = {
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent
};
