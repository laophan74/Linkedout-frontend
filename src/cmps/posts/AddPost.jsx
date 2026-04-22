import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useDispatch, useSelector } from 'react-redux'
import { CreatePostModal } from './CreatePostModal'
import { useState } from 'react'
import { savePost } from '../../store/actions/postActions'

export const AddPost = () => {
  const dispatch = useDispatch()

  const { loggedInUser } = useSelector((state) => state.userModule)

  const [isShowCreatePost, setIsShowCreatePost] = useState(false)
  const [initialComposerAction, setInitialComposerAction] = useState(null)

  const openComposer = (action = null) => {
    setInitialComposerAction(action)
    setIsShowCreatePost(true)
  }

  const closeComposer = () => {
    setInitialComposerAction(null)
    setIsShowCreatePost(false)
  }

  const onAddPost = async (post) => {
    const postToAdd = {
      ...post,
      userId: loggedInUser._id,
      fullname: loggedInUser.fullname,
    }
    return await dispatch(savePost(postToAdd))
  }

  return (
    <section className="add-post bg-white border-2 border-gray-200 rounded-lg" onClick={() => openComposer()}>
      <section className="top">
        <div className="img-container">
          <img src={loggedInUser.imgUrl} alt="" className="icon" />
        </div>
        <button type="button" className="input-container bg-white text-gray-600 hover:bg-gray-100">
          <span>Start a post</span>
        </button>
      </section>

      <section className="btns-container">
        <button
          type="button"
          className="bg-white text-gray-600 hover:bg-gray-100"
          onClick={(ev) => {
            ev.stopPropagation()
            openComposer('photo')
          }}
        >
          <FontAwesomeIcon className="photo icon" icon="fa-solid fa-image" />
          <span>Photo</span>
        </button>
        <button
          type="button"
          className="bg-white text-gray-600 hover:bg-gray-100"
          onClick={(ev) => {
            ev.stopPropagation()
            openComposer()
          }}
        >
          <FontAwesomeIcon
            className="calendar icon"
            icon="fa-solid fa-calendar-days"
          />
          <span>Event</span>
        </button>
        <button
          type="button"
          className="bg-white text-gray-600 hover:bg-gray-100"
          onClick={(ev) => {
            ev.stopPropagation()
            openComposer()
          }}
        >
          <FontAwesomeIcon
            className="newspaper icon"
            icon="fa-solid fa-newspaper"
          />
          <span>Write article</span>
        </button>
      </section>
      {
        <CreatePostModal
          isShowCreatePost={isShowCreatePost}
          toggleShowCreatePost={closeComposer}
          onAddPost={onAddPost}
          loggedInUser={loggedInUser}
          initialAction={initialComposerAction}
        />
      }
    </section>
  )
}
