const db = require('../config/db');

exports.createEvent = async (projectId, title, startTime, endTime, description, createdBy) => {
  const [result] = await db.query(
    `INSERT INTO calendar_events (project_id, title, start_time, end_time, description, created_by)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [projectId, title, startTime, endTime, description, createdBy]
  );
  return result;
};

exports.getEventById = async (eventId) => {
  const [result] = await db.query('SELECT * FROM calendar_events WHERE id = ?', [eventId]);
  return result;
};

exports.updateEvent = async (eventId, title, startTime, endTime, description) => {
  const [result] = await db.query(
    `UPDATE calendar_events SET title = ?, start_time = ?, end_time = ?, description = ? WHERE id = ?`,
    [title, startTime, endTime, description, eventId]
  );
  return result;
};

exports.deleteEvent = async (eventId) => {
  const [result] = await db.query('DELETE FROM calendar_events WHERE id = ?', [eventId]);
  return result;
};

exports.getEventsByProjectId = async (projectId) => {
  const [result] = await db.query('SELECT * FROM calendar_events WHERE project_id = ?', [projectId]);
  return result;
};