const taskService = require('../services/taskService');

// Task 생성
const createTask = async (req, res) => {
  const { projectId, title, description, status } = req.body;
  try {
    const result = await taskService.createTask(projectId, title, description, status || 'TODO');
    res.status(201).json({ message: 'Task created successfully', result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 프로젝트의 모든 Task 조회
const getTasksByProject = async (req, res) => {
  const { projectId } = req.params;
  try {
    const tasks = await taskService.getTasksByProject(projectId);
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Task 수정
const updateTask = async (req, res) => {
  const { taskId } = req.params;
  try {
    const result = await taskService.updateTask(taskId, req.body);
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

module.exports = {
  createTask,
  getTasksByProject,
  updateTask,
  deleteTask,
};