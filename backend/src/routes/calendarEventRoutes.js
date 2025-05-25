const express = require('express');
const router = express.Router();
const calendarEventService = require('../services/calendarEventService');
const { auth } = require('../middleware/auth');

// 일정 추가 (인증 필요)
router.post('/', auth, async (req, res) => {
  const { projectId, title, startTime, endTime, description, createdBy } = req.body;
  try {
    const result = await calendarEventService.createEvent(projectId, title, startTime, endTime, description, createdBy);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create event', error: error.message });
  }
});

// 일정 조회 (공개 가능, 인증 없이도 가능하게 하려면 그대로, 아니면 auth 적용)
router.get('/:id', async (req, res) => {
  const eventId = req.params.id;
  try {
    const event = await calendarEventService.getEventById(eventId);
    if (event.length > 0) {
      res.status(200).json(event[0]);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to get event', error: error.message });
  }
});

// 일정 수정 (인증 필요)
router.put('/:id', auth, async (req, res) => {
  const eventId = req.params.id;
  const { title, startTime, endTime, description } = req.body;
  try {
    const result = await calendarEventService.updateEvent(eventId, title, startTime, endTime, description);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Event updated' });
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update event', error: error.message });
  }
});

// 일정 삭제 (인증 필요)
router.delete('/:id', auth, async (req, res) => {
  const eventId = req.params.id;
  try {
    const result = await calendarEventService.deleteEvent(eventId);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Event deleted' });
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete event', error: error.message });
  }
});

module.exports = router;
