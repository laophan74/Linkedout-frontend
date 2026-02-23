import { mockDataService } from '../mockDataService'

const ENDPOINT = 'chat'

export const chatService = {
  query,
  getMessages,
  saveMessage,
  save,
}

async function query(filterBy = {}) {
  return await mockDataService.getChats()
}

async function getMessages(chatId) {
  return await mockDataService.getChatMessages(chatId)
}

async function saveMessage(message) {
  return await mockDataService.saveMessage(message)
}

async function save(chat) {
  // Mock: just return the chat
  return Promise.resolve(chat)
}
