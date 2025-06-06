const projectMemberService = require('../services/projectMemberService');

exports.addOrUpdateMember = async (req, res) => {
  const { projectId, userId, role } = req.body;
  if (!projectId || !userId) {
    return res.status(400).json({ msg: 'projectId and userId are required' });
  }
  try {
    await projectMemberService.addOrUpdateMemberToProject(projectId, userId, role);
    res.status(201).json({ msg: 'Member added or updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.removeMember = async (req, res) => {
  const { projectId, userId } = req.body;
  try {
    await projectMemberService.removeMemberFromProject(projectId, userId);
    res.status(200).json({ msg: 'Member removed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getMembers = async (req, res) => {
  const projectId = req.query.projectId;
  if (!projectId) return res.status(400).json({ msg: 'projectId is required' });
  try {
    const members = await projectMemberService.getProjectMembers(projectId);
    res.status(200).json(members);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};