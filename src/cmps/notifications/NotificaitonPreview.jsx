import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import TimeAgo from 'react-timeago'
import { useHistory } from 'react-router-dom'
import { postService } from '../../services/posts/postService'
import loadingCircle from '../../assets/imgs/loading-circle.gif'

export function NotificaitonPreview({ activity }) {
  const history = useHistory()
  const [str, setStr] = useState(null)
  const [link, setLink] = useState(null)
  const [createdByUser, setCreatedByUser] = useState(null)
  const [isActivityUnread, setIsActivityUnread] = useState(false)

  const { loggedInUser } = useSelector((state) => state.userModule)
  const { unreadActivities } = useSelector((state) => state.activityModule)

  const getUserId = (user) => (typeof user === 'object' ? user?._id : user)
  const getUserName = (user) =>
    getUserId(user) === loggedInUser?._id ? 'You' : user?.fullname || 'Someone'

  const checkIfActivityUnread = () => {
    return unreadActivities.some((activityId) => activityId === activity._id)
  }

  const buildActivityStr = async () => {
    const createdBy = activity.createdBy
    setCreatedByUser(createdBy)

    if (activity.type === 'like' || activity.type === 'comment') {
      const post = activity.postId ? await postService.getById(activity.postId) : null
      const action = activity.type === 'like' ? 'liked your post' : 'commented on your post'
      setLink(post ? `/main/post/${post.userId}/${activity.postId}` : '/main/feed')
      setStr(`${getUserName(createdBy)} ${action}`)
      return
    }

    if (activity.type === 'connection') {
      setLink(`/main/profile/${getUserId(createdBy)}`)
      setStr(`${getUserName(createdBy)} connected with you`)
      return
    }

    if (activity.type === 'message') {
      setLink('/main/message')
      setStr(`${getUserName(createdBy)} sent you a message`)
      return
    }

    setLink('/main/notifications')
    setStr('New activity')
  }

  useEffect(() => {
    setIsActivityUnread(checkIfActivityUnread())
    buildActivityStr()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activity, unreadActivities, loggedInUser?._id])

  return (
    <section
      className={`p-4 mb-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition ${isActivityUnread ? 'bg-blue-50' : 'bg-white'}`}
      onClick={() => {
        if (link) history.push(link)
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
            <p className="text-sm text-gray-900 flex-1">
              {str}
            </p>
            <p className="text-xs text-gray-500 whitespace-nowrap ml-2">
              <TimeAgo date={activity.createdAt} />
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
