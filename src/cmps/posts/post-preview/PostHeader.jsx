import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import TimeAgo from 'react-timeago'
import { useHistory } from 'react-router-dom'

export const PostHeader = ({ post, userPost, isLoading = false }) => {
  const history = useHistory()

  if (isLoading) {
    return (
      <section className="post-header post-header-loading">
        <span className="header-avatar-skeleton"></span>
        <div className="header-copy-skeleton">
          <span className="header-line header-line-name"></span>
          <span className="header-line header-line-time"></span>
        </div>
      </section>
    )
  }

  if (!userPost) {
    return (
      <section className="post-header post-header-loading">
        <span className="header-avatar-skeleton"></span>
        <div className="header-copy-skeleton">
          <span className="header-line header-line-name"></span>
          <span className="header-line header-line-time"></span>
        </div>
      </section>
    )
  }

  const { imgUrl, profession, fullname, username } = userPost
  const displayName = fullname || username || 'Linkedout member'

  return (
    <section className="post-header flex justify-between items-start">
      <div className="flex items-start">
        <img
          src={imgUrl}
          className="mr-3 w-10 h-10 rounded-full cursor-pointer"
          alt={displayName}
          onClick={() => history.push(`/main/profile/${userPost?._id}`)}
        />
        <div>
          <p
            className="inline-flex text-sm text-gray-900 font-semibold cursor-pointer hover:underline mb-1"
            onClick={() => history.push(`/main/profile/${userPost?._id}`)}
          >
            {displayName}
          </p>
          {!!profession && <div className="block text-sm text-gray-600 mb-1">{profession}</div>}
          <p
            className="text-xs text-gray-500 cursor-pointer hover:underline"
            onClick={() => history.push(`/main/post/${post.userId}/${post._id}`)}
          >
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
