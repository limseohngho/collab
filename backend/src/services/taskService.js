const taskModel = require('../models/tasks');

const createTask = async (projectId, title, description, status) => {
  return await taskModel.createTask(projectId, title, description, status);
};

const getTasksByProject = async (projectId) => {
  return await taskModel.getTasksByProject(projectId);
};

const updateTask = async (taskId, fields) => {
  return await taskModel.updateTask(taskId, fields);
};

const deleteTask = async (taskId) => {
  return await taskModel.deleteTask(taskId);
};

module.exports = {
  createTask,
  getTasksByProject,
  updateTask,
  deleteTask,
};