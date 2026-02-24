import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/actions/userActions'
import { useHistory } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const FeedIdentityModule = (props) => {
  const dispatch = useDispatch()
  const history = useHistory()

  const { loggedInUser } = useSelector((state) => state.userModule)

  const doLogout = async () => {
    dispatch(logout()).then((res) => {
      if (res) history.push(`/`)
    })
  }

  if (!loggedInUser)
    return <section className="feed-identity-module">Loading</section>

  const { fullname, imgUrl, profession } = loggedInUser

  return (
    <section className="feed-identity-module bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
      <div className="">
        <div className="bg">
          <div
            className="profile-container"
            onClick={() => history.push(`profile/${loggedInUser._id}`)}
          >
            <img src={imgUrl} alt="" className="img" />
          </div>
        </div>

        <div className="profile-name">
          <h1 className="text-gray-900 dark:text-white">{fullname}</h1>
          <p className="professional text-gray-600 dark:text-gray-400">{profession}</p>
        </div>

        <div className="views">
          <div>
            <p className="text-gray-600 dark:text-gray-400">{loggedInUser?.connections?.length} connections</p>
          </div>

          <div></div>
        </div>

        <div className="my-items">
          <div onClick={doLogout}>
            <p className="text-gray-600 dark:text-gray-400">Logout</p>
            <span className="text-gray-600 dark:text-gray-400">
              <FontAwesomeIcon icon="fa-solid fa-arrow-right-from-bracket" />
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
