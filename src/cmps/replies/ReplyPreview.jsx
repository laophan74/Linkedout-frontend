import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { userService } from '../../services/user/userService'
import TimeAgo from 'react-timeago'

export const ReplyPreview = ({ reply, updateReply }) => {
  const { userId } = reply
  const history = useHistory()
  const { loggedInUser } = useSelector((state) => state.userModule)
  const [userReply, setUserReply] = useState(null)
  const [ isShowMenu, setIsShowMenu] = useState(false)

  // eslint-disable-next-line no-unused-vars
  const handleLikeReply = () => {
    const replyToUpdate = { ...reply }
    const isAlreadyLike = replyToUpdate.reactions.some(
      (reaction) => reaction.userId === loggedInUser._id
    )
    if (isAlreadyLike) {
      replyToUpdate.reactions = replyToUpdate.reactions.filter(
        (reaction) => reaction.userId !== loggedInUser._id
      )
    } else if (!isAlreadyLike) {
      replyToUpdate.reactions.push({
        userId: loggedInUser._id,
        fullname: loggedInUser.fullname,
        reaction: 'like',
      })
    }
    updateReply(replyToUpdate)
  }

  const loadUser = async () => {
    const userReply = await userService.getById(userId)
    setUserReply(userReply)
  }

  useEffect(() => {
    loadUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!userReply) return null

  const isLoggedInUserOwner = reply.userId === loggedInUser._id

  const toggleMenu = () => {
    setIsShowMenu((prevVal) => !prevVal)
  }

  return (
    <article className="p-6 mb-3 ml-6 lg:ml-12 text-base bg-white rounded-lg dark:bg-gray-900">
      <footer className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <p 
            className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold cursor-pointer hover:underline"
            onClick={() => history.push(`/main/profile/${userReply._id}`)}
          >
            <img
              className="mr-2 w-6 h-6 rounded-full"
              src={userReply.imgUrl}
              alt={userReply.fullname}
            />
            {userReply.fullname}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <time pubdate dateTime={reply.createdAt} title={new Date(reply.createdAt).toLocaleString()}>
              <TimeAgo date={reply.createdAt} />
            </time>
          </p>
        </div>

        {/* Menu Button */}
        <div className="relative">
          <button
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
                          // TODO: Handle delete
                          toggleMenu()
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

      {/* Reply Text */}
      <p className="text-gray-500 dark:text-gray-400">{reply.txt}</p>

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
