// src/services/taskColumnService.js
const taskColumnModel = require('../models/taskColumns');

const createColumn = (projectId, name, position) => {
  return taskColumnModel.createColumn(projectId, name, position);
};

const getColumnsByProject = (projectId) => {
  return taskColumnModel.getColumnsByProject(projectId);
};

const updateColumn = (columnId, name, position) => {
  return taskColumnModel.updateColumn(columnId, name, position);
};

const deleteColumn = (columnId) => {
  return taskColumnModel.deleteColumn(columnId);
};

module.exports = {
  createColumn,
  getColumnsByProject,
  updateColumn,
  deleteColumn,
};
