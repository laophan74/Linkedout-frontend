import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useRef, useState } from 'react'

import { uploadImg } from '../../services/imgUpload.service'
import LoadingGif from '../../assets/imgs/loading-gif.gif'

const getEmptyPost = () => ({
  body: '',
  imgBodyUrl: null,
  style: {
    textAlign: 'ltr',
  },
})

export const CreatePostModal = ({
  toggleShowCreatePost,
  onAddPost,
  isShowCreatePost,
  loggedInUser,
  initialAction,
}) => {
  const [newPost, setNewPost] = useState(getEmptyPost)
  const [isUploding, setIsUploding] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const textareaRef = useRef(null)
  const imageInputRef = useRef(null)

  const handleChange = (e) => {
    const field = e.target.name
    const value =
      e.target.type === 'number' ? +e.target.value || '' : e.target.value
    setNewPost((prevPost) => ({
      ...prevPost,
      [field]: value,
    }))
  }

  useEffect(() => {
    if (!isShowCreatePost) return

    textareaRef.current?.focus()

    if (initialAction === 'photo') {
      imageInputRef.current?.click()
    }
  }, [initialAction, isShowCreatePost])

  const resetComposer = () => {
    setNewPost(getEmptyPost())
    setIsUploding(false)
    setIsSubmitting(false)
  }

  const handleClose = () => {
    resetComposer()
    toggleShowCreatePost()
  }

  const doSubmit = async () => {
    const trimmedBody = newPost.body.trim()
    const hasContent = trimmedBody || newPost.imgBodyUrl

    if (!hasContent || isUploding || isSubmitting) return

    try {
      setIsSubmitting(true)
      const savedPost = await onAddPost({
        ...newPost,
        body: trimmedBody,
      })

      if (savedPost) handleClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  const onUploadImg = async (ev) => {
    const file = ev.target.files?.[0]
    if (!file) return

    try {
      setIsUploding(true)
      const res = await uploadImg(ev)
      setNewPost((prev) => {
        return {
          ...prev,
          imgBodyUrl: res.url,
        }
      })
    } catch (err) {
      console.log(err)
    } finally {
      setIsUploding(false)
      ev.target.value = ''
    }
  }

  const removeImage = () => {
    setNewPost((prev) => ({ ...prev, imgBodyUrl: null }))
  }

  const isSubmitDisabled =
    isUploding ||
    isSubmitting ||
    (!newPost.body.trim() && !newPost.imgBodyUrl)

  return (
    <section
      className={
        isShowCreatePost ? ' create-post-modal' : 'hide create-post-modal'
      }
      onClick={(ev) => {
        ev.stopPropagation()
        handleClose()
      }}
    >
      <form
        className="container"
        onSubmit={(ev) => {
          ev.preventDefault()
          doSubmit()
        }}
        onClick={(ev) => {
          ev.stopPropagation()
        }}
      >
        <div className="title">
          <div>
            <h1>Create a post</h1>
            <p>Share an update with your network</p>
          </div>
          <button type="button" className="close-icon" onClick={handleClose}>
            <FontAwesomeIcon icon="fa-solid fa-x" />
          </button>
        </div>

        <div className="name-container">
          <div className="img-container">
            <img src={loggedInUser?.imgUrl} alt="" className="img-profile" />
          </div>
          <div className="name">
            <h2>{loggedInUser?.fullname}</h2>
            <p>Posting to anyone</p>
          </div>
        </div>

        <div className="input-container">
          <textarea
            ref={textareaRef}
            onChange={handleChange}
            type="text"
            id="body"
            name="body"
            value={newPost.body}
            placeholder="What do you want to talk about?"
          ></textarea>
        </div>

        <div className="is-loading-container">
          {isUploding && (
            <span>
              <img src={LoadingGif} alt="Uploading media" />
              Uploading media...
            </span>
          )}
        </div>

        {newPost.imgBodyUrl && (
          <div className="media-preview">
            <div className="container-img-body">
              <button
                type="button"
                className="remove-media-btn"
                onClick={removeImage}
              >
                <FontAwesomeIcon icon="fa-solid fa-xmark" />
              </button>
              <div className="body-img">
                <img src={newPost.imgBodyUrl} alt="" className="img" />
              </div>
            </div>
          </div>
        )}

        <div className="modal-footer">
          <ul className="composer-actions" aria-label="Post composer actions">
            {!newPost.imgBodyUrl && (
              <li className="icon-content">
                <label
                  htmlFor="imgUrl"
                  className="action-btn"
                  aria-label="Add photo"
                  data-action="photo"
                >
                  <div className="filled"></div>
                  <FontAwesomeIcon icon="fa-solid fa-image" />
                </label>
                <input
                  ref={imageInputRef}
                  onChange={onUploadImg}
                  id="imgUrl"
                  type="file"
                  name="imgUrl"
                  accept="image/*"
                  hidden
                />
                <div className="tooltip">Add photo</div>
              </li>
            )}

          </ul>

          <button
            type="submit"
            className="primary-post-btn"
            disabled={isSubmitDisabled}
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </section>
  )
}
