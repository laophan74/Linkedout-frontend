import { httpService } from '../httpService'
import { userService } from '../user/userService'

export const chatService = {
  query,
  getMessages,
  saveMessage,
  save,
}

async function query(filterBy = {}) {
  const chats = await httpService.get('chat', filterBy)
  if (!Array.isArray(chats)) return chats

  const loggedInUser = userService.getLoggedinUser()
  const loggedInUserId = loggedInUser?._id

  const mapped = await Promise.all(
    chats.map(async (chat) => {
      const messages = await getMessages(chat._id)
      return mapBackendChat({ ...chat, messages }, loggedInUserId)
    })
  )

  return mapped
}

async function getMessages(chatId) {
  const messages = await httpService.get(`chat/${chatId}/messages`)
  if (!Array.isArray(messages)) return messages
  return messages.map(mapBackendMessage)
}

async function saveMessage(chatId, message) {
  const payload = {
    txt: message?.txt,
    recipientId: message?.recipientId,
  }
  return await httpService.post(`chat/${chatId}/message`, payload)
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

  const baseChat = chat?._id
    ? await httpService.get(`chat/${chat._id}`)
    : await httpService.post('chat', { recipientId })

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

  const participants = Array.isArray(chat.participants) ? chat.participants : []
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
  return {
    ...message,
    userId: message.senderId || message.userId,
    createdAt: message.createdAt || Date.now(),
  }
}
