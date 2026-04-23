import { httpService } from '../httpService'
import { API_CONFIG, AVATAR_CONFIG, STORAGE_CONFIG } from '../../config/constants'

const STORAGE_KEY_LOGGEDIN_USER = STORAGE_CONFIG.USER_KEY
const STORAGE_KEY_TOKEN = STORAGE_CONFIG.TOKEN_KEY
const ENDPOINTS = API_CONFIG.ENDPOINTS

export const userService = {
  login,
  logout,
  signup,
  getProfile,
  getLoggedinUser,
  getUsers,
  getById,
  getConnections,
  connectUser,
  disconnectUser,
  remove,
  update,
  getDefaultAvatar,
  normalizeUser,
}

function getDefaultAvatar(seed = 'linkedout-member') {
  return AVATAR_CONFIG.getAvatarUrl(String(seed).trim() || 'linkedout-member')
}

function normalizeUser(user) {
  if (!user) return user

  const fallbackSeed =
    user.fullname || user.username || user.email || user._id || 'linkedout-member'

  return {
    ...user,
    imgUrl: user.imgUrl || getDefaultAvatar(fallbackSeed),
    connections: Array.isArray(user.connections)
      ? user.connections.map((connection) =>
          typeof connection === 'object' ? normalizeUser(connection) : connection
        )
      : user.connections,
  }
}

async function getUsers(filterBy) {
  const users = await httpService.get(ENDPOINTS.USER_LIST, filterBy)
  return Array.isArray(users) ? users.map(normalizeUser) : users
}

async function getById(userId) {
  const user = await httpService.get(ENDPOINTS.USER_BY_ID(userId))
  return normalizeUser(user)
}

function remove(userId) {
  return httpService.delete(ENDPOINTS.USER_BY_ID(userId))
}

async function update(user) {
  const savedUser = normalizeUser(
    await httpService.put(ENDPOINTS.USER_BY_ID(user._id), user)
  )
  // Handle case in which admin updates other user's details
  if (getLoggedinUser()._id === savedUser._id) _saveLocalUser(savedUser)
  return savedUser
}

async function login(userCred) {
  const { token, user } = await httpService.post(ENDPOINTS.AUTH_LOGIN, userCred)
  const normalizedUser = normalizeUser(user)
  if (normalizedUser && token) {
    _saveLocalUser(normalizedUser, token)
    return normalizedUser
  }
}

async function signup(userCred) {
  const { token, user } = await httpService.post(ENDPOINTS.AUTH_SIGNUP, userCred)
  const normalizedUser = normalizeUser(user)
  if (normalizedUser && token) {
    _saveLocalUser(normalizedUser, token)
    return normalizedUser
  }
}

async function logout() {
  sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
  sessionStorage.removeItem(STORAGE_KEY_TOKEN)
  return await httpService.post(ENDPOINTS.AUTH_LOGOUT)
}

async function getProfile() {
  const user = normalizeUser(await httpService.get(ENDPOINTS.USER_PROFILE))
  if (user) _saveLocalUser(user)
  return user
}

async function getConnections(userId) {
  const connections = await httpService.get(ENDPOINTS.USER_CONNECTIONS(userId))
  return Array.isArray(connections) ? connections.map(normalizeUser) : connections
}

async function connectUser(userId) {
  return await httpService.post(ENDPOINTS.USER_CONNECT(userId))
}

async function disconnectUser(userId) {
  return await httpService.delete(ENDPOINTS.USER_DISCONNECT(userId))
}

function _saveLocalUser(user, token) {
  sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
  if (token) {
    sessionStorage.setItem(STORAGE_KEY_TOKEN, token)
  }
  return user
}

function getLoggedinUser() {
  return normalizeUser(
    JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER) || 'null')
  )
}
