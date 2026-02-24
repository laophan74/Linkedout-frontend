import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ThreadMsgList } from './ThreadMsgList'
import { useHistory } from 'react-router-dom'
import { useEffect } from 'react'
import { SendMessageForm } from './SendMessageForm'

export function MessageThread({
  messagesToShow,
  setMessagesToShow,
  chatWith,
  onSendMsg,
}) {
  const history = useHistory()

  useEffect(() => {
    scrollToBottom()
    return () => {}
  }, [messagesToShow])

  const scrollToBottom = () => {
    var msgsContainer = document.querySelector('.user-profile-details')
    msgsContainer.scrollTop = msgsContainer.scrollHeight
  }

  return (
    <section className="flex flex-col h-full bg-white dark:bg-gray-900">
      <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div
          className="flex items-center cursor-pointer group"
          onClick={() => history.push(`/main/profile/${chatWith?._id}`)}
        >
          <img src={chatWith?.imgUrl} alt="" className="w-10 h-10 rounded-full mr-3" />
          <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:underline">{chatWith?.fullname}</p>
        </div>
        <button
          className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition"
          onClick={() => {
            setMessagesToShow(null)
          }}
        >
          <FontAwesomeIcon icon="fa-solid fa-x" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-gray-900">
        <ThreadMsgList messagesToShow={messagesToShow} />
      </div>

      <SendMessageForm onSendMsg={onSendMsg} messagesToShow={messagesToShow} />
    </section>
  )
}
