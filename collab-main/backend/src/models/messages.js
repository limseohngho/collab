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
    `SELECT m.*, u.username
     FROM messages m
     JOIN users u ON m.sender_id = u.id
     WHERE m.project_id = ?
     ORDER BY m.sent_at ASC`,
    [projectId]
  );
  return rows;
};