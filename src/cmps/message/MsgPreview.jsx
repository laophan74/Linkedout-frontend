import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import loadingGif from '../../assets/imgs/loading-circle.gif'

export function MsgPreview({
  chat,
  chats,
  setMessagesToShow,
  setChatWith,
  chatWith,
  chooseenChatId,
  setChooseenChatId,
  getTheNotLoggedUserChat,
}) {
  const [theNotLoggedUserChat, setTheNotLoggedUserChat] = useState(null)
  const [unreadMsgsCount, setUnreadMsgsCount] = useState(0)

  const { unreadMessages } = useSelector((state) => state.activityModule)

  const getUnreadCountMsgs = () => {
    let countMsgs = 0
    unreadMessages.forEach((chatId) => {
      if (chat._id === chatId) countMsgs++
    })
    setUnreadMsgsCount(countMsgs)
  }

  const lastMsg =
    chat.messages[chat.messages?.length - 1]?.txt || 'No Messages yet..'
  const dateToShow = new Date(chat.messages[0]?.createdAt || chat.createdAt)
  const slicedDate = dateToShow.toLocaleDateString().slice(0, -5)

  const loadNotLoggedUser = async (chat) => {
    const user = await getTheNotLoggedUserChat(chat)
    setTheNotLoggedUserChat(user)
  }

  const onClickChat = () => {
    setMessagesToShow(chat.messages)
    setChatWith(theNotLoggedUserChat)
    setChooseenChatId(chat._id)
  }

  useEffect(() => {
    loadNotLoggedUser(chat)
    getUnreadCountMsgs()
    return () => {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setMessagesToShow(chat.messages)
    setChooseenChatId(chat._id)
    return () => {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat, chats])

  const isChatChooseen = chooseenChatId === chat._id ? 'chooseen-chat' : ''

  if (!theNotLoggedUserChat)
    return (
      <div className="p-4 mb-3 bg-white dark:bg-gray-900 rounded flex items-center justify-center h-20">
        <img src={loadingGif} alt="loading" className="w-8 h-8" />
      </div>
    )

  return (
    <section 
      className={`p-4 mb-3 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition ${isChatChooseen ? 'bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'}`}
      onClick={onClickChat}
    >
      <div className="flex items-start">
        <div className="relative">
          <img 
            src={theNotLoggedUserChat?.imgUrl} 
            alt="" 
            className="w-10 h-10 rounded-full mr-3 cursor-pointer" 
          />
          {unreadMsgsCount > 0 && (
            <span className="absolute bottom-0 right-3 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary-700 rounded-full">
              {unreadMsgsCount}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-2">
              <p className="text-sm font-semibold text-gray-900 dark:text-white hover:underline cursor-pointer">
                {theNotLoggedUserChat?.fullname}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {lastMsg}
              </p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2" title={dateToShow}>
              {slicedDate}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
