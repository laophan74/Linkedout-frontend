import { useEffect,useState ,useCallback} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { getUsers } from '../store/actions/userActions'

export const RightSideBar = () => {
  const { users } = useSelector((state) => state.userModule)
  const dispatch = useDispatch()
  const history = useHistory()
  const { loggedInUser } = useSelector((state) => state.userModule)

  const [filteredUsers, setFilteredUsers] = useState([])

  const filterUsers = useCallback(() => {
    if (users && loggedInUser) {
      const notConnected = users.filter(
        (user) =>
          !loggedInUser.connections.some(
            (connection) => connection.userId === user._id
          )
      )
      setFilteredUsers(notConnected)
    }
  }, [users, loggedInUser])

  useEffect(() => {
    filterUsers()
  }, [filterUsers])



  useEffect(() => {
    dispatch(getUsers())
  }, [dispatch])

  const lengtConections = [0, 1, 2]
  return filteredUsers.length > 0 && (
    <section className="right-side-bar">
      <div className="container bg-white rounded-lg border border-gray-200 p-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-6">Add to your feed</h2>
          <div className="space-y-3">
            {filteredUsers?.length &&
              lengtConections.map((num, idx) => (
                <div
                  key={filteredUsers[num]?._id || idx}
                  className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition cursor-pointer"
                  onClick={() => history.push(`profile/${filteredUsers[num]?._id}`)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center flex-1">
                      <img src={filteredUsers[num]?.imgUrl} className="w-10 h-10 rounded-full mr-3" alt="" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 hover:underline">
                          {filteredUsers[num]?.fullname}
                        </p>
                        <p className="text-xs text-gray-600">
                          {filteredUsers[num]?.profession}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="else-container bg-white rounded-lg border border-gray-200">
        <div>
          <h3 className="text-gray-900">Promoted</h3>
        </div>
        <br />
        <div>
          <p className="text-gray-600">Looking for a full-stack developer for your project or team? I'm open to collaboration and exciting challenges.</p>
        </div>
        <br />
        <div className="img-container">
          <a href="https://www.shlomi.dev/" target="_blank" rel="noreferrer">
            <img
              src="https://res.cloudinary.com/duajg3ah1/image/upload/v1741866031/6ed80c70-7184-4e22-af43-c1b9357bfb2c.png"
              className="img"
              alt={''}
            />
          </a>
        </div>
      </div>
    </section>
  )
}
