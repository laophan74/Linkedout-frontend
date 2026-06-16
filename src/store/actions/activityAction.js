import { activityService } from '../../services/activity/activityService'

export function loadActivities() {
  return async (dispatch, getState) => {
    try {
      const { filterByActivities } = getState().activityModule
      const activities = await activityService.query(filterByActivities)

      dispatch({ type: 'SET_ACTIVITIES', activities })
    } catch (err) {
      console.log('err:', err)
    }
  }
}

export function saveActivity(activity) {
  return async (dispatch) => {
    try {
      const addedActivity = await activityService.save(activity)
      activity._id
        ? dispatch({ type: 'UPDATE_ACTIVITY', activity: addedActivity })
        : dispatch({ type: 'ADD_ACTIVITY', activity: addedActivity })
    } catch (err) {
      console.log('err:', err)
    }
  }
}

export function getActivitiesLength() {
  return async (dispatch, getState) => {
    try {
      const { filterByActivities } = getState().activityModule
      const activitiesLength = await activityService.getActivitiesLength(
        filterByActivities
      )
      dispatch({ type: 'SET_ACTIVITIES_LENGTH', activitiesLength })
    } catch (err) {
      console.log('err:', err)
    }
  }
}

export function addFilterByActivities(filterByActivities) {
  return async (dispatch) => {
    dispatch({ type: 'ADD_FILTER_BY_ACTIVITIES', filterByActivities })
  }
}

export function setFilterByActivities(filterByActivities) {
  return async (dispatch) => {
    dispatch({ type: 'SET_FILTER_BY_ACTIVITIES', filterByActivities })
  }
}

export function setUnreadActivitiesIds() {
  return async (dispatch, getState) => {
    const { activities } = getState().activityModule
    const { loggedInUser } = getState().userModule

    if (!activities) return
    if (!loggedInUser) return
    const getUserId = (user) => (typeof user === 'object' ? user?._id : user)
    const unreadActivities = []
    const unreadMessages = []
    activities.forEach((activity) => {
      if (getUserId(activity.createdBy) === loggedInUser._id) return
      if (activity.isRead) return

      if (activity.type === 'message') {
        unreadMessages.push(activity.chatId)
        return
      }

      unreadActivities.push(activity._id)
    })

    dispatch({ type: 'SET_UNREAD_ACTIVITIES', unreadActivities })
    dispatch({ type: 'SET_UNREAD_MESSAGES', unreadMessages })
  }
}

export function markActivitiesRead() {
  return async (dispatch) => {
    try {
      await activityService.updateLastSeen()
      dispatch({ type: 'MARK_ACTIVITIES_READ' })
    } catch (err) {
      console.log('err:', err)
    }
  }
}

export function markMessagesRead() {
  return async (dispatch, getState) => {
    try {
      const { activities } = getState().activityModule
      const messageActivityIds = activities
        .filter((activity) => activity.type === 'message')
        .map((activity) => activity._id)

      if (messageActivityIds.length) await activityService.markMessagesRead()
      dispatch({ type: 'MARK_MESSAGES_READ' })
    } catch (err) {
      console.log('err:', err)
    }
  }
}
