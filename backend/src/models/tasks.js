const db = require('../config/db');

// Task 생성
const createTask = async (projectId, title, description, status) => {
  const query = 'INSERT INTO tasks (project_id, title, description, status) VALUES (?, ?, ?, ?)';
  const [result] = await db.query(query, [projectId, title, description, status]);
  return result;
};

// 프로젝트의 모든 Task 조회
const getTasksByProject = async (projectId) => {
  const query = 'SELECT * FROM tasks WHERE project_id = ?';
  const [tasks] = await db.query(query, [projectId]);
  return tasks;
};

// Task 수정 (status, title, description 등)
const updateTask = async (taskId, fields) => {
  const setClause = Object.keys(fields).map(key => `${key} = ?`).join(', ');
  const values = [...Object.values(fields), taskId];
  const query = `UPDATE tasks SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
  const [result] = await db.query(query, values);
  return result;
};

// Task 삭제
const deleteTask = async (taskId) => {
  const query = 'DELETE FROM tasks WHERE id = ?';
  const [result] = await db.query(query, [taskId]);
  return result;
};

module.exports = {
  createTask,
  getTasksByProject,
  updateTask,
  deleteTask,
};