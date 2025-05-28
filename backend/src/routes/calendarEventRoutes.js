const express = require('express');
const router = express.Router();
const calendarEventController = require('../controllers/calendarEventController');
const { auth } = require('../middleware/auth');

router.post('/', auth, calendarEventController.createEvent);
router.get('/:id', calendarEventController.getEventById);
router.put('/:id', auth, calendarEventController.updateEvent);
router.delete('/:id', auth, calendarEventController.deleteEvent);
router.get('/', calendarEventController.getEventsByProjectId);

module.exports = router;