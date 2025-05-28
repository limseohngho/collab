const authService = require('../services/authService');

exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const result = await authService.registerUser(username, email, password);
    if (!result.success) {
      return res.status(result.status).json({ msg: result.msg });
    }
    res.status(201).json(result.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await authService.loginUser(email, password);
    if (!result.success) {
      return res.status(result.status).json({ msg: result.msg });
    }
    res.status(200).json(result.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await authService.getMe(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getUserByEmail = async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ msg: "email is required" });
  try {
    const user = await authService.getUserByEmail(email);
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: "Server error" });
  }
};