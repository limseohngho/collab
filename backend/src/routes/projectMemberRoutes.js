const express = require('express');
const router = express.Router();
const projectMemberController = require('../controllers/projectMemberController');
const { auth } = require('../middleware/auth');

// 덮어쓰기(추가/업데이트) 엔드포인트로 교체!
router.post('/add', auth, projectMemberController.addOrUpdateMember);
router.delete('/remove', auth, projectMemberController.removeMember);
router.get('/', auth, projectMemberController.getMembers);

module.exports = router;