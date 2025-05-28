// src/models/messages.js
const db = require('../config/db');

const sendMessage = async (projectId, senderId, message) => {
  const query = 'INSERT INTO messages (project_id, sender_id, message) VALUES (?, ?, ?)';
  const [result] = await db.query(query, [projectId, senderId, message]);
  return result;
};

const getMessagesByProject = async (projectId) => {
  const query = 'SELECT * FROM messages WHERE project_id = ? ORDER BY sent_at ASC';
  const [rows] = await db.query(query, [projectId]);
  return rows;
};

module.exports = {
  sendMessage,
  getMessagesByProject,
};
