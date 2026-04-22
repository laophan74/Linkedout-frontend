import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { logout } from '../../store/actions/userActions'

export const Nav = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const menuRef = useRef(null)
  const [isMeMenuOpen, setIsMeMenuOpen] = useState(false)

  const { currPage } = useSelector((state) => state.postModule)
  const { loggedInUser } = useSelector((state) => state.userModule)
  const { unreadActivities, unreadMessages } = useSelector(
    (state) => state.activityModule
  )

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setIsMeMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const toggleMeMenu = () => {
    setIsMeMenuOpen((prevState) => !prevState)
  }

  const onGoToProfile = () => {
    setIsMeMenuOpen(false)
    history.push(`/main/profile/${loggedInUser?._id}`)
  }

  const onLogout = async () => {
    const didLogout = await dispatch(logout())
    setIsMeMenuOpen(false)
    if (didLogout) history.push('/')
  }

  return (
    <nav className="nav">
      <ul>
        <li className={`home ${currPage === 'home' ? 'current-btn' : ''}`}>
          <Link to="/main/feed">
            <p>
              <FontAwesomeIcon
                className={`nav-icon ${currPage === 'home' ? 'curr-logo' : ''}`}
                icon="fas fa-home-lg-alt"
              />
              <span>Home</span>
            </p>
          </Link>
        </li>
        <li className={`mynetwork ${currPage === 'mynetwork' ? 'current-btn' : ''}`}>
          <Link to={`/main/mynetwork`}>
            <p>
              <FontAwesomeIcon
                className={`nav-icon ${currPage === 'mynetwork' ? 'curr-logo' : ''}`}
                icon="fas fa-user-friends"
              />
              <span>My Network</span>
            </p>
          </Link>
        </li>
        <li className={`messaging ${currPage === 'message' ? 'current-btn' : ''}`}>
          <Link to={`/main/message`}>
            <p>
              <FontAwesomeIcon
                className={`nav-icon ${currPage === 'message' ? 'curr-logo' : ''}`}
                icon="fas fa-comment"
              />
              <span>Messaging</span>
              {unreadMessages?.length > 0 && (
                <span className="number">{unreadMessages?.length}</span>
              )}
            </p>
          </Link>
        </li>
        <li
          className={`notifications ${currPage === 'notifications' ? 'current-btn' : ''}`}
        >
          <Link to={`/main/notifications`}>
            <p>
              <FontAwesomeIcon
                className={`nav-icon ${currPage === 'notifications' ? 'curr-logo' : ''}`}
                icon="fas fa-bell"
              />
              <span>Notifications</span>
              {unreadActivities?.length > 0 && (
                <span className="number">{unreadActivities?.length}</span>
              )}
            </p>
          </Link>
        </li>
        <li
          ref={menuRef}
          className={`me-btn ${currPage === 'profile' ? 'current-btn' : ''} ${
            isMeMenuOpen ? 'menu-open' : ''
          }`}
        >
          <button type="button" className="me-trigger" onClick={toggleMeMenu}>
            <span className="avatar-wrap">
              <img src={loggedInUser?.imgUrl} alt="" className="profile-icon" />
            </span>
            <span className="me-trigger-label">
              <span className={`down-icon ${isMeMenuOpen ? 'open' : ''}`}>
                <FontAwesomeIcon icon="fa-solid fa-caret-down" />
              </span>
              <span className="txt">Me</span>
            </span>
          </button>

          {isMeMenuOpen && (
            <div className="me-dropdown">
              <button type="button" className="dropdown-item" onClick={onGoToProfile}>
                <FontAwesomeIcon icon="fa-solid fa-user" />
                <span>Profile</span>
              </button>
              <button type="button" className="dropdown-item" onClick={onLogout}>
                <FontAwesomeIcon icon="fa-solid fa-arrow-right-from-bracket" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </li>
        <li className="post-volunteer-btn">
          <p>
            <FontAwesomeIcon
              className={`nav-icon ${currPage === 'post-volunteer' ? 'curr-logo' : ''}`}
              icon="fas fa-plus"
            />
            more
          </p>
        </li>
      </ul>
    </nav>
  )
}
