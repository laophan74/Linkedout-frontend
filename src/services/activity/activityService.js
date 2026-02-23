import { httpService } from '../httpService'

export const activityService = {
  query,
  save,
  getActivitiesLength,
  updateLastSeen,
}

async function query(filterBy = {}) {
  return await httpService.get(`activity`, filterBy)
}

async function save(activity) {
  return await httpService.post(`activity`, activity)
}

async function getActivitiesLength(filterBy = {}) {
  const result = await httpService.get('activity/count', filterBy)
  return result?.unreadCount ?? 0
}

async function updateLastSeen() {
  // Client-side operation, no backend call needed
  return Promise.resolve(true)
}
