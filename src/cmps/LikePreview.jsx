import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { userService } from '../services/user/userService'

export function LikePreview({ reaction }) {
  const [user, setUser] = useState(null)

  const history = useHistory()

  const loadUser = async (id) => {
    if (!reaction) return
    const userPost = await userService.getById(id)
    setUser(() => userPost)
  }

  useEffect(() => {
    loadUser(reaction.userId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reaction?.userId])

  if (!user) return

  return (
    <section className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 mb-3">
      <div className="flex items-center">
        <img 
          src={user.imgUrl}
          alt={user.fullname}
          className="mr-3 w-10 h-10 rounded-full cursor-pointer"
          onClick={() => history.push(`/main/profile/${user._id}`)}
        />
        <div>
          <p 
            className="text-sm text-gray-900 dark:text-white font-semibold cursor-pointer hover:underline"
            onClick={() => history.push(`/main/profile/${user._id}`)}
          >
            {user.fullname}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {user.profession}
          </p>
        </div>
      </div>
      <button className="px-4 py-2 bg-primary-700 text-white text-sm rounded-lg hover:bg-primary-800">Connect</button>
    </section>
  )
}
