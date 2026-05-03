import { ListMsg } from './ListMsg'
import { MessageThread } from './MessageThread'

export function Messaging({
  chats,
  chatWith,
  messagesToShow,
  setMessagesToShow,
  chooseenChatId,
  setChooseenChatId,
  setChatWith,
  getTheNotLoggedUserChat,
  setTheNotLoggedUserChat,
  theNotLoggedUserChat,
  onSendMsg,
}) {
  const hasOpenThread = messagesToShow !== null

  return (
    <section className={`messaging ${hasOpenThread ? 'has-open-thread' : ''}`}>
      <div className="container">
        <ListMsg
          chats={chats}
          setMessagesToShow={setMessagesToShow}
          setChatWith={setChatWith}
          chatWith={chatWith}
          setChooseenChatId={setChooseenChatId}
          chooseenChatId={chooseenChatId}
          getTheNotLoggedUserChat={getTheNotLoggedUserChat}
          setTheNotLoggedUserChat={setTheNotLoggedUserChat}
          theNotLoggedUserChat={theNotLoggedUserChat}
        />
        {hasOpenThread ? (
          <MessageThread
            messagesToShow={messagesToShow}
            chatWith={chatWith}
            onSendMsg={onSendMsg}
            setMessagesToShow={setMessagesToShow}
          />
        ) : (
          <div className="message-empty-state">
            <div className="empty-icon">in</div>
            <h2>Select a conversation</h2>
            <p>Choose a connection from the list to read messages or start a new conversation.</p>
          </div>
        )}
      </div>
    </section>
  )
}
