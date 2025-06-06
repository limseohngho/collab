const express = require('express');
const { auth } = require('../middleware/auth');
const authController = require('../controllers/authController');
const router = express.Router();

router.post('/signup', authController.registerUser);
router.post('/login', authController.loginUser);
router.get('/me', auth, authController.getMe);
router.get('/by-email', auth, authController.getUserByEmail);

module.exports = router;