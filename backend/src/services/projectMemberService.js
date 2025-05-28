// services/projectMemberService.js
const projectMemberModel = require('../models/projectMembers');

module.exports = {
  addMemberToProject: (...args) => projectMemberModel.addMember(...args),
  removeMemberFromProject: (...args) => projectMemberModel.removeMember(...args),
  getProjectMembers: (...args) => projectMemberModel.getMembersByProject(...args),
};