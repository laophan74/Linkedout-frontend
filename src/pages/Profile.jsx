import { useHistory, useParams } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
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
import { connectToUser, getUsers } from '../store/actions/userActions'

function Profile() {
  const params = useParams()
  const history = useHistory()
  const dispatch = useDispatch()

  const [user, setUser] = useState(null)
  const [isShowImdProfile, setIsShowImdProfile] = useState(false)
  const [isShowEditModal, setIsShowEditModal] = useState(false)
  const [isConnected, setIsConnected] = useState(null)
  const [pendingSuggestionIds, setPendingSuggestionIds] = useState([])

  const { posts } = useSelector((state) => state.postModule)
  const { loggedInUser, users } = useSelector((state) => state.userModule)

  const isLoggedInUserProfile = loggedInUser?._id === user?._id

  const mutualConnectionLabel = useMemo(() => {
    if (!loggedInUser || !user || isLoggedInUserProfile) return ''

    if (isConnected) return `${user.fullname} is in your network`

    const loggedConnections = loggedInUser.connections || []
    if (!loggedConnections.length) return 'Grow your network to see mutual connections'

    const firstConnection = loggedConnections[0]
    const connectionName =
      typeof firstConnection === 'object'
        ? firstConnection.fullname || firstConnection.username
        : 'A mutual connection'

    return `${connectionName} is a mutual connection`
  }, [isConnected, isLoggedInUserProfile, loggedInUser, user])

  const headline =
    user?.headline || user?.profession || user?.bio || 'Professional member at Linkedout'
  const locationLine =
    user?.address || 'Open to networking and professional opportunities'
  const contactLabel = user?.website || user?.email || 'Contact info'
  const followersCount = user?.connections?.length || 0
  const profileBadge = (user?.fullname || user?.username || 'L')
    .trim()
    .charAt(0)
    .toUpperCase()

  const peopleYouMayKnow = useMemo(() => {
    if (!loggedInUser || !users?.length) return []

    const loggedConnectionIds = new Set(
      (loggedInUser.connections || []).map((connection) => connection?._id || connection)
    )

    return users
      .filter((suggestedUser) => {
        if (!suggestedUser?._id) return false
        if (suggestedUser._id === loggedInUser._id) return false
        if (suggestedUser._id === user?._id) return false
        if (loggedConnectionIds.has(suggestedUser._id)) return false
        if (pendingSuggestionIds.includes(suggestedUser._id)) return false
        return true
      })
      .slice(0, 5)
  }, [loggedInUser, pendingSuggestionIds, user?._id, users])

  const checkIsConnected = () => {
    const connected = loggedInUser?.connections?.some((connection) => {
      const connectionId = connection?._id || connection
      return connectionId === user?._id
    })

    setIsConnected(connected)
  }

  useEffect(() => {
    checkIsConnected()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loggedInUser])

  const loadUser = async () => {
    const loadedUser = await userService.getById(params.userId)
    setUser(() => loadedUser)
  }

  const toggleShowImgProfile = () => {
    setIsShowImdProfile((prev) => !prev)
  }

  const toggleShowEditModal = () => {
    setIsShowEditModal((prev) => !prev)
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

  const onConnectSuggestion = async (suggestedUserId) => {
    try {
      setPendingSuggestionIds((prevState) => [...prevState, suggestedUserId])
      await dispatch(connectToUser(suggestedUserId))
    } catch (err) {
      console.error('Failed to connect suggested user:', err)
      setPendingSuggestionIds((prevState) =>
        prevState.filter((pendingId) => pendingId !== suggestedUserId)
      )
    }
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
    dispatch(getUsers())

    return () => {
      dispatch(setFilterByPosts(null))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.userId, loggedInUser])

  if (!user) {
    return (
      <section className="feed-load">
        <span className="gif-container">
          <img className="loading-gif" src={loadingGif} alt="" />
        </span>
      </section>
    )
  }

  return (
    <section className="profile-page">
      <div className="left">
        <article className="user-profile">
          <div className="bg" style={{ backgroundImage: `url(${user.bg})` }}>
            <div className="profile-top-actions">
              {!isLoggedInUserProfile && (
                <button type="button" className="linkedin-badge" aria-label="LinkedIn style badge">
                  in
                </button>
              )}
            </div>

            <div className="img-container" onClick={toggleShowImgProfile}>
              <img src={user.imgUrl} alt={user.fullname} className="img" />
            </div>
          </div>

          <div className="user-details">
            <div className="profile-main">
              <div className="identity-block">
                <div className="name-row">
                  <h1>{user.fullname}</h1>
                  <span className="name-badge" aria-hidden="true">
                    <FontAwesomeIcon icon="fa-solid fa-user" />
                  </span>
                  {!isLoggedInUserProfile && <span className="network-degree">2nd</span>}
                </div>

                <p className="headline">{headline}</p>

                <div className="meta-row">
                  <span>{locationLine}</span>
                  <button type="button" className="contact-link">
                    {contactLabel}
                  </button>
                </div>

                <p className="followers">{followersCount.toLocaleString()} followers</p>

                {!!mutualConnectionLabel && (
                  <div className="mutual-row">
                    <img
                      src={loggedInUser?.imgUrl}
                      alt={loggedInUser?.fullname}
                      className="mutual-avatar"
                    />
                    <span>{mutualConnectionLabel}</span>
                  </div>
                )}

                <div className="btns-container">
                  {isLoggedInUserProfile ? (
                    <button className="primary-action" onClick={toggleShowEditModal}>
                      Edit profile
                    </button>
                  ) : (
                    <button className="primary-action" onClick={connectProfile}>
                      <FontAwesomeIcon icon="fa-solid fa-user-plus" />
                      <span>{isConnected ? 'Following' : 'Follow'}</span>
                    </button>
                  )}

                  {!isLoggedInUserProfile && (
                    <button className="secondary-action" onClick={moveToChat}>
                      <span>Message</span>
                    </button>
                  )}

                  <button className="ghost-action" type="button">
                    More
                  </button>
                </div>
              </div>

              <aside className="company-block">
                <div className="company-badge">{profileBadge}</div>
                <div>
                  <strong>{user.website || 'Linkedout'}</strong>
                  <p>{user.username || user.email}</p>
                </div>
              </aside>
            </div>
          </div>
        </article>

        <div className="user-posts">
          {(posts?.length && <PostsList posts={posts} />) || (
            <div className="empty-posts">
              <p>{user.fullname} has not published any posts yet.</p>
            </div>
          )}
        </div>
      </div>

      <div className="right">
        <div className="top-div">
          <h3>Profile highlights</h3>
          <p>Keep your profile active with recent posts, updated details, and stronger connections.</p>
        </div>
        <div className="people-card">
          <div className="people-card-header">
            <h3>People you may know</h3>
            <p>From your network</p>
          </div>

          <div className="people-list">
            {peopleYouMayKnow.length > 0 ? (
              peopleYouMayKnow.map((suggestedUser, idx) => {
                const suggestedHeadline =
                  suggestedUser.headline ||
                  suggestedUser.profession ||
                  suggestedUser.bio ||
                  'Professional member at Linkedout'
                const isPending = pendingSuggestionIds.includes(suggestedUser._id)

                return (
                  <article className="person-suggestion" key={suggestedUser._id}>
                    <div className="person-row">
                      <img
                        src={suggestedUser.imgUrl}
                        alt={suggestedUser.fullname}
                        className="person-avatar"
                        onClick={() => history.push(`/main/profile/${suggestedUser._id}`)}
                      />

                      <div className="person-copy">
                        <button
                          type="button"
                          className="person-name"
                          onClick={() => history.push(`/main/profile/${suggestedUser._id}`)}
                        >
                          {suggestedUser.fullname}
                          <span className="mini-degree">{idx < 2 ? '2nd' : '3rd+'}</span>
                        </button>
                        <p>{suggestedHeadline}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="person-action"
                      disabled={isPending}
                      onClick={() => onConnectSuggestion(suggestedUser._id)}
                    >
                      <FontAwesomeIcon
                        icon={idx < 2 ? 'fa-solid fa-plus' : 'fa-solid fa-user-plus'}
                      />
                      <span>{idx < 2 ? 'Follow' : isPending ? 'Connecting...' : 'Connect'}</span>
                    </button>
                  </article>
                )
              })
            ) : (
              <div className="people-empty">
                <p>No more suggestions right now. Check back after you grow your network.</p>
              </div>
            )}
          </div>

          <button type="button" className="show-all-btn" onClick={() => history.push('/main/mynetwork')}>
            Show all
            <FontAwesomeIcon icon="fa-solid fa-arrow-right-from-bracket" />
          </button>
        </div>
        <div className="bottom-div">
          <h3>Contact</h3>
          <p>{user.email || 'No public contact shared yet.'}</p>
          <p>{user.website || 'Add a website to complete the profile.'}</p>
        </div>
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
