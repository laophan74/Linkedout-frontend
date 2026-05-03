import { useCallback, useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { setCurrPage } from '../store/actions/postActions'
import { Messaging } from '../cmps/message/Messaging'
import {
  addTempChat,
  removeTempChat,
  loadChats,
  saveChat,
} from '../store/actions/chatActions'
import { useParams } from 'react-router-dom'
import { userService } from '../services/user/userService'
import { utilService } from '../services/utilService'
import {
  saveActivity,
  setUnreadActivitiesIds,
} from '../store/actions/activityAction'
import loadingGif from '../assets/imgs/loading-gif.gif'
import { updateUser } from '../store/actions/userActions'

// Custom hook to manage chat-related functionality
function useChat(loggedInUser, chats, params) {
  const dispatch = useDispatch()
  const [messagesToShow, setMessagesToShow] = useState(null)
  const [chooseenChatId, setChooseenChatId] = useState(null)
  const [isNewChat, setIsNewChat] = useState(false)
  const [theNotLoggedUserChat, setTheNotLoggedUserChat] = useState(null)
  const [chatWith, setChatWith] = useState(null)

  const findChat = useCallback((userId) => {
    return chats?.find(chat =>
      chat.userId === userId || chat.userId2 === userId
    )
  }, [chats])

  const getTheNotLoggedUserChat = useCallback(async (chat) => {
    if (!chat || !loggedInUser) return null

    const userId = loggedInUser._id === chat.userId ? chat.userId2 : chat.userId
    if (!userId) return null

    return await userService.getById(userId) || null
  }, [loggedInUser])

  const createChat = (userId) => {
    return {
      _id: utilService.makeId(7),
      _isTemp: true,
      userId,
      userId2: loggedInUser?._id,
      users: [],
      messages: [],
      createdAt: new Date().getTime(),
    }
  }

  const createNewMsg = (txt) => {
    return {
      _id: utilService.makeId(24),
      txt: txt.trim(),
      userId: loggedInUser._id,
      createdAt: new Date().getTime(),
    }
  }

  const loadNotLoggedUser = useCallback(async (chat) => {
    const user = await getTheNotLoggedUserChat(chat) || null
    setTheNotLoggedUserChat(user)
    setChatWith(user)
  }, [getTheNotLoggedUserChat])

  const selectChat = useCallback(async (chat, isTempChat = false) => {
    if (!chat) return
    setIsNewChat(isTempChat)
    setChooseenChatId(chat._id)
    setMessagesToShow(chat.messages || [])
    await loadNotLoggedUser(chat)
  }, [loadNotLoggedUser])

  const openChat = useCallback(async () => {
    if (!loggedInUser || !chats) return
    if (params.userId === loggedInUser._id) return

    const chatToShow = params.userId
      ? findChat(params.userId)
      : chats.find((chat) => chat._id === chooseenChatId) || chats[0]

    if (chatToShow) {
      await selectChat(chatToShow, Boolean(chatToShow._isTemp))
      return
    }

    if (params.userId) {
      const tempChat = createChat(params.userId)
      dispatch(addTempChat(tempChat))
      await selectChat(tempChat, true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chats, chooseenChatId, dispatch, findChat, loggedInUser, params.userId, selectChat])

  const onSendMsg = async (txt) => {
    if (!txt?.trim() || !chooseenChatId || !loggedInUser) return
    const newMsg = createNewMsg(txt)
    const chatIdx = chats.findIndex((chat) => chat._id === chooseenChatId)
    if (chatIdx === -1) return

    const chatToUpdate = { ...chats[chatIdx] }
    chatToUpdate.messages = [...(chatToUpdate.messages || []), newMsg]
    chatToUpdate.users = [
      loggedInUser?.fullname,
      theNotLoggedUserChat?.fullname,
    ]
    chatToUpdate.recipientId =
      loggedInUser._id === chatToUpdate.userId
        ? chatToUpdate.userId2
        : chatToUpdate.userId
    
    if (isNewChat || chatToUpdate._isTemp) {
      dispatch(removeTempChat(chatToUpdate._id))
      delete chatToUpdate._id
      delete chatToUpdate._isTemp
    }

    setIsNewChat(false)
    setMessagesToShow(chatToUpdate.messages)

    try {
      const savedChat = await dispatch(saveChat(chatToUpdate))
      setMessagesToShow(savedChat.messages)
      setChooseenChatId(savedChat._id)
      if (savedChat) {
        const newActivity = {
          type: 'message',
          createdBy: loggedInUser?._id,
          createdTo: loggedInUser._id === savedChat.userId
            ? savedChat.userId2
            : savedChat.userId,
          chatId: savedChat._id,
        }
        dispatch(saveActivity(newActivity))
      }
    } catch (err) {
      dispatch(loadChats(loggedInUser._id))
    }
  }

  return {
    messagesToShow,
    setMessagesToShow,
    chooseenChatId,
    setChooseenChatId,
    theNotLoggedUserChat,
    setTheNotLoggedUserChat,
    chatWith,
    setChatWith,
    openChat,
    onSendMsg,
    getTheNotLoggedUserChat
  }
}

function Message() {
  const dispatch = useDispatch()

  const params = useParams()

  const { loggedInUser } = useSelector((state) => state.userModule)
  const { chats } = useSelector((state) => state.chatModule)

  const {
    messagesToShow,
    setMessagesToShow,
    chooseenChatId,
    setChooseenChatId,
    theNotLoggedUserChat,
    setTheNotLoggedUserChat,
    chatWith,
    setChatWith,
    openChat,
    onSendMsg,
    getTheNotLoggedUserChat
  } = useChat(loggedInUser, chats, params)

  useEffect(() => {
    dispatch(setCurrPage('message'))
    const userId = loggedInUser?._id
    if (!userId) return

    dispatch(loadChats(userId))
    const intervalId = setInterval(() => {
      dispatch(loadChats(userId))
    }, 5000)

    return () => clearInterval(intervalId)
  }, [dispatch, loggedInUser?._id])

  useEffect(() => {
    openChat()
  }, [openChat])

  useEffect(() => {
    updateLastSeenLoggedUser()
    dispatch(setUnreadActivitiesIds())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateLastSeenLoggedUser = async () => {
    if (!loggedInUser?._id) return
    const lastSeenMsgs = new Date().getTime()
    await dispatch(updateUser({ ...loggedInUser, lastSeenMsgs }))
  }

  if (!chats)
    return (
      <div className="message-page">
        <div className="gif-container">
          <img className="loading-gif" src={loadingGif} alt="" />
        </div>
      </div>
    )
  return (
    <section className="message-page">
      <Messaging
        chats={chats}
        messagesToShow={messagesToShow}
        setMessagesToShow={setMessagesToShow}
        chooseenChatId={chooseenChatId}
        setChooseenChatId={setChooseenChatId}
        chatWith={chatWith}
        setChatWith={setChatWith}
        getTheNotLoggedUserChat={getTheNotLoggedUserChat}
        setTheNotLoggedUserChat={setTheNotLoggedUserChat}
        theNotLoggedUserChat={theNotLoggedUserChat}
        onSendMsg={onSendMsg}
      />
      <div className="right-side-message">
        <p>This ad could be yours</p>
      </div>
    </section>
  )
}

export default Message
