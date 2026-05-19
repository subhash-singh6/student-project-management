import API from '../api/axios'

export const adminService = {
  overview: () => API.get('/admin/overview'),
  users: () => API.get('/admin/users'),
  toggleUser: (id) => API.put(`/admin/users/${id}/toggle`),
}
