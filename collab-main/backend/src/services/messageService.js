const messageModel = require('../models/messages');

exports.sendMessage = (projectId, senderId, message) => {
  return messageModel.sendMessage(projectId, senderId, message);
};

exports.getMessagesByProject = (projectId) => {
  return messageModel.getMessagesByProject(projectId);
};