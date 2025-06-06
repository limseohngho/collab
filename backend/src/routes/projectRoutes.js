const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { auth } = require('../middleware/auth');

router.post('/', auth, projectController.createProject);
router.get('/', auth, projectController.getProjects);
router.put('/:projectId', auth, projectController.updateProject);
router.delete('/:id', auth, projectController.deleteProject);

module.exports = router;