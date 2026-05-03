import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ThreadMsgList } from './ThreadMsgList'
import { useHistory } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { SendMessageForm } from './SendMessageForm'

export function MessageThread({
  messagesToShow,
  setMessagesToShow,
  chatWith,
  onSendMsg,
}) {
  const history = useHistory()
  const messagesContainerRef = useRef(null)

  useEffect(() => {
    scrollToBottom()
  }, [messagesToShow])

  const scrollToBottom = () => {
    const msgsContainer = messagesContainerRef.current
    if (!msgsContainer) return
    msgsContainer.scrollTop = msgsContainer.scrollHeight
  }

  return (
    <section className="message-thread">
      <header className="message-thread-header">
        <div
          className="thread-profile"
          onClick={() => history.push(`/main/profile/${chatWith?._id}`)}
        >
          <img src={chatWith?.imgUrl} alt="" />
          <div>
            <p>{chatWith?.fullname}</p>
            <span>Private conversation</span>
          </div>
        </div>
        <button
          className="close-thread-btn"
          type="button"
          aria-label="Close conversation"
          onClick={() => {
            setMessagesToShow(null)
          }}
        >
          <FontAwesomeIcon icon="fa-solid fa-x" />
        </button>
      </header>

      <div
        ref={messagesContainerRef}
        className="message-thread-body"
      >
        <ThreadMsgList messagesToShow={messagesToShow} />
      </div>

      <SendMessageForm onSendMsg={onSendMsg} messagesToShow={messagesToShow} />
    </section>
  )
}
