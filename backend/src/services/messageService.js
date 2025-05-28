// src/services/messageService.js
const messageModel = require('../models/messages');

const sendMessage = async (projectId, senderId, message) => {
  return await messageModel.sendMessage(projectId, senderId, message);
};

const getMessagesByProject = async (projectId) => {
  return await messageModel.getMessagesByProject(projectId);
};

module.exports = {
  sendMessage,
  getMessagesByProject,
};