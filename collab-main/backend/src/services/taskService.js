const taskModel = require('../models/tasks');

module.exports = {
  createTask: (...args) => taskModel.createTask(...args),
  getTasksByProject: (...args) => taskModel.getTasksByProject(...args),
  updateTask: (...args) => taskModel.updateTask(...args),
  deleteTask: (...args) => taskModel.deleteTask(...args),
};