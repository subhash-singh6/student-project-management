import API from '../api/axios'

export const projectService = {
  getAll: () => API.get('/projects'),
  getById: (id) => API.get(`/projects/${id}`),
  create: (data) => API.post('/projects', data),
  update: (id, data) => API.put(`/projects/${id}`, data),
  remove: (id) => API.delete(`/projects/${id}`),
  approve: (id, body) => API.put(`/projects/${id}/approve`, body),
  grade: (id, body) => API.put(`/projects/${id}/grade`, body),
}
