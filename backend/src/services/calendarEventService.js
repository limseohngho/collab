// src/services/calendarEventService.js
const calendarEventModel = require('../models/calendarEvents');

const createEvent = (projectId, title, startTime, endTime, description, createdBy) => {
  return calendarEventModel.createEvent(projectId, title, startTime, endTime, description, createdBy);
};

const getEventById = (eventId) => {
  return calendarEventModel.getEventById(eventId);
};

const updateEvent = (eventId, title, startTime, endTime, description) => {
  return calendarEventModel.updateEvent(eventId, title, startTime, endTime, description);
};

const deleteEvent = (eventId) => {
  return calendarEventModel.deleteEvent(eventId);
};

const getEventsByProjectId = (projectId) => {
  return calendarEventModel.getEventsByProjectId(projectId);
};

module.exports = {
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventsByProjectId,
};
