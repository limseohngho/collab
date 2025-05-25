// services/projectService.js
const projectModel = require('../models/projects');

const createProject = async (name, description, userId) => {
  const projectId = await projectModel.createProject(name, description, userId);
  await projectModel.addProjectMember(projectId, userId, 'admin');
  return projectId;
};

const getProjectsByUser = async (userId) => {
  // userId가 멤버로 포함된 프로젝트 목록을 조회
  const projects = await projectModel.getProjectsByUser(userId);
  return projects;
};

const updateProject = async (projectId, userId, name, description) => {
  // 사용자가 이 프로젝트의 admin인지 확인한 후에 수정
  const project = await projectModel.findProjectById(projectId);
  if (!project || project.created_by !== userId) {
    return false; // 권한 없음 또는 존재하지 않음
  }

  return await projectModel.updateProject(projectId, name, description);
};

const deleteProject = async (projectId, userId) => {
  // 사용자 확인 포함 (보안 강화)
  return await projectModel.deleteProject(projectId, userId);
};

module.exports = {
  createProject,
  getProjectsByUser,
  updateProject,
  deleteProject,
};