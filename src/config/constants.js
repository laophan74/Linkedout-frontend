/**
 * Application Constants & Configuration
 * Centralized configuration for all app settings
 */

// ==================== API CONFIGURATION ====================

export const API_CONFIG = {
  // Base URLs for different environments
  BASE_URL:
    process.env.REACT_APP_API_BASE_URL ||
    (process.env.NODE_ENV === 'production'
      ? 'https://linkedout-backend1.vercel.app/api/'
      : 'http://localhost:3030/api/'),

  // API Endpoints
  ENDPOINTS: {
    // Authentication
    AUTH_LOGIN: 'auth/login',
    AUTH_SIGNUP: 'auth/signup',
    AUTH_LOGOUT: 'auth/logout',

    // Users
    USER_LIST: 'user',
    USER_PROFILE: 'user/profile/me',
    USER_BY_ID: (id) => `user/${id}`,
    USER_CONNECTIONS: (id) => `user/${id}/connections`,
    USER_CONNECT: (id) => `user/${id}/connect`,
    USER_DISCONNECT: (id) => `user/${id}/disconnect`,

    // Posts
    POST_LIST: 'post',
    POST_BY_ID: (id) => `post/${id}`,
    POST_LIKE: (id) => `post/${id}/like`,

    // Comments
    COMMENT_LIST: 'comment',
    COMMENT_BY_ID: (id) => `comment/${id}`,
    COMMENT_BY_POST: (postId) => `comment/post/${postId}`,
    COMMENT_LIKE: (id) => `comment/${id}/like`,

    // Chat
    CHAT_LIST: 'chat',
    CHAT_GET: (id) => `chat/${id}`,
    CHAT_CREATE: 'chat',
    CHAT_MESSAGES: (id) => `chat/${id}/messages`,
    CHAT_MESSAGE_SEND: (id) => `chat/${id}/message`,
    CHAT_MESSAGE_EDIT: (id, msgId) => `chat/${id}/message/${msgId}`,
    CHAT_MESSAGE_DELETE: (id, msgId) => `chat/${id}/message/${msgId}`,

    // Activity
    ACTIVITY_LIST: 'activity',
    ACTIVITY_COUNT: 'activity/count',
    ACTIVITY_READ_ALL: 'activity/read-all',

    // Upload
    UPLOAD_IMAGE: 'upload/image',
  },
}

// ==================== STORAGE CONFIGURATION ====================

export const STORAGE_CONFIG = {
  TOKEN_KEY: 'token',
  USER_KEY: 'user',
  STORAGE_TYPE: 'sessionStorage', // 'localStorage' or 'sessionStorage'
}

// ==================== UI CONFIGURATION ====================

export const UI_CONFIG = {
  // Pagination
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,

  // Timeouts
  TOAST_DURATION: 3000, // milliseconds
  LOADING_TIMEOUT: 5000,

  // File Upload
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
}

// ==================== AVATAR CONFIGURATION ====================

export const AVATAR_CONFIG = {
  // Avatar API Provider
  PROVIDER: 'dicebear',
  DEFAULT_STYLE: 'avataaars',

  // Generate avatar URL
  getAvatarUrl: (seed) =>
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`,

  // Default avatars for mock data
  DEFAULTS: {
    GUEST: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest',
    JOHN: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    SARAH: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    MIKE: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
    EMMA: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
  },
}

// ==================== ACTIVITY TYPES ====================

export const ACTIVITY_TYPES = {
  LIKE: 'like',
  COMMENT: 'comment',
  CONNECTION: 'connection',
  MESSAGE: 'message',
}

// ==================== HTTP CONFIGURATION ====================

export const HTTP_CONFIG = {
  TIMEOUT: 10000, // milliseconds
  RETRY_ATTEMPTS: 2,
  RETRY_DELAY: 1000, // milliseconds

  // Status codes to consider as success (for validateStatus)
  SUCCESS_CODES: {
    MIN: 200,
    MAX: 299,
  },
}

// ==================== VALIDATION ====================

export const VALIDATION_RULES = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20,
    PATTERN: /^[a-zA-Z0-9_-]*$/,
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 50,
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  FULLNAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
  },
}

// ==================== ROUTES ====================

export const ROUTES = {
  HOME: '/',
  SIGNUP: '/signup',
  FEED: '/main/feed',
  PROFILE: '/main/profile/:userId',
  POST: '/main/post/:userId/:postId',
  MESSAGES: '/main/messages',
  CONNECTIONS: '/main/connections',
  NOTIFICATIONS: '/main/notifications',
  MAP: '/main/map',
}

// ==================== EXPORT DEFAULTS ====================

export default {
  API_CONFIG,
  STORAGE_CONFIG,
  UI_CONFIG,
  AVATAR_CONFIG,
  ACTIVITY_TYPES,
  HTTP_CONFIG,
  VALIDATION_RULES,
  ROUTES,
}
