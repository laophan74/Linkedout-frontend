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

  const { fullname, imgUrl, profession, headline, bio } = loggedInUser
  const profileHeadline = headline || profession || bio || 'Professional member'

  return (
    <section className="feed-identity-module bg-white border border-gray-200 rounded-lg">
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
          <h1 className="text-gray-900">{fullname}</h1>
          <p className="professional text-gray-600">{profileHeadline}</p>
        </div>

        <div className="views">
          <div>
            <p className="text-gray-600">{loggedInUser?.connections?.length} connections</p>
          </div>

          <div></div>
        </div>

        <div className="my-items">
          <div onClick={doLogout}>
            <p className="text-gray-600">Logout</p>
            <span className="text-gray-600">
              <FontAwesomeIcon icon="fa-solid fa-arrow-right-from-bracket" />
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
