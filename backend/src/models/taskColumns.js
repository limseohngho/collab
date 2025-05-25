// src/models/taskColumns.js
const db = require('../config/db');

const createColumn = async (projectId, name, position) => {
  const query = 'INSERT INTO task_columns (project_id, name, position) VALUES (?, ?, ?)';
  const [result] = await db.query(query, [projectId, name, position]);
  return result;
};

const getColumnsByProject = async (projectId) => {
  const query = 'SELECT * FROM task_columns WHERE project_id = ? ORDER BY position';
  const [rows] = await db.query(query, [projectId]);
  return rows;
};

const updateColumn = async (columnId, name, position) => {
  const query = 'UPDATE task_columns SET name = ?, position = ? WHERE id = ?';
  const [result] = await db.query(query, [name, position, columnId]);
  return result;
};

const deleteColumn = async (columnId) => {
  const query = 'DELETE FROM task_columns WHERE id = ?';
  const [result] = await db.query(query, [columnId]);
  return result;
};

module.exports = {
  createColumn,
  getColumnsByProject,
  updateColumn,
  deleteColumn,
};
