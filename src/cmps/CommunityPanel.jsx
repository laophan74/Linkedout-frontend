import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

const shortcuts = [
  {
    label: 'Saved items',
    icon: 'fa-solid fa-bookmark',
  },
  {
    label: 'Groups',
    icon: 'fa-solid fa-user-group',
  },
  {
    label: 'Newsletters',
    icon: 'fa-solid fa-newspaper',
  },
  {
    label: 'Events',
    icon: 'fa-solid fa-calendar-days',
  },
]

export function CommunityPanel() {
  const history = useHistory()
  const { loggedInUser } = useSelector((state) => state.userModule)

  const connectionsCount = loggedInUser?.connections?.length || 0

  return (
    <section className="community-panel">
      <article
        className="community-card network-card"
        onClick={() => history.push('/main/mynetwork')}
      >
        <div className="network-copy">
          <h3>Connection</h3>
          <p>Grow your network</p>
        </div>

        <span className="network-count">{connectionsCount}</span>
      </article>

      <article className="community-card quick-links-card">
        {shortcuts.map((item) => (
          <button key={item.label} type="button" className="quick-link">
            <span className="quick-link-icon">
              <FontAwesomeIcon icon={item.icon} />
            </span>
            <span className="quick-link-label">{item.label}</span>
          </button>
        ))}
      </article>
    </section>
  )
}
