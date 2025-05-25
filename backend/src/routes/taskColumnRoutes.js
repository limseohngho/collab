const express = require('express');
const router = express.Router();
const taskColumnController = require('../controllers/taskColumnController');
const { auth } = require('../middleware/auth');

router.post('/', auth, taskColumnController.createColumn);
router.get('/:projectId', auth, taskColumnController.getColumns);
router.put('/:columnId', auth, taskColumnController.updateColumn);
router.delete('/:columnId', auth, taskColumnController.deleteColumn);

module.exports = router;
