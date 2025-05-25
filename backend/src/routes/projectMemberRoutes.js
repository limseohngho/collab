const express = require('express');
const router = express.Router();
const projectMemberController = require('../controllers/projectMemberController');
const { auth } = require('../middleware/auth');

router.post('/add', auth, projectMemberController.addMember);
router.delete('/remove', auth, projectMemberController.removeMember);

module.exports = router;
