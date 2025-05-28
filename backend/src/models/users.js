const db = require('../config/db');

exports.createUser = async (username, email, hashedPassword) => {
  const [rows] = await db.execute(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [username, email, hashedPassword]
  );
  return rows;
};

exports.findUserByEmail = async (email) => {
  const [rows] = await db.execute(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  return rows[0];
};

exports.findUserById = async (id) => {
  const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0];
};