// src/services/taskService.js
const taskModel = require('../models/tasks');

// Task 생성
const createTask = async (columnId, title, description, position) => {
  try {
    const result = await taskModel.createTask(columnId, title, description, position);
    return result;
  } catch (error) {
    throw new Error('Failed to create task: ' + error.message);
  }
};

// 특정 컬럼의 Task 조회
const getTasksByColumnId = async (columnId) => {
  try {
    const tasks = await taskModel.getTasksByColumnId(columnId);
    return tasks;
  } catch (error) {
    throw new Error('Failed to get tasks: ' + error.message);
  }
};

// Task 수정
const updateTask = async (taskId, title, description, position) => {
  try {
    const result = await taskModel.updateTask(taskId, title, description, position);
    return result;
  } catch (error) {
    throw new Error('Failed to update task: ' + error.message);
  }
};

// Task 삭제
const deleteTask = async (taskId) => {
  try {
    const result = await taskModel.deleteTask(taskId);
    return result;
  } catch (error) {
    throw new Error('Failed to delete task: ' + error.message);
  }
};

// Task 위치/컬럼 이동
const moveTask = async (taskId, newColumnId, newPosition) => {
  try {
    const result = await taskModel.moveTask(taskId, newColumnId, newPosition);
    return result;
  } catch (error) {
    throw new Error('Failed to move task: ' + error.message);
  }
};

module.exports = {
  createTask,
  getTasksByColumnId,
  updateTask,
  deleteTask,
  moveTask,
};
