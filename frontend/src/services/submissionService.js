import API from '../api/axios'

export const submissionService = {
  create: (formData) =>
    API.post('/submissions', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  my: () => API.get('/submissions/my'),
  byProject: (projectId) => API.get(`/submissions/project/${projectId}`),
}
