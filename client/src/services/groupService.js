import api from './api';

const createGroup = (groupData) => {
  return api.post('/groups', groupData);
};

const getGroups = () => {
  return api.get('/groups');
};

const getGroupById = (groupId) => {
  return api.get(`/groups/${groupId}`);
};

const updateGroup = (groupId, groupData) => {
  return api.put(`/groups/${groupId}`, groupData);
};

const deleteGroup = (groupId) => {
  return api.delete(`/groups/${groupId}`);
};

const addMember = (groupId, email) => {
  return api.post(`/groups/${groupId}/members`, { email });
};

const removeMember = (groupId, memberId) => {
  return api.delete(`/groups/${groupId}/members/${memberId}`);
};

export default {
  createGroup,
  getGroups,
  getGroupById,
  updateGroup,
  deleteGroup,
  addMember,
  removeMember
};