import { httpService } from '../httpService'

export const chatService = {
  query,
  getMessages,
  saveMessage,
  save,
}

async function query(filterBy = {}) {
  return await httpService.get(`chat`, filterBy)
}

async function getMessages(chatId) {
  const data = await httpService.get(`chat/${chatId}`)
  return data.messages || []
}

async function saveMessage(chatId, message) {
  return await httpService.post(`chat/${chatId}/messages`, message)
}

async function save(chat) {
  return await httpService.post(`chat`, chat)
}
