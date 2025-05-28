const db = require('../config/db');

// 덮어쓰기: 이미 있으면 role만 바꿈, 없으면 추가
exports.addOrUpdateMember = async (projectId, userId, role = 'member') => {
  const [existingMember] = await db.query(
    'SELECT * FROM project_member WHERE project_id = ? AND user_id = ?',
    [projectId, userId]
  );
  if (existingMember.length > 0) {
    // 이미 있으면 role만 업데이트
    await db.query(
      'UPDATE project_member SET role = ? WHERE project_id = ? AND user_id = ?',
      [role || existingMember[0].role, projectId, userId]
    );
    return { updated: true };
  } else {
    // 없으면 새로 추가
    await db.query(
      'INSERT INTO project_member (project_id, user_id, role) VALUES (?, ?, ?)',
      [projectId, userId, role]
    );
    return { inserted: true };
  }
};

exports.removeMember = async (projectId, userId) => {
  const [result] = await db.query(
    'DELETE FROM project_member WHERE project_id = ? AND user_id = ?',
    [projectId, userId]
  );
  return result;
};

exports.getMembersByProject = async (projectId) => {
  const [rows] = await db.query(
    `SELECT u.id, u.username, u.email, pm.role
     FROM project_member pm
     JOIN users u ON pm.user_id = u.id
     WHERE pm.project_id = ?`,
    [projectId]
  );
  return rows;
};