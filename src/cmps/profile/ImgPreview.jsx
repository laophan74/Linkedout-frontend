import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useHistory } from 'react-router-dom'
import { userService } from '../../services/user/userService'

export function ImgPreview({
  toggleShowImg,
  imgUrl,
  videoUrl,
  title,
  post,
  body,
}) {
  const history = useHistory()

  const [user, setUser] = useState(null)

  const loadUser = async (userId) => {
    const user = await userService.getById(userId)
    setUser(user)
  }

  useEffect(() => {
    if (post?.userId) loadUser(post.userId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
          {(user && post && (
            <div
              className="flex items-center cursor-pointer group"
              onClick={() => history.push(`/main/profile/${post.userId}`)}
            >
              <img src={user.imgUrl} alt="" className="w-10 h-10 rounded-full mr-3" />
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:underline">{user.fullname}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{title}</p>
              </div>
            </div>
          )) ||
            (post && <p className="text-sm text-gray-600 dark:text-gray-400">Loading user...</p>)}

          <button 
            onClick={toggleShowImg}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition"
          >
            <FontAwesomeIcon icon="fa-solid fa-x" />
          </button>
        </div>

        {body && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-700 dark:text-gray-300">{body}</p>
          </div>
        )}

        {post && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <p
              onClick={() =>
                history.push(`/main/post/${post.userId}/${post._id}`)
              }
              className="text-sm text-primary-700 hover:text-primary-800 dark:text-primary-500 dark:hover:text-primary-400 cursor-pointer font-medium"
            >
              See original post
            </p>
          </div>
        )}

        <div className="p-4">
          {(imgUrl && <img className="w-full rounded-lg" src={imgUrl} alt="" />) ||
            (videoUrl && (
              <video width="100%" height="300" controls className="rounded-lg">
                <source src={videoUrl} type="video/mp4" />
              </video>
            ))}
        </div>
      </div>
    </div>
  )
}
