import { httpService } from '../httpService'
import { userService } from '../user/userService'
import { API_CONFIG } from '../../config/constants'

const ENDPOINTS = API_CONFIG.ENDPOINTS

export const chatService = {
  query,
  getMessages,
  saveMessage,
  save,
}

async function query(filterBy = {}) {
  const chats = await httpService.get(ENDPOINTS.CHAT_LIST, {
    ...filterBy,
    includeMessages: true,
    messageLimit: 20,
  })
  if (!Array.isArray(chats)) return chats

  const loggedInUser = userService.getLoggedinUser()
  const loggedInUserId = loggedInUser?._id

  return chats.map((chat) => mapBackendChat(chat, loggedInUserId))
}

async function getMessages(chatId) {
  const messages = await httpService.get(ENDPOINTS.CHAT_MESSAGES(chatId))
  if (!Array.isArray(messages)) return messages
  return messages.map(mapBackendMessage)
}

async function saveMessage(chatId, message) {
  const payload = {
    txt: message?.txt?.trim(),
    recipientId: message?.recipientId,
  }
  return mapBackendMessage(
    await httpService.post(ENDPOINTS.CHAT_MESSAGE_SEND(chatId), payload)
  )
}

async function save(chat) {
  const loggedInUser = userService.getLoggedinUser()
  const loggedInUserId = loggedInUser?._id

  const recipientId =
    chat?.recipientId ||
    (chat?.userId === loggedInUserId ? chat?.userId2 : chat?.userId)

  if (!recipientId) {
    throw new Error('Recipient ID is required to create a chat')
  }

  const baseChat = chat?._id && !chat?._isTemp
    ? await httpService.get(ENDPOINTS.CHAT_GET(chat._id))
    : await httpService.post(ENDPOINTS.CHAT_CREATE, { recipientId })

  const lastMsg = chat?.messages?.[chat.messages.length - 1]
  if (lastMsg?.txt) {
    await saveMessage(baseChat._id, {
      txt: lastMsg.txt,
      recipientId,
    })
  }

  const messages = await getMessages(baseChat._id)
  return mapBackendChat({ ...baseChat, messages }, loggedInUserId)
}

function mapBackendChat(chat, loggedInUserId) {
  if (!chat) return chat

  const participants = Array.isArray(chat.participants)
    ? chat.participants.map((participant) =>
        typeof participant === 'object'
          ? userService.normalizeUser(participant)
          : participant
      )
    : []
  const participantIds = participants.map((p) => p?._id || p).filter(Boolean)

  const userId = participantIds[0] || chat.userId
  const userId2 = participantIds[1] || chat.userId2

  return {
    ...chat,
    userId,
    userId2,
    users: participants.map((p) => p?.fullname).filter(Boolean),
    messages: Array.isArray(chat.messages)
      ? chat.messages.map(mapBackendMessage)
      : [],
    createdAt: chat.createdAt || Date.now(),
    lastMessage: chat.lastMessage,
    _loggedInUserId: loggedInUserId,
  }
}

function mapBackendMessage(message) {
  if (!message) return message
  const sender =
    typeof message.senderId === 'object'
      ? userService.normalizeUser(message.senderId)
      : null
  const recipient =
    typeof message.recipientId === 'object'
      ? userService.normalizeUser(message.recipientId)
      : null

  return {
    ...message,
    senderId: sender || message.senderId,
    recipientId: recipient || message.recipientId,
    userId: sender?._id || message.senderId || message.userId,
    createdAt: message.createdAt || Date.now(),
  }
}
