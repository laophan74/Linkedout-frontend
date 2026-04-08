import { useHistory } from 'react-router-dom'

export const PostActions = ({
  post,
  onLikePost,
  onSharePost,
  loggedInUser,
  isLiked,
}) => {
  const history = useHistory()

  const isLogedInUserLikePost = isLiked

  const likeBtnStyle = 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200'
  const iconColorClass = isLogedInUserLikePost
    ? 'text-blue-600 dark:text-blue-400'
    : 'text-gray-500 dark:text-gray-400'
  const likeBtnFill = isLogedInUserLikePost ? 'currentColor' : 'none'

  const handleCommentClick = () => {
    // Navigate to detail page instead of toggle inline comments
    history.push(`/main/post/${post.userId}/${post._id}`)
  }

  return (
    <section className="post-actions">
      <button className={likeBtnStyle} onClick={onLikePost}>
        <svg
          className={`mr-1.5 w-3.5 h-3.5 ${iconColorClass}`}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill={likeBtnFill}
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"
          />
        </svg>
        <span>Like</span>
      </button>
      <button className="comment text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={handleCommentClick}>
        <svg
          className="mr-1.5 w-3.5 h-3.5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 18"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 5h5M5 8h2m6-3h2m-5 3h6m2-7H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3v5l5-5h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"
          />
        </svg>
        <span>Comment</span>
      </button>
      <button className="share text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => onSharePost()}>
        <svg
          className="mr-1.5 w-3.5 h-3.5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 18 16"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M1.248 15C.22 11.77 2.275 4.232 9.466 4.232V2.079a1.025 1.025 0 0 1 1.644-.862l5.479 4.307a1.108 1.108 0 0 1 0 1.723l-5.48 4.307a1.026 1.026 0 0 1-1.643-.861V8.539C6.169 9.277 2.753 11.803 1.248 15Z"
          />
        </svg>
        <span>Share</span>
      </button>
    </section>
  )
}
