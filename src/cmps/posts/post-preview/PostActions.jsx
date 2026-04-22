import { useHistory } from 'react-router-dom'

export const PostActions = ({
  post,
  onLikePost,
  onSharePost,
  loggedInUser,
  isLiked,
}) => {
  const history = useHistory()

  const handleCommentClick = () => {
    // Navigate to detail page instead of toggle inline comments
    history.push(`/main/post/${post.userId}/${post._id}`)
  }

  return (
    <section className="button-container">
      <button className={`button flex-center ${isLiked ? 'liked' : ''}`} onClick={onLikePost} title="Like">
        <svg
          viewBox="0 0 24 24"
          className="btn-svg"
          width="22px"
          fill={isLiked ? '#dc2626' : 'none'}
          stroke={isLiked ? 'none' : 'currentColor'}
          strokeWidth={isLiked ? '0' : '2'}
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <path
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
              fill={isLiked ? '#dc2626' : 'none'}
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={isLiked ? '0' : '2'}
            ></path>
          </g>
        </svg>
      </button>
      <button className="button flex-center" onClick={handleCommentClick} title="Comment">
        <svg
          viewBox="0 0 24 24"
          className="btn-svg"
          width="22px"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <path d="M20 15a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12v4l4-4z" />
          </g>
        </svg>
      </button>
      <button className="button flex-center" onClick={() => onSharePost()} title="Share">
        <svg
          viewBox="0 0 24 24"
          className="btn-svg"
          width="22px"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </g>
        </svg>
      </button>
    </section>
  )
}
