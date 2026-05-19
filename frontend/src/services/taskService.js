import API from '../api/axios'

export const taskService = {
  getByProject: (projectId) => API.get(`/tasks/project/${projectId}`),
  create: (data) => API.post('/tasks', data),
  update: (id, data) => API.put(`/tasks/${id}`, data),
  move: (id, data) => API.put(`/tasks/${id}/move`, data),
  remove: (id) => API.delete(`/tasks/${id}`),
}
