import { useHistory, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { userService } from '../services/user/userService'
import { PostsList } from '../cmps/posts/PostsList'
import { ImgPreview } from '../cmps/profile/ImgPreview'
import loadingGif from '../assets/imgs/loading-gif.gif'
import { EditModal } from '../cmps/profile/EditModal'
import {
  getPostsLength,
  loadPosts,
  setCurrPage,
  setFilterByPosts,
} from '../store/actions/postActions'

function Profile() {
  const params = useParams()
  const history = useHistory()
  const dispatch = useDispatch()

  const [user, setUser] = useState(null)
  const [isShowImdProfile, setIsShowImdProfile] = useState(false)
  const [isShowEditModal, setIsShowEditModal] = useState(false)
  const [isConnected, setIsConnected] = useState(null)

  const { posts } = useSelector((state) => state.postModule)
  const { loggedInUser } = useSelector((state) => state.userModule)

  const checkIsConnected = () => {
    const isConnected = loggedInUser?.connections?.some((connection) => {
      const connectionId = connection?._id || connection
      return connectionId === user?._id
    })

    setIsConnected(isConnected)
  }

  useEffect(() => {
    checkIsConnected()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const loadUser = async () => {
    const user = await userService.getById(params.userId)
    setUser(() => user)
  }

  const toggleShowImgProfile = () => {
    setIsShowImdProfile((prev) => !prev)
  }
  const toggleShowEditModal = () => {
    setIsShowEditModal((prev) => !prev)
  }

  const onShowProfile = () => {
    toggleShowImgProfile()
  }

  const connectProfile = async () => {
    if (!user) return

    if (isConnected === true) {
      await userService.disconnectUser(user._id)
    } else if (isConnected === false) {
      await userService.connectUser(user._id)
    }

    const refreshedLoggedInUser = await userService.getProfile()
    dispatch({ type: 'UPDATE_LOGGED_IN_USER', user: refreshedLoggedInUser })

    const refreshedUser = await userService.getById(user._id)
    setUser(refreshedUser)
  }

  const moveToChat = () => {
    history.push(`/main/message/${user?._id}`)
  }

  useEffect(() => {
    const filterBy = {
      userId: params.userId,
    }
    dispatch(setCurrPage('profile'))
    dispatch(setFilterByPosts(filterBy))
    loadUser()
    dispatch(loadPosts(filterBy))
    dispatch(getPostsLength())

    return () => {
      dispatch(setFilterByPosts(null))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.userId, loggedInUser])

  if (!user)
    return (
      <section className="feed-load">
        <span className="gif-container">
          <img className="loading-gif" src={loadingGif} alt="" />
        </span>
      </section>
    )

  const isLoggedInUserProfile = loggedInUser?._id === user?._id

  return (
    <section className="profile-page">
      <div className="left">
        <div className="user-profile">
          <div className="bg" style={{ backgroundImage: `url(${user.bg})` }}>
            <div className="img-container" onClick={onShowProfile}>
              <img src={user.imgUrl} alt="" className="img" />
            </div>
          </div>

          <div className="user-details">
            <div>
              <div className="name">
                <h1>{user.fullname}</h1>
              </div>
              <div className="profession">
                <p>{user.profession}</p>
              </div>
              <div className="profession">
                <p>{user.email}</p>
              </div>
              <div className="btns-container">
                {isLoggedInUserProfile && (
                  <button className="add-details" onClick={toggleShowEditModal}>
                    Edit profile
                  </button>
                )}
                {!isLoggedInUserProfile && (
                  <button className="connect" onClick={connectProfile}>
                    <FontAwesomeIcon icon="fa-solid fa-user-plus" />
                    <p>{!isConnected ? 'Connect' : 'Disconnect'}</p>
                  </button>
                )}

                <button className="message" onClick={() => moveToChat()}>
                  Message
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="user-posts">
          {(posts?.length && <PostsList posts={posts} />) || (
            <div>
              <p>{user.fullname} has not published any posts yet.</p>
            </div>
          )}
        </div>
      </div>
      <div className="right">
        <div className="top-div"></div>
        <div className="bottom-div"></div>
      </div>
      {isShowImdProfile && (
        <ImgPreview
          toggleShowImg={toggleShowImgProfile}
          imgUrl={user.imgUrl}
          title="Profile photo"
        />
      )}

      {isShowEditModal && (
        <EditModal toggleShowEditModal={toggleShowEditModal} user={user} />
      )}
    </section>
  )
}

export default Profile
