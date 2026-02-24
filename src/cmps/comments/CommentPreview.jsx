import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { removeComment } from '../../store/actions/postActions'
import { useHistory } from 'react-router-dom'
import { userService } from '../../services/user/userService'
import { utilService } from '../../services/utilService'
import { ReplyList } from '../replies/ReplyList'
import TimeAgo from 'react-timeago'

export const CommentPreview = ({ comment, onSaveComment, isReply = false }) => {
  const dispatch = useDispatch()
  const history = useHistory()

  const { userId, createdAt, postId, replies } = comment
  const [userComment, setUserComment] = useState(null)
  const [isShowMenu, setIsShowMenu] = useState(false)
  const [isShowReplyForm, setIsShowReplyForm] = useState(false)
  const [isShowReplyList, setIsShowReplyList] = useState(false)

  const [replyField, setReplyField] = useState({
    txt: '',
  })
  const { loggedInUser } = useSelector((state) => state.userModule)

  const toggleMenu = () => {
    setIsShowMenu((prevVal) => !prevVal)
  }

  const loadUserComment = async (userId) => {
    if (!userId) return
    const userComment = await userService.getById(userId)
    setUserComment(userComment)
  }

  const onRemoveComment = () => {
    dispatch(removeComment(comment))
    toggleMenu()
  }

  const addReply = () => {
    if (!replyField.txt.trim()) return
    const commentToSave = { ...comment }
    const newReply = {
      _id: utilService.makeId(24),
      userId: loggedInUser._id,
      postId: postId,
      commentId: comment._id,
      txt: replyField.txt,
      reactions: [],
      createdAt: new Date().getTime(),
    }
    commentToSave.replies.unshift(newReply)
    onSaveComment(commentToSave)
    setReplyField({ txt: '' })
    setIsShowReplyForm(false)
    setIsShowReplyList(true)
  }

  const updateReply = (replyToUpdate) => {
    const commentToSave = { ...comment }
    const idx = commentToSave.replies.findIndex(
      (reply) => reply._id === replyToUpdate._id
    )
    commentToSave.replies[idx] = replyToUpdate
    onSaveComment(commentToSave)
  }

  const handleChange = ({ target }) => {
    const field = target.name
    let value = target.type === 'number' ? +target.value || '' : target.value
    setReplyField({ [field]: value })
  }

  useEffect(() => {
    loadUserComment(userId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  if (!userComment) return null

  const isLoggedInUserOwner = comment.userId === loggedInUser._id

  const { imgUrl, fullname } = userComment

  const articleClass = isReply 
    ? 'p-6 mb-3 ml-6 lg:ml-12 text-base bg-white rounded-lg dark:bg-gray-900'
    : 'p-6 text-base bg-white rounded-lg dark:bg-gray-900'
  const borderClass = isReply ? '' : 'border-t border-gray-200 dark:border-gray-700'

  return (
    <article className={`${articleClass} ${borderClass}`}>
      <footer className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <p 
            className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold cursor-pointer hover:underline"
            onClick={() => history.push(`/main/profile/${userComment._id}`)}
          >
            <img
              className="mr-2 w-6 h-6 rounded-full"
              src={imgUrl}
              alt={fullname}
            />
            {fullname}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <time dateTime={createdAt} title={new Date(createdAt).toLocaleString()}>
              <TimeAgo date={createdAt} />
            </time>
          </p>
        </div>
        
        {/* Menu Button */}
        <div className="relative">
          <button
            id={`dropdownComment${comment._id}`}
            onClick={toggleMenu}
            className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 dark:text-gray-400 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            type="button"
          >
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 16 3"
            >
              <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
            </svg>
            <span className="sr-only">Comment settings</span>
          </button>

          {/* Dropdown Menu */}
          {isShowMenu && (
            <div
              className="z-10 w-36 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600 absolute right-0 top-full mt-1"
              onClick={(e) => e.stopPropagation()}
            >
              <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                {isLoggedInUserOwner && (
                  <>
                    <li>
                      <button
                        onClick={() => {
                          // TODO: Handle edit
                          toggleMenu()
                        }}
                        className="w-full text-left block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Edit
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          onRemoveComment()
                        }}
                        className="w-full text-left block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Remove
                      </button>
                    </li>
                  </>
                )}
                <li>
                  <button
                    onClick={() => {
                      // TODO: Handle report
                      toggleMenu()
                    }}
                    className="w-full text-left block py-2 px-4 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Report
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </footer>

      {/* Comment Text */}
      <p className="text-gray-500 dark:text-gray-400">{comment.txt}</p>

      {/* Comment Actions */}
      <div className="flex items-center mt-4 space-x-4">
        <button
          type="button"
          onClick={() => setIsShowReplyForm(!isShowReplyForm)}
          className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400 font-medium"
        >
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
          Reply
        </button>
      </div>

      {/* Reply Form */}
      {isShowReplyForm && (
        <div className="mt-4 ml-0 lg:ml-6">
          <form className="mb-4" onSubmit={(e) => { e.preventDefault(); addReply() }}>
            <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
              <label htmlFor={`reply-${comment._id}`} className="sr-only">Your reply</label>
              <textarea
                id={`reply-${comment._id}`}
                rows="3"
                name="txt"
                value={replyField.txt}
                onChange={handleChange}
                className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                placeholder="Write a reply..."
              />
            </div>
            {replyField.txt && (
              <button
                type="submit"
                className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
              >
                Post reply
              </button>
            )}
          </form>
        </div>
      )}

      {/* Replies List */}
      {replies && replies.length > 0 && (
        <div className="mt-4">
          {!isShowReplyList && (
            <button
              onClick={() => setIsShowReplyList(true)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Show {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
            </button>
          )}
          {isShowReplyList && (
            <>
              <button
                onClick={() => setIsShowReplyList(false)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium mb-3"
              >
                Hide {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
              </button>
              <ReplyList replies={replies} updateReply={updateReply} />
            </>
          )}
        </div>
      )}

      {/* Close menu when clicking outside */}
      {isShowMenu && (
        <div
          className="fixed inset-0"
          onClick={toggleMenu}
          style={{ zIndex: 9 }}
        />
      )}
    </article>
  )
}
