// src/projectController.js
const projectService = require('../services/projectService');

// 프로젝트 생성
const createProject = async (req, res) => {
  const { name, description } = req.body;
  const userId = req.user.userId;  // JWT에서 추출한 사용자 ID

  console.log('Request User:', req.user);
  if (!userId) {
    console.log('User ID is missing');
    return res.status(400).json({ msg: 'User ID is missing' });
  }

  try {
    const projectId = await projectService.createProject(name, description, userId);
    res.status(201).json({ projectId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// 프로젝트 목록 조회
const getProjects = async (req, res) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(400).json({ msg: 'User ID is missing' });
  }

  try {
    const projects = await projectService.getProjectsByUser(userId);
    res.status(200).json({ projects });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// 프로젝트 수정
const updateProject = async (req, res) => {
  const { projectId } = req.params;
  const { name, description } = req.body;
  const userId = req.user?.userId;

  if (!userId) return res.status(400).json({ msg: 'User ID is missing' });

  try {
    const updated = await projectService.updateProject(projectId, userId, name, description);
    if (!updated) {
      return res.status(403).json({ msg: 'Not authorized or project not found' });
    }
    res.status(200).json({ msg: 'Project updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// 프로젝트 삭제
const deleteProject = async (req, res) => {
  const projectId = req.params.id;
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(400).json({ msg: 'User ID is missing' });
  }

  try {
    await projectService.deleteProject(projectId, userId);
    res.status(200).json({ msg: 'Project deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};


module.exports = {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
};