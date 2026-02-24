import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import TimeAgo from 'react-timeago'
import { useHistory } from 'react-router-dom'
import loadingCircle from '../../../assets/imgs/loading-circle.gif'

export const PostHeader = ({ post, userPost }) => {
  const history = useHistory()

  if (!userPost)
    return (
      <section className="post-header">
        <img className="loading-circle" src={loadingCircle} alt="" />
      </section>
    )

  const { imgUrl, profession, fullname } = userPost
  return (
    <section className="flex justify-between items-start">
      <div className="flex items-start">
        <img 
          src={imgUrl} 
          className="mr-3 w-10 h-10 rounded-full cursor-pointer"
          alt={fullname}
          onClick={() => history.push(`/main/profile/${userPost?._id}`)}
        />
        <div>
          <p 
            className="inline-flex text-sm text-gray-900 dark:text-white font-semibold cursor-pointer hover:underline mb-1"
            onClick={() => history.push(`/main/profile/${userPost?._id}`)}
          >
            {fullname}
          </p>
          <div className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
            {profession}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 cursor-pointer hover:underline" onClick={() => history.push(`/main/post/${post.userId}/${post._id}`)}>
            <time dateTime={post.createdAt} title={new Date(post.createdAt).toLocaleString()}>
              <TimeAgo date={post.createdAt} />
            </time>
            {post?.position?.lat && post?.position?.lng && (
              <span className="ml-2">
                <FontAwesomeIcon icon="fa-solid fa-location-dot" />
              </span>
            )}
          </p>
        </div>
      </div>
    </section>
  )
}
