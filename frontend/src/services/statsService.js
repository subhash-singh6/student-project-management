import API from '../api/axios'

export const statsService = {
  leaderboard: () => API.get('/stats/leaderboard'),
  myStats: () => API.get('/stats/me'),
  system: () => API.get('/stats/system'),
}
