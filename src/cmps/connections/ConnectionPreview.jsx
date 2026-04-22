import { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { connectToUser } from '../../store/actions/userActions'

export function ConnectionPreview({ user }) {
  const dispatch = useDispatch()
  const [isConnected, setIsConnected] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { loggedInUser } = useSelector((state) => state.userModule)

  const checkIsConnected = useCallback(() => {
    const connected = loggedInUser?.connections?.some(
      (connection) =>
        (connection?.userId || connection?._id || connection) === user?._id
    )
    setIsConnected(connected)
  }, [loggedInUser, user])

  useEffect(() => {
    checkIsConnected()
  }, [checkIsConnected])

  const connectProfile = async () => {
    if (!user) return
    try {
      setIsSubmitting(true)
      setIsConnected(true)
      await dispatch(connectToUser(user._id))
    } catch (err) {
      console.error('Failed to connect user:', err)
      setIsConnected(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user || (isConnected && !isSubmitting)) return null

  const { fullname, imgUrl, profession } = user

  return (
    <li className="network-profile-card">
      <div className="bg">
        <Link to={`/main/profile/${user._id}`} className="profile-container">
          <img src={imgUrl} alt={fullname} className="img" />
        </Link>
      </div>

      <div className="profile-name">
        <h1>{fullname}</h1>
        <p className="professional">{profession}</p>
      </div>

      <div className="views">
        <div>
          <p>{user.connections?.length || 0} connections</p>
        </div>
        <div></div>
      </div>

      <div className="my-items">
        <button type="button" onClick={connectProfile} disabled={isSubmitting}>
          <p>{isSubmitting ? 'Connected' : 'Connect'}</p>
          <span>
            <FontAwesomeIcon
              icon={isSubmitting ? 'fa-solid fa-circle-check' : 'fa-solid fa-user-plus'}
            />
          </span>
        </button>
      </div>
    </li>
  )
}
