// src/controllers/messageController.js
const messageService = require('../services/messageService');

const sendMessage = async (req, res) => {
  const { projectId, message } = req.body;
  const senderId = req.user?.userId;

  try {
    const result = await messageService.sendMessage(projectId, senderId, message);
    res.status(201).json({ message: 'Message sent', result });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send message', error: err.message });
  }
};

const getMessages = async (req, res) => {
  const projectId = req.params.projectId;

  try {
    const messages = await messageService.getMessagesByProject(projectId);
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch messages', error: err.message });
  }
};

module.exports = {
  sendMessage,
  getMessages,
};
