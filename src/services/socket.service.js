// Mock Socket Service - No backend connection in demo mode
import io from 'socket.io-client'

export const SOCKET_EMIT_USER_WATCH = 'user-watch'
export const SOCKET_EVENT_USER_UPDATED = 'user-updated'

// Disabled for demo without backend
const baseUrl = null
export const socketService = createSocketService()

socketService.setup()

function createSocketService() {
  var socket = null
  const socketService = {
    async setup() {
      // Socket disabled in demo mode - no backend
      // socket = io(baseUrl)
    },
    on(eventName, cb) {
      // Mock: do nothing
    },
    off(eventName, cb = null) {
      // Mock: do nothing
    },
    emit(eventName, data) {
      // Mock: do nothing
    },
    terminate() {
      socket = null
    },
  }
  return socketService
}
