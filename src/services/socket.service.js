// Mock Socket Service - No backend connection in demo mode

export const SOCKET_EMIT_USER_WATCH = 'user-watch'
export const SOCKET_EVENT_USER_UPDATED = 'user-updated'

// Disabled for demo without backend
export const socketService = createSocketService()

socketService.setup()

function createSocketService() {
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
      // Mock: do nothing
    },
  }
  return socketService
}
