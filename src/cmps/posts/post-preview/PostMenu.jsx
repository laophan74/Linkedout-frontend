import { useSelector } from 'react-redux'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const PostMenu = ({
  toggleMenu,
  onRemovePost,
  postUserId,
  copyToClipBoard,
}) => {
  const { loggedInUser } = useSelector((state) => state.userModule)

  const [isAskAgain, setIsAskAgain] = useState(false)

  const isLoggedInUserCanDelete = loggedInUser._id === postUserId

  return (
    <section>
      <div
        className="bg-menu"
        onClick={(ev) => {
          ev.stopPropagation()
          toggleMenu()
        }}
      ></div>
      <section className="post-menu bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        {isLoggedInUserCanDelete && (
          <div className="container">
            <button
              className="delete-container text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsAskAgain((prev) => !prev)}
            >
              <FontAwesomeIcon
                className="trash-icon"
                icon="fa-solid fa-trash"
              />
              <p>Delete post</p>
            </button>
          </div>
        )}
        {isAskAgain && (
          <div className="ask-again bg-gray-100 dark:bg-gray-700">
            <p className="text-gray-900 dark:text-white">Are you sure?</p>
            <div className="opts">
              <p className="yes opt-btn text-red-600 dark:text-red-400" onClick={onRemovePost}>
                yes
              </p>
              <p className="no opt-btn text-gray-600 dark:text-gray-400" onClick={() => setIsAskAgain(false)}>
                no
              </p>
            </div>
          </div>
        )}

        <div className="copy-to-clip-board">
          <button
            className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={(ev) => {
              ev.stopPropagation()
              toggleMenu()
              copyToClipBoard()
            }}
          >
            <FontAwesomeIcon icon="fa-solid fa-copy" />
            <p>Copy link to post</p>
          </button>
        </div>
      </section>
    </section>
  )
}
