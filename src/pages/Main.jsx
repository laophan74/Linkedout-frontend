import { lazy, Suspense } from 'react'
import { Header } from '../cmps/header/Header'
import { Switch } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  loadActivities,
  setFilterByActivities,
  setUnreadActivitiesIds,
} from '../store/actions/activityAction'

import PrivateRoute from '../cmps/PrivateRoute'

const Feed = lazy(() => import('../pages/Feed'))
const SpecificPost = lazy(() => import('./SpecificPost'))
const Profile = lazy(() => import('./Profile'))
const MyNetwork = lazy(() => import('./MyNetwork'))
const Message = lazy(() => import('./Message'))
const Notifications = lazy(() => import('./Notifications'))
const Connections = lazy(() => import('./Connections'))

export function Main() {
  const dispatch = useDispatch()

  const { loggedInUser } = useSelector((state) => state.userModule)
  const { activities } = useSelector((state) => state.activityModule)

  useEffect(() => {
    if (loggedInUser?._id) {
      const filterBy = {
        userId: loggedInUser._id,
      }
      dispatch(setFilterByActivities(filterBy))
      dispatch(loadActivities())
    } else {
    }
  }, [dispatch, loggedInUser?._id])

  useEffect(() => {
    dispatch(setUnreadActivitiesIds())
    return () => {
      dispatch(setUnreadActivitiesIds())
    }
  }, [activities, dispatch])


  return (
    <div className="main-page container">
      <Header />
      <Suspense fallback={<h1>Loading...</h1>}>
        <Switch>
          <PrivateRoute path="/main/feed" component={Feed} />
          <PrivateRoute
            path="/main/post/:userId/:postId"
            render={(props) => <SpecificPost key={`${props.match.params.userId}-${props.match.params.postId}`} {...props} />}
          />
          <PrivateRoute path="/main/profile/:userId" component={Profile} />
          <PrivateRoute path="/main/mynetwork" component={MyNetwork} />
          <PrivateRoute path="/main/message/:userId?" component={Message} />
          <PrivateRoute path="/main/notifications" component={Notifications} />
          <PrivateRoute path="/main/connections" component={Connections} />
        </Switch>
      </Suspense>
    </div>
  )
}
