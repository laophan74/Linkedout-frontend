import { useEffect, useMemo, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSelector } from 'react-redux'
import { MyConnectionPreview } from '../cmps/connections/MyConnectionPreview'
import { userService } from '../services/user/userService'
import loadingGif from '../assets/imgs/loading-gif.gif'

function Connections() {
  const [connections, setConnections] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const { loggedInUser } = useSelector((state) => state.userModule)

  useEffect(() => {
    const loadConnections = async () => {
      if (!loggedInUser?._id) return

      try {
        setIsLoading(true)
        const loadedConnections = await userService.getConnections(loggedInUser._id)
        setConnections(Array.isArray(loadedConnections) ? loadedConnections : [])
      } catch (err) {
        console.error('Failed to load connections:', err)
        setConnections([])
      } finally {
        setIsLoading(false)
      }
    }

    loadConnections()
  }, [loggedInUser?._id])

  const filteredConnections = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase()
    if (!normalizedTerm) return connections

    return connections.filter((connection) =>
      connection?.fullname?.toLowerCase().includes(normalizedTerm)
    )
  }, [connections, searchTerm])

  if (!loggedInUser) return null

  if (isLoading) {
    return (
      <section className="connections-page">
        <div className="connections-loading">
          <img className="loading-gif" src={loadingGif} alt="Loading connections..." />
        </div>
      </section>
    )
  }

  return (
    <section className="connections-page">
      <div className="left main">
        <div className="container">
          <div className="count">
            <h3>{connections.length} Connections</h3>
            <p>Stay in touch with the people already in your network.</p>
          </div>

          <div className="filter-container">
            <div className="search">
              <FontAwesomeIcon className="search-icon" icon="fas fa-search" />
              <input
                type="text"
                onChange={(ev) => setSearchTerm(ev.target.value)}
                value={searchTerm}
                placeholder="Search by name"
                className="connections-input"
              />
            </div>
          </div>

          <div className="my-connection-list">
            {!filteredConnections.length && (
              <div className="connections-empty">
                <h4>No connections found</h4>
                <p>
                  {searchTerm
                    ? 'Try a different name or clear the search.'
                    : 'Connect with people from My Network to see them here.'}
                </p>
              </div>
            )}

            {filteredConnections.map((connection) => (
              <MyConnectionPreview
                key={connection._id}
                connection={connection}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="right aside">
        <div className="connections-aside-card">
          <h4>Grow your network</h4>
          <p>
            Search through your existing connections, start conversations, and
            keep your professional circle active.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Connections
