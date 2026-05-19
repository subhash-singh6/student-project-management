import { ROLE_HOME } from '../constants/navigation'

export const getDashboardPath = (role) => ROLE_HOME[role] || '/login'
