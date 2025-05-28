const db = require('../config/db');

// 사용자 생성
async function createUser(username, email, hashedPassword) {
  const [rows] = await db.execute(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [username, email, hashedPassword]
  );
  return rows;
}

// 이메일로 사용자 찾기
async function findUserByEmail(email) {
  const [rows] = await db.execute(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  return rows[0]; // user 객체 또는 undefined 반환
}

async function findUserById(id) {
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
}


module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
};