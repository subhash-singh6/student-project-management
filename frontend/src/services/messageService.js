import API from '../api/axios'

export const messageService = {
  getTeamMessages: (teamId) => API.get(`/messages/team/${teamId}`),
}
