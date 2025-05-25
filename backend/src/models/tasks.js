// src/models/tasks.js
const db = require('../config/db');

// Task 생성
const createTask = async (columnId, title, description, position) => {
  const query = 'INSERT INTO tasks (column_id, title, description, position) VALUES (?, ?, ?, ?)';
  const [result] = await db.query(query, [columnId, title, description, position]);
  return result;
};

// 특정 컬럼의 Task 조회
const getTasksByColumnId = async (columnId) => {
  const query = 'SELECT * FROM tasks WHERE column_id = ? ORDER BY position ASC';
  const [tasks] = await db.query(query, [columnId]);
  return tasks;
};

// Task 수정
const updateTask = async (taskId, title, description, position) => {
  const query = 'UPDATE tasks SET title = ?, description = ?, position = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
  const [result] = await db.query(query, [title, description, position, taskId]);
  return result;
};

// Task 삭제
const deleteTask = async (taskId) => {
  const query = 'DELETE FROM tasks WHERE id = ?';
  const [result] = await db.query(query, [taskId]);
  return result;
};

// Task 위치/컬럼 이동
const moveTask = async (taskId, newColumnId, newPosition) => {
  const query = 'UPDATE tasks SET column_id = ?, position = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
  const [result] = await db.query(query, [newColumnId, newPosition, taskId]);
  return result;
};

module.exports = {
  createTask,
  getTasksByColumnId,
  updateTask,
  deleteTask,
  moveTask,
};
