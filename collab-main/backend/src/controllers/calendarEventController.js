const calendarEventService = require('../services/calendarEventService');

exports.createEvent = async (req, res) => {
  const { projectId, title, startTime, endTime, description, createdBy } = req.body;
  try {
    const result = await calendarEventService.createEvent(projectId, title, startTime, endTime, description, createdBy);
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create event', error: error.message });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await calendarEventService.getEventById(req.params.id);
    if (event.length > 0) res.status(200).json(event[0]);
    else res.status(404).json({ message: 'Event not found' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get event', error: error.message });
  }
};

exports.updateEvent = async (req, res) => {
  const { title, startTime, endTime, description } = req.body;
  try {
    const result = await calendarEventService.updateEvent(req.params.id, title, startTime, endTime, description);
    if (result.affectedRows > 0) res.status(200).json({ message: 'Event updated' });
    else res.status(404).json({ message: 'Event not found' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update event', error: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const result = await calendarEventService.deleteEvent(req.params.id);
    if (result.affectedRows > 0) res.status(200).json({ message: 'Event deleted' });
    else res.status(404).json({ message: 'Event not found' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete event', error: error.message });
  }
};

exports.getEventsByProjectId = async (req, res) => {
  const { projectId } = req.query;
  if (!projectId) return res.status(400).json({ message: "projectId is required" });
  try {
    const events = await calendarEventService.getEventsByProjectId(projectId);
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get events', error: error.message });
  }
};