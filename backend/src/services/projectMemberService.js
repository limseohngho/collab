const projectMemberModel = require('../models/projectMembers');

module.exports = {
  addOrUpdateMemberToProject: (...args) => projectMemberModel.addOrUpdateMember(...args),
  removeMemberFromProject: (...args) => projectMemberModel.removeMember(...args),
  getProjectMembers: (...args) => projectMemberModel.getMembersByProject(...args),
};