import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { utilService } from '../services/utilService'
import { LikePreview } from './LikePreview'

export function LikeList({ reactions, toggleLikes }) {
  return (
    <section className="like-list bg-white border border-gray-200">
      <div className="title">
        <h2 className="text-gray-900">Reactions:</h2>
        <FontAwesomeIcon
          onClick={() => toggleLikes()}
          className="logo-close text-gray-600"
          icon="fa-solid fa-x"
        />
      </div>
      <div>
        <div className="all">
          <p className="text-gray-700">All {reactions?.length}</p>
        </div>
      </div>
      <div className="list">
        {reactions.map((reaction) => (
          <LikePreview key={utilService.makeId()} reaction={reaction} />
        ))}
      </div>
    </section>
  )
}
