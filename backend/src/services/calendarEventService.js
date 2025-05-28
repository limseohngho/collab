const calendarEventModel = require('../models/calendarEvents');

module.exports = {
  createEvent: (...args) => calendarEventModel.createEvent(...args),
  getEventById: (...args) => calendarEventModel.getEventById(...args),
  updateEvent: (...args) => calendarEventModel.updateEvent(...args),
  deleteEvent: (...args) => calendarEventModel.deleteEvent(...args),
  getEventsByProjectId: (...args) => calendarEventModel.getEventsByProjectId(...args),
};