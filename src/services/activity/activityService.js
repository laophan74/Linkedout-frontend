import { mockDataService } from '../mockDataService'

export const activityService = {
  query,
  save,
  getActivitiesLength,
  updateLastSeen,
}

async function query(filterBy = {}) {
  const activities = await mockDataService.getActivities()
  return activities
}

async function save(activity) {
  // Mock: just return success
  return Promise.resolve(activity)
}

async function getActivitiesLength(filterBy = {}) {
  const activities = await mockDataService.getActivities()
  return activities.length
}

async function updateLastSeen() {
  return await mockDataService.updateLastSeen()
}
