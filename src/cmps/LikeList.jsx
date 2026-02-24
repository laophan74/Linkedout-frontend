import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { utilService } from '../services/utilService'
import { LikePreview } from './LikePreview'

export function LikeList({ reactions, toggleLikes }) {
  return (
    <section className="like-list bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
      <div className="title">
        <h2 className="text-gray-900 dark:text-white">Reactions:</h2>
        <FontAwesomeIcon
          onClick={() => toggleLikes()}
          className="logo-close text-gray-600 dark:text-gray-400"
          icon="fa-solid fa-x"
        />
      </div>
      <div>
        <div className="all">
          <p className="text-gray-700 dark:text-gray-300">All {reactions?.length}</p>
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
