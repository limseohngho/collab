// models/messages.js
const db = require('../config/db');

exports.sendMessage = async (projectId, senderId, message) => {
  const [result] = await db.query(
    'INSERT INTO messages (project_id, sender_id, message) VALUES (?, ?, ?)',
    [projectId, senderId, message]
  );
  return result;
};

exports.getMessagesByProject = async (projectId) => {
  const [rows] = await db.query(
    'SELECT * FROM messages WHERE project_id = ? ORDER BY sent_at ASC',
    [projectId]
  );
  return rows;
};