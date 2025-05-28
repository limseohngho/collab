// services/messageService.js
const messageModel = require('../models/messages');

module.exports = {
  sendMessage: (...args) => messageModel.sendMessage(...args),
  getMessagesByProject: (...args) => messageModel.getMessagesByProject(...args),
};