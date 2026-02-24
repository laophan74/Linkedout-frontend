import { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import loadingCircle from '../../assets/imgs/loading-circle.gif'
import { updateUser } from '../../store/actions/userActions'

export function ConnectionPreview({ user }) {
  const dispatch = useDispatch()

  const [isConnected, setIsConnected] = useState(false)

  const { loggedInUser } = useSelector((state) => state.userModule)

  const checkIsConnected = useCallback(() => {
    const isConnected = loggedInUser?.connections?.some(
      (connection) => connection?.userId === user?._id
    )

    setIsConnected(isConnected)
  }, [loggedInUser, user])

  useEffect(() => {
    checkIsConnected()
    return () => {}
  }, [checkIsConnected])

  const connectProfile = async () => {
    if (!user) return
    if (isConnected === true) {
      // Remove
      const connectionToRemve = JSON.parse(JSON.stringify(user))
      const loggedInUserToUpdate = JSON.parse(JSON.stringify(loggedInUser))

      loggedInUserToUpdate.connections =
        loggedInUserToUpdate.connections.filter(
          (connection) => connection.userId !== connectionToRemve._id
        )

      connectionToRemve.connections = connectionToRemve.connections.filter(
        (connection) => connection.userId !== loggedInUserToUpdate._id
      )

      dispatch(updateUser(loggedInUserToUpdate))
      dispatch(updateUser(connectionToRemve))
    } else if (isConnected === false) {
      // Add
      const connectionToAdd = JSON.parse(JSON.stringify(user))

      const loggedInUserToUpdate = JSON.parse(JSON.stringify(loggedInUser))

      connectionToAdd.connections.unshift({
        userId: loggedInUserToUpdate._id,
        fullname: loggedInUserToUpdate.fullname,
      })

      loggedInUserToUpdate.connections.push({
        userId: connectionToAdd._id,
        fullname: connectionToAdd.fullname,
      })

      dispatch(updateUser(loggedInUserToUpdate))
      dispatch(updateUser(connectionToAdd))
    }
  }

  if (!user || isConnected) return
  return (
    <li className="p-4 mb-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition">
      <div className="flex items-center mb-3">
        <Link to={`/main/profile/${user?._id}`} className="flex-1">
          <div className="flex items-center">
            {(user.imgUrl && (
              <img src={user.imgUrl} alt="" className="w-10 h-10 rounded-full mr-3 cursor-pointer" />
            )) || <img src={loadingCircle} alt="" className="w-10 h-10 rounded-full mr-3" />}
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white hover:underline">
                {user.fullname}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {user.profession}
              </p>
            </div>
          </div>
        </Link>
      </div>
      <div className="flex items-center justify-between text-xs mb-3">
        <p className="text-gray-600 dark:text-gray-400">{user.connections?.length} connections</p>
      </div>
      <button 
        onClick={connectProfile}
        className="w-full py-2 px-3 text-xs font-medium text-white bg-primary-700 hover:bg-primary-800 rounded transition"
      >
        {!isConnected ? 'Connect' : 'Disconnect'}
      </button>
    </li>
  )
}
