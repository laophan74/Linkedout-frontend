import { utilService } from '../../services/utilService'
import { ConnectionPreview } from './ConnectionPreview'

export function ConnectionList({ users }) {
  if (!users?.length) {
    return (
      <div className="connection-list-empty">
        <h3>Your network is up to date</h3>
        <p>
          We will surface more relevant people here as your community grows.
        </p>
      </div>
    )
  }

  return (
    <ul className="connection-list">
      {users.map((user) => (
        <ConnectionPreview key={user._id || utilService.makeId()} user={user} />
      ))}
    </ul>
  )
}
