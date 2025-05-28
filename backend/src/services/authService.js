const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/users');

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

exports.registerUser = async (username, email, password) => {
  if (await userModel.findUserByEmail(email)) {
    return { success: false, status: 400, msg: 'Email already exists' };
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await userModel.createUser(username, email, hashedPassword);
  const newUser = await userModel.findUserByEmail(email);
  const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '1h' });
  return {
    success: true,
    data: {
      msg: 'User created',
      token,
      user: { id: newUser.id, username: newUser.username, email: newUser.email }
    }
  };
};

exports.loginUser = async (email, password) => {
  const user = await userModel.findUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return { success: false, status: 400, msg: 'Invalid email or password' };
  }
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
  return {
    success: true,
    data: {
      msg: 'Login successful',
      token,
      user: { id: user.id, username: user.username, email: user.email }
    }
  };
};

exports.getMe = async (userId) => {
  const user = await userModel.findUserById(userId);
  if (!user) return null;
  return { id: user.id, username: user.username, email: user.email };
};

exports.getUserByEmail = async (email) => {
  const user = await userModel.findUserByEmail(email);
  if (!user) return null;
  return { id: user.id, username: user.username, email: user.email };
};