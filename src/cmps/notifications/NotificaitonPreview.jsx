import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { userService } from '../../services/user/userService'
import TimeAgo from 'react-timeago'
import { useHistory } from 'react-router-dom'
import { postService } from '../../services/posts/postService'
import loadingCircle from '../../assets/imgs/loading-circle.gif'

export function NotificaitonPreview({ activity }) {
  const history = useHistory()
  const [theNotLoggedUser, setTheNotLoggedUser] = useState(null)
  const [str, setStr] = useState(null)
  const [link, setLink] = useState(null)
  const [createdByUser, setCreatedByUser] = useState(null)
  const [createdToUser, setCreatedToUser] = useState(null)
  const [isActivityUnread, setIsActivityUnread] = useState(false)

  const { loggedInUser } = useSelector((state) => state.userModule)
  const { unreadActivities } = useSelector((state) => state.activityModule)

  const checkIfActivityUnread = () => {
    return unreadActivities.some((activityId) => activityId === activity._id)
  }

  const getTheNotLoggedInUser = async () => {
    const userId =
      activity.createdBy === loggedInUser._id
        ? activity.createdTo
        : activity.createdBy

    const user = await userService.getById(userId)
    setTheNotLoggedUser(user)
  }

  const getTheCreatedByUser = () => {
    const user =
      activity.createdBy === loggedInUser._id ? loggedInUser : theNotLoggedUser

    setCreatedByUser(user)
  }

  const getTheCreatedToUser = () => {
    const user =
      activity.createdTo === loggedInUser._id ? loggedInUser : theNotLoggedUser

    setCreatedToUser(user)
  }

  const buildActivityStr = async () => {
    if (!createdByUser || !createdToUser) return

    if (activity.type === 'add-like') {
      const post = await postService.getById(activity.postId)
      const str = `${
        createdByUser?._id === loggedInUser?._id
          ? 'You'
          : createdByUser?.fullname
      } liked  post of ${
        createdToUser._id === loggedInUser._id ? 'you' : createdToUser?.fullname
      }`

      const linkToPost = `post/${post?.userId}/${activity?.postId}`
      setLink(linkToPost)
      setStr(str)
    } else if (activity.type === 'remove-like') {
      const post = await postService.getById(activity.postId)
      const str = `${
        createdByUser?._id === loggedInUser?._id
          ? 'You'
          : createdByUser?.fullname
      } unliked  post of ${
        createdToUser._id === loggedInUser._id ? 'you' : createdToUser?.fullname
      }`

      const linkToPost = `post/${post?.userId}/${activity?.postId}`
      setLink(linkToPost)
      setStr(str)
    }
    //
    else if (activity.type === 'add-comment') {
      const post = await postService.getById(activity.postId)
      const str = `${
        createdByUser?._id === loggedInUser?._id
          ? 'You'
          : createdByUser?.fullname
      } added a comment in your post `

      const linkToPost = `post/${post?.userId}/${activity?.postId}`
      setLink(linkToPost)
      setStr(str)
    } else if (activity.type === 'private-message') {
      const str = `${createdByUser.fullname} sent you a private message`
      const linkToPost = `message/`
      setLink(linkToPost)
      setStr(str)
    }
  }

  useEffect(() => {
    buildActivityStr()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createdByUser, createdToUser])

  useEffect(() => {
    getTheCreatedToUser()
    getTheCreatedByUser()

    return () => {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theNotLoggedUser])

  useEffect(() => {
    if (!theNotLoggedUser) {
      getTheNotLoggedInUser()
    }

    const isActivityUnread = checkIfActivityUnread()

    setIsActivityUnread(isActivityUnread)

    return () => {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unreadActivities])

  return (
    <section
      className={`p-4 mb-3 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition ${isActivityUnread ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-white dark:bg-gray-900'}`}
      onClick={() => {
        history.push(link)
      }}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          {(createdByUser?.imgUrl && (
            <img src={createdByUser?.imgUrl} alt="" className="w-10 h-10 rounded-full cursor-pointer" />
          )) || <img src={loadingCircle} alt="" className="w-10 h-10 rounded-full" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <p className="text-sm text-gray-900 dark:text-white flex-1">
              {str}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
              <TimeAgo date={activity.createdAt} />
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
