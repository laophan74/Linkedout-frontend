import { httpService } from '../httpService'
import { API_CONFIG } from '../../config/constants'

const ENDPOINTS = API_CONFIG.ENDPOINTS

export const activityService = {
  query,
  save,
  getActivitiesLength,
  updateLastSeen,
}

async function query(filterBy = {}) {
  return await httpService.get(ENDPOINTS.ACTIVITY_LIST, filterBy)
}

async function save(activity) {
  return await httpService.post(ENDPOINTS.ACTIVITY_LIST, activity)
}

async function getActivitiesLength(filterBy = {}) {
  const result = await httpService.get(ENDPOINTS.ACTIVITY_COUNT, filterBy)
  return result?.unreadCount ?? 0
}

async function updateLastSeen() {
  // Client-side operation, no backend call needed
  return Promise.resolve(true)
}
