import { useHistory } from 'react-router-dom'

export const PostActions = ({
  post,
  onLikePost,
  onSharePost,
  loggedInUser,
}) => {
  const history = useHistory()

  const isLogedInUserLikePost = post?.reactions?.some((reaction) => {
    return (
      loggedInUser && loggedInUser._id && loggedInUser?._id === reaction.userId
    )
  })

  const likeBtnStyle = isLogedInUserLikePost ? 'liked' : ''
  
  const handleCommentClick = () => {
    // Navigate to detail page instead of toggle inline comments
    history.push(`/main/post/${post.userId}/${post._id}`)
  }

  return (
    <section className="post-actions">
      <button className={'like ' + likeBtnStyle + ' text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'} onClick={onLikePost}>
        <svg
          className="mr-1.5 w-3.5 h-3.5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4.008 8.714H1V18h3.008M4.008 8.714c2.763.071 4.527.055 6.011 0 0-3.707.785-6.714 3.008-6.714 1.497 0 1.994 2.297 1.994 3.571 0 2.143-1.994 3.143-1.994 3.143h3.979c.114 0 .224.013.333.036l.086.023A1.5 1.5 0 0 1 18 10.205v.5a1.5 1.5 0 0 1-1.5 1.5h-.5a1.5 1.5 0 0 1-1.5 1.5h-.5a1.5 1.5 0 0 1-1.5 1.5h-.5a1.5 1.5 0 0 1-1.5 1.5h-5.006V8.714Z"
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
