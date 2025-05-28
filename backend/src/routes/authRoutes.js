const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail, findUserById } = require('../models/users');
const router = express.Router();
const { auth } = require('../middleware/auth');

// 회원가입 API
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ msg: 'Email already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await createUser(username, email, hashedPassword);

        // 새 사용자 정보 가져오기 (id, username, email)
        const userId = newUser.insertId || newUser.id;
        const user = { id: userId, username, email };

        const token = jwt.sign({ userId }, 'secretkey', { expiresIn: '1h' });
        // token + user 정보 반환
        res.status(201).json({ msg: 'User created', token, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// 로그인 API
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(400).json({ msg: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid email or password' });
        }
        const token = jwt.sign({ userId: user.id }, 'secretkey', { expiresIn: '1h' });
        // token + user 정보 반환
        res.status(200).json({
            msg: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// 내 정보 반환 API
router.get('/me', auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await findUserById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json({
            id: user.id,
            username: user.username,
            email: user.email,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;