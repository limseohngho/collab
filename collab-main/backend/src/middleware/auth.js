const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'secretkey';

exports.auth = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
  try {
    req.user = jwt.verify(token, SECRET_KEY);
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};