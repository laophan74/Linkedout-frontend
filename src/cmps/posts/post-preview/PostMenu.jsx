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
      <section className="post-menu bg-white border border-gray-200">
        {isLoggedInUserCanDelete && (
          <div className="container">
            <button
              className="delete-container text-gray-700 hover:bg-gray-100"
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
          <div className="ask-again bg-gray-100">
            <p className="text-gray-900">Are you sure?</p>
            <div className="opts">
              <p className="yes opt-btn text-red-600" onClick={onRemovePost}>
                yes
              </p>
              <p className="no opt-btn text-gray-600" onClick={() => setIsAskAgain(false)}>
                no
              </p>
            </div>
          </div>
        )}

        <div className="copy-to-clip-board">
          <button
            className="text-gray-700 hover:bg-gray-100"
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
