import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ConnectionList } from '../cmps/connections/ConnectionList'
import { getUsers, setUsers } from '../store/actions/userActions'
import { setCurrPage } from '../store/actions/postActions'
import loadingGif from '../assets/imgs/loading-gif.gif'

function MyNetwork() {
  const dispatch = useDispatch()
  const history = useHistory()

  const { users, loggedInUser } = useSelector((state) => state.userModule)

  const connectionsCount = loggedInUser?.connections?.length || 0
  const isUserConnected = (userId) => {
    return loggedInUser?.connections?.some((connection) => {
      const connectionId = connection?.userId || connection?._id || connection
      return connectionId === userId
    })
  }

  const suggestions =
    users?.filter((user) => {
      return user?._id !== loggedInUser?._id && !isUserConnected(user?._id)
    }) || []
  const suggestionCount = suggestions.length

  useEffect(() => {
    dispatch(getUsers())
    dispatch(setCurrPage('mynetwork'))

    return () => {
      dispatch(setUsers(null))
    }
  }, [dispatch])

  if (!users) {
    return (
      <section className="network">
        <span className="gif-container">
          <img className="loading-gif" src={loadingGif} alt="" />
        </span>
      </section>
    )
  }

  return (
    <section className="my-network-page">
      <aside className="network-sidebar">
        <section className="manage-network-card">
          <header className="card-head">
            <h2>Manage my network</h2>
            <button
              className="manage-action"
              type="button"
              onClick={() => history.push('/main/connections')}
            >
              <FontAwesomeIcon icon="fa-solid fa-arrow-up-right-from-square" />
            </button>
          </header>

          <ul className="manage-list">
            <li>
              <button
                type="button"
                onClick={() => history.push('/main/connections')}
              >
                <span className="item-main">
                  <span className="item-icon">
                    <FontAwesomeIcon icon="fa-solid fa-user-group" />
                  </span>
                  <span className="item-label">Connections</span>
                </span>
                <span className="item-count">{connectionsCount}</span>
              </button>
            </li>
            <li>
              <button type="button">
                <span className="item-main">
                  <span className="item-icon">
                    <FontAwesomeIcon icon="fa-solid fa-user-plus" />
                  </span>
                  <span className="item-label">People you may know</span>
                </span>
                <span className="item-count">{suggestionCount}</span>
              </button>
            </li>
            <li>
              <button type="button">
                <span className="item-main">
                  <span className="item-icon">
                    <FontAwesomeIcon icon="fa-solid fa-address-book" />
                  </span>
                  <span className="item-label">Contacts</span>
                </span>
                <span className="item-count">{users.length}</span>
              </button>
            </li>
          </ul>
        </section>

        <section className="network-summary-card">
          <p className="summary-kicker">Network strength</p>
          <h3>Grow faster with relevant connections</h3>
          <p className="summary-copy">
            Keep building your professional circle to unlock more profile
            views, conversations, and opportunities.
          </p>

          <div className="summary-stats">
            <article>
              <strong>{connectionsCount}</strong>
              <span>connections</span>
            </article>
            <article>
              <strong>{suggestionCount}</strong>
              <span>suggestions</span>
            </article>
          </div>
        </section>
      </aside>

      <main className="network-main">
        <section className="network-hero-card">
          <div className="hero-copy">
            <p className="hero-eyebrow">My Network</p>
            <h1>Connect with people who can help you grow</h1>
            <p>
              Discover members from your broader community and keep your
              network active the same way LinkedIn's My Network page does.
            </p>
          </div>

          <div className="hero-metrics">
            <article>
              <span className="metric-value">{connectionsCount}</span>
              <span className="metric-label">Current connections</span>
            </article>
            <article>
              <span className="metric-value">{suggestionCount}</span>
              <span className="metric-label">Fresh recommendations</span>
            </article>
          </div>
        </section>

        <section className="recommended-card">
          <header className="recommended-head">
            <div>
              <p className="section-overline">Recommended for you</p>
              <h2>People you may know</h2>
            </div>
            <button
              className="browse-connections"
              type="button"
              onClick={() => history.push('/main/connections')}
            >
              See all connections
            </button>
          </header>

          <ConnectionList users={suggestions} />
        </section>
      </main>
    </section>
  )
}

export default MyNetwork
