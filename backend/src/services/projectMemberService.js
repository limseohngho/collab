// src/services/projectMemberService.js
const projectMemberModel = require('../models/projectMembers');

const addMemberToProject = async (projectId, userId, role) => {
  return await projectMemberModel.addMember(projectId, userId, role);
};

const removeMemberFromProject = async (projectId, userId) => {
  return await projectMemberModel.removeMember(projectId, userId);
};

const getProjectMembers = async (projectId) => {
  return await projectMemberModel.getMembersByProject(projectId);
};

module.exports = {
  addMemberToProject,
  removeMemberFromProject,
  getProjectMembers,
};
