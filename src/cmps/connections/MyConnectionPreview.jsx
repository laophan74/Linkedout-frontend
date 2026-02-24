import { userService } from '../../services/user/userService'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import TimeAgo from 'react-timeago'
import { Link, useHistory } from 'react-router-dom'

export function MyConnectionPreview({ connection }) {
  const [user, setUser] = useState(null)

  const history = useHistory()

  const loadUser = async () => {
    const user = await userService.getById(connection.userId)
    setUser(() => user)
  }

  useEffect(() => {
    loadUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!user) return

  return (
    <section className="p-4 mb-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <Link to={`/main/profile/${user._id}`} className="flex-1 flex items-start">
          <img src={user.imgUrl} alt="" className="w-10 h-10 rounded-full mr-3 cursor-pointer" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white hover:underline cursor-pointer">
              {user.fullname}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {user.profession || 'No profession'}
            </p>
            {connection?.connected && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Connected <TimeAgo date={connection?.connected} />
              </p>
            )}
          </div>
        </Link>
        <div className="flex items-center gap-2 ml-2">
          <button 
            onClick={() => history.push(`/main/message/${user?._id}`)}
            className="py-1 px-3 text-xs font-medium text-white bg-primary-700 hover:bg-primary-800 rounded transition"
          >
            Message
          </button>
          <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition">
            <FontAwesomeIcon icon="fa-solid fa-ellipsis" />
          </button>
        </div>
      </div>
    </section>
  )
}
