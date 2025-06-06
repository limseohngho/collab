const db = require('../config/db');

exports.createTask = async (projectId, title, description, status) => {
  const [result] = await db.query(
    'INSERT INTO tasks (project_id, title, description, status) VALUES (?, ?, ?, ?)',
    [projectId, title, description, status]
  );
  return result;
};

exports.getTasksByProject = async (projectId) => {
  const [tasks] = await db.query('SELECT * FROM tasks WHERE project_id = ?', [projectId]);
  return tasks;
};

exports.updateTask = async (taskId, fields) => {
  const setClause = Object.keys(fields).map(key => `${key} = ?`).join(', ');
  const values = [...Object.values(fields), taskId];
  const query = `UPDATE tasks SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
  const [result] = await db.query(query, values);
  return result;
};

exports.deleteTask = async (taskId) => {
  const [result] = await db.query('DELETE FROM tasks WHERE id = ?', [taskId]);
  return result;
};