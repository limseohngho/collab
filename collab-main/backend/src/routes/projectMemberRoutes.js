const express = require('express');
const router = express.Router();
const projectMemberController = require('../controllers/projectMemberController');
const { auth } = require('../middleware/auth');

router.post('/add', auth, projectMemberController.addOrUpdateMember);
router.delete('/remove', auth, projectMemberController.removeMember);
router.get('/', auth, projectMemberController.getMembers);

module.exports = router;