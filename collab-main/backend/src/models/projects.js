const db = require('../config/db');

exports.createProject = async (name, description, createdBy) => {
  const [project] = await db.query(
    'INSERT INTO projects (project_name, description, created_by) VALUES (?, ?, ?)',
    [name, description, createdBy]
  );
  return project.insertId;
};

exports.addProjectMember = async (projectId, userId, role) => {
  await db.query(
    'INSERT INTO project_member (project_id, user_id, role) VALUES (?, ?, ?)',
    [projectId, userId, role]
  );
};

exports.getProjectsByUser = async (userId) => {
  const [projects] = await db.query(
    'SELECT * FROM projects p JOIN project_member pm ON p.id = pm.project_id WHERE pm.user_id = ?',
    [userId]
  );
  return projects;
};

exports.findProjectById = async (projectId) => {
  const [rows] = await db.query('SELECT * FROM projects WHERE id = ?', [projectId]);
  return rows[0];
};

exports.updateProject = async (projectId, name, description) => {
  const [result] = await db.query(
    'UPDATE projects SET project_name = ?, description = ? WHERE id = ?',
    [name, description, projectId]
  );
  return result.affectedRows > 0;
};

exports.deleteProject = async (projectId, userId) => {
  const [result] = await db.query(
    'DELETE FROM projects WHERE id = ? AND created_by = ?',
    [projectId, userId]
  );
  return result;
};