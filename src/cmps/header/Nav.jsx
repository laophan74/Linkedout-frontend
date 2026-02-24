import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

export const Nav = () => {
  const THEME_STORAGE_KEY = 'theme'
  const { currPage } = useSelector((state) => state.postModule)

  const { loggedInUser } = useSelector((state) => state.userModule)
  const { unreadActivities } = useSelector((state) => state.activityModule)
  const { unreadMessages } = useSelector((state) => state.activityModule)

  const getInitialTheme = () => {
    if (typeof window === 'undefined') return 'light'
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY)
    if (storedTheme === 'dark' || storedTheme === 'light') return storedTheme
    const prefersDark =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    return prefersDark ? 'dark' : 'light'
  }

  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.body.classList.toggle('theme-dark', theme === 'dark')
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  return (
    <nav className="nav">
      <ul>
        <li
          className={`home ${currPage === 'home' ? 'current-btn' : ''}`}
        >
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
        <li
          className={`mynetwork ${currPage === 'mynetwork' ? 'current-btn' : ''}`}
        >
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
        <li
          className={`messaging ${currPage === 'message' ? 'current-btn' : ''}`}
        >
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
          className={`me-btn ${currPage === 'profile' ? 'current-btn' : ''}`}
        >
          <Link to={`/main/profile/${loggedInUser?._id}`}>
            <p>
              <span>
                <img
                  src={loggedInUser?.imgUrl}
                  alt=""
                  className="profile-icon"
                />
              </span>
              <span className="txt">Me</span>
            </p>
          </Link>
        </li>
        <li className="theme-toggle">
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <p>
              <FontAwesomeIcon
                className={`nav-icon ${theme === 'dark' ? 'curr-logo' : ''}`}
                icon={theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'}
              />
              <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </p>
          </button>
        </li>
        <li className="post-volunteer-btn">
          <p>
            <FontAwesomeIcon
              className={
                'nav-icon' +
                ' ' +
                (currPage === 'post-volunteer' ? 'curr-logo' : '')
              }
              icon="fas fa-plus"
            />
            more
          </p>
        </li>
      </ul>
    </nav>
  )
}
