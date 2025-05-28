const mysql = require('mysql2');

// MySQL 연결 설정
const pool = mysql.createPool({
    host: 'localhost',  // MySQL 서버 주소
    user: 'root',       // MySQL 사용자명
    password: '1234',       // MySQL 비밀번호
    database: 'collabmate', // 사용할 데이터베이스 이름
});

// 프로미스 기반으로 변환
const promisePool = pool.promise();

module.exports = promisePool;
