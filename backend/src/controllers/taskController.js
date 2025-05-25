// src/controllers/taskController.js
const taskService = require('../services/taskService');

// Task 생성
const createTask = async (req, res) => {
  const { columnId, title, description, position } = req.body;
  try {
    const result = await taskService.createTask(columnId, title, description, position);
    res.status(201).json({ message: 'Task created successfully', result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 특정 컬럼의 Task 조회
const getTasksByColumnId = async (req, res) => {
  const { columnId } = req.params;
  try {
    const tasks = await taskService.getTasksByColumnId(columnId);
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Task 수정
const updateTask = async (req, res) => {
  const { taskId } = req.params;
  const { title, description, position } = req.body;
  try {
    const result = await taskService.updateTask(taskId, title, description, position);
    res.status(200).json({ message: 'Task updated successfully', result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Task 삭제
const deleteTask = async (req, res) => {
  const { taskId } = req.params;
  try {
    const result = await taskService.deleteTask(taskId);
    res.status(200).json({ message: 'Task deleted successfully', result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Task 위치/컬럼 이동
const moveTask = async (req, res) => {
  const { taskId } = req.params;
  const { newColumnId, newPosition } = req.body;
  try {
    const result = await taskService.moveTask(taskId, newColumnId, newPosition);
    res.status(200).json({ message: 'Task moved successfully', result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTask,
  getTasksByColumnId,
  updateTask,
  deleteTask,
  moveTask,
};
