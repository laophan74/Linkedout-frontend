import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { setCurrPage } from '../store/actions/postActions'
import { NotificationsList } from '../cmps/notifications/NotificationsList'
import loadingGif from '../assets/imgs/loading-gif.gif'
import {
  loadActivities,
  markActivitiesRead,
  setFilterByActivities,
  setUnreadActivitiesIds,
} from '../store/actions/activityAction'

function Notifications() {
  const dispatch = useDispatch()
  const { loggedInUser } = useSelector((state) => state.userModule)
  const { activities } = useSelector((state) => state.activityModule)

  const [visibleCount, setVisibleCount] = useState(6)

  useEffect(() => {
    dispatch(setCurrPage('notifications'))

    if (loggedInUser?._id) {
      dispatch(setFilterByActivities({ userId: loggedInUser._id }))
      dispatch(loadActivities())
    }

    return () => {
      if (loggedInUser?._id) {
        dispatch(markActivitiesRead())
        dispatch(setUnreadActivitiesIds())
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, loggedInUser?._id])

  if (!activities) {
    return (
      <div className="message-page">
        <div className="gif-container">
          <img className="loading-gif" src={loadingGif} alt="Loading..." />
        </div>
      </div>
    )
  }

  const visibleActivities = activities.slice(0, visibleCount)

  return (
    <div className="notifications-page">
      <div className="side-bar">
        <div className="container"></div>
      </div>

      <div className="main">
        <div className="container">
          <NotificationsList activities={visibleActivities} />
          {visibleCount < activities.length && (
            <button 
              className="show-more-btn" 
              onClick={() => setVisibleCount(prev => prev + 6)}
            >
              Show More
            </button>
          )}
        </div>
      </div>

      <div className="aside">
        <div className="container"></div>
      </div>
    </div>
  )
}

export default Notifications
