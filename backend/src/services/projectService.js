const projectModel = require('../models/projects');

exports.createProject = async (name, description, userId) => {
  const projectId = await projectModel.createProject(name, description, userId);
  await projectModel.addProjectMember(projectId, userId, 'admin');
  return projectId;
};

exports.getProjectsByUser = (userId) => projectModel.getProjectsByUser(userId);

exports.updateProject = async (projectId, userId, name, description) => {
  const project = await projectModel.findProjectById(projectId);
  if (!project || project.created_by !== userId) return false;
  return await projectModel.updateProject(projectId, name, description);
};

exports.deleteProject = (projectId, userId) => projectModel.deleteProject(projectId, userId);