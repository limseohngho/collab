//src/index.js
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const projectMemberRoutes = require('./routes/projectMemberRoutes');
const taskColumnRoutes = require('./routes/taskColumnRoutes');
const taskRoutes = require('./routes/taskRoutes');
const calendarEventRoutes = require('./routes/calendarEventRoutes');
const messageRoutes = require('./routes/messageRoutes');



const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// 미들웨어 설정
app.use(express.json()); // JSON 파싱
app.use(cors()); // CORS 설정

// 라우터 등록
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/project-members', projectMemberRoutes);
app.use('/api/task-columns', taskColumnRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/events', calendarEventRoutes);
app.use('/api/messages', messageRoutes);

// 클라이언트가 연결되었을 때 처리
io.on('connection', (socket) => {
  console.log('A user connected');
  
  // 메시지를 받을 때 처리
  socket.on('send_message', (data) => {
    // 데이터 처리 후, 다른 사용자에게 메시지를 전송
    io.emit('receive_message', data);  // 모든 연결된 클라이언트에 메시지 전송
  });

  // 연결 종료 처리
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// 서버 실행
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
