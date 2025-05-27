// src/models/projectMembers.js
const db = require('../config/db');

// 팀원 추가 함수
const addMember = async (projectId, userId, role = 'member') => {
  // 중복 체크: 동일한 프로젝트에 동일한 사용자가 존재하는지 확인
  const checkQuery = 'SELECT * FROM project_member WHERE project_id = ? AND user_id = ?';
  const [existingMember] = await db.query(checkQuery, [projectId, userId]);

  if (existingMember.length > 0) {
    throw new Error(`User with ID ${userId} is already a member of project ${projectId}`);
  }

  // 중복이 없으면 멤버 추가
  const query = 'INSERT INTO project_member (project_id, user_id, role) VALUES (?, ?, ?)';
  const [result] = await db.query(query, [projectId, userId, role]);
  return result;
};

// 팀원 삭제 함수
const removeMember = async (projectId, userId) => {
  const query = 'DELETE FROM project_member WHERE project_id = ? AND user_id = ?';
  const [result] = await db.query(query, [projectId, userId]);
  return result;
};

const getMembersByProject = async (projectId) => {
  // 유저 정보까지 조인해서 반환
  const query = `
    SELECT u.id, u.username, u.email, pm.role
    FROM project_member pm
    JOIN users u ON pm.user_id = u.id
    WHERE pm.project_id = ?
  `;
  const [rows] = await db.query(query, [projectId]);
  return rows;
};

module.exports = {
  addMember,
  removeMember,
  getMembersByProject,
};
