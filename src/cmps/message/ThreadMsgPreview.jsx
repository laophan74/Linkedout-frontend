import TimeAgo from 'react-timeago'
import { useHistory } from 'react-router-dom'
import loadingCircle from '../../assets/imgs/loading-circle.gif'

export function ThreadMsgPreview({ msg }) {
  const history = useHistory()
  const userMsg = typeof msg.senderId === 'object' ? msg.senderId : null

  return (
    <section className="mb-4">
      <div className="flex items-start mb-2">
        <img 
          src={userMsg?.imgUrl || loadingCircle}
          alt={userMsg?.fullname}
          className="mr-3 w-8 h-8 rounded-full cursor-pointer"
          onClick={() => history.push(`/main/profile/${userMsg?._id}`)}
        />
        <div className="flex items-center space-x-3">
          <p 
            className="text-sm text-gray-900 font-semibold cursor-pointer hover:underline"
            onClick={() => history.push(`/main/profile/${userMsg?._id}`)}
          >
            {userMsg?.fullname}
          </p>
          <p className="text-sm text-gray-600">
            <time dateTime={msg.createdAt} title={new Date(msg.createdAt).toLocaleString()}>
              <TimeAgo date={msg.createdAt} />
            </time>
          </p>
        </div>
      </div>
      <div className="ml-11 text-gray-700">
        <p>{msg.txt}</p>
      </div>
    </section>
  )
}
