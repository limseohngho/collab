const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
// 인증이 필요한 API라면 auth 추가
const { auth } = require('../middleware/auth');

router.post('/', auth, taskController.createTask);
router.get('/column/:columnId', auth, taskController.getTasksByColumnId);
router.put('/:taskId', auth, taskController.updateTask);
router.delete('/:taskId', auth, taskController.deleteTask);
router.put('/move/:taskId', auth, taskController.moveTask);

module.exports = router;
