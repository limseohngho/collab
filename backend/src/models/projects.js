// src/models/projects.js
const db = require('../config/db');

// 프로젝트 생성
const createProject = async (name, description, createdBy) => {
  const [project] = await db.query(
    'INSERT INTO projects (project_name, description, created_by) VALUES (?, ?, ?)',
    [name, description, createdBy]
  );
  return project.insertId;
};

const addProjectMember = async (projectId, userId, role) => {
  await db.query(
    'INSERT INTO project_member (project_id, user_id, role) VALUES (?, ?, ?)',
    [projectId, userId, role]
  );
};

// 사용자 ID에 해당하는 프로젝트 목록 조회
const getProjectsByUser = async (userId) => {
  const [projects] = await db.query(
    'SELECT * FROM projects p JOIN project_member pm ON p.id = pm.project_id WHERE pm.user_id = ?',
    [userId]
  );
  return projects;
};

const findProjectById = async (projectId) => {
  const [rows] = await db.query('SELECT * FROM projects WHERE id = ?', [projectId]);
  return rows[0];
};

const updateProject = async (projectId, name, description) => {
  const [result] = await db.query(
    'UPDATE projects SET project_name = ?, description = ? WHERE id = ?',
    [name, description, projectId]
  );
  return result.affectedRows > 0;
};

const deleteProject = async (projectId, userId) => {
  const sql = 'DELETE FROM projects WHERE id = ? AND created_by = ?';
  const [result] = await db.query(sql, [projectId, userId]);
  return result;
};

module.exports = {
  createProject,
  addProjectMember,
  getProjectsByUser,
  findProjectById,
  updateProject,
  deleteProject,
};
