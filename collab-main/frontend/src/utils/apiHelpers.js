import api from './api';
export async function getUserInfo() { const res = await api.get('/api/auth/me'); return res.data; }
export async function getProjects() { const res = await api.get('/api/projects'); return res.data.projects || []; }
export async function createProject(name, description) { const res = await api.post('/api/projects', { name, description }); return res.data; }
