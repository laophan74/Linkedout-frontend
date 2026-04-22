import { Link, useHistory } from 'react-router-dom'

export function MyConnectionPreview({ connection }) {
  const history = useHistory()

  if (!connection) return null

  return (
    <section className="my-connection-preview">
      <div className="connection-card">
        <Link
          to={`/main/profile/${connection._id}`}
          className="avatar-shell"
          aria-label={`View ${connection.fullname}'s profile`}
        >
          <img
            src={connection.imgUrl}
            alt={connection.fullname}
            className="avatar-img"
          />
        </Link>

        <section className="content-shell">
          <div className="text-block">
            <Link to={`/main/profile/${connection._id}`} className="name-link">
              <h3>{connection.fullname}</h3>
            </Link>
            <h4>{connection.headline || connection.profession || connection.bio || 'Professional member'}</h4>
          </div>
        </section>

        <div className="action-shell">
          <button
            type="button"
            className="message-btn"
            onClick={() => history.push(`/main/message/${connection._id}`)}
          >
            Message
          </button>
        </div>
      </div>
    </section>
  )
}
