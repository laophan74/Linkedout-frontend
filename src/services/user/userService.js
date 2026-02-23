import { httpService } from '../httpService'
import { API_CONFIG, STORAGE_CONFIG } from '../../config/constants'

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
}

async function getUsers(filterBy) {
  return await httpService.get(ENDPOINTS.USER_LIST, filterBy)
}

async function getById(userId) {
  return await httpService.get(ENDPOINTS.USER_BY_ID(userId))
}

function remove(userId) {
  return httpService.delete(ENDPOINTS.USER_BY_ID(userId))
}

async function update(user) {
  const savedUser = await httpService.put(ENDPOINTS.USER_BY_ID(user._id), user)
  // Handle case in which admin updates other user's details
  if (getLoggedinUser()._id === savedUser._id) _saveLocalUser(savedUser)
  return savedUser
}

async function login(userCred) {
  const { token, user } = await httpService.post(ENDPOINTS.AUTH_LOGIN, userCred)
  if (user && token) {
    _saveLocalUser(user, token)
    return user
  }
}

async function signup(userCred) {
  const { token, user } = await httpService.post(ENDPOINTS.AUTH_SIGNUP, userCred)
  if (user && token) {
    _saveLocalUser(user, token)
    return user
  }
}

async function logout() {
  sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
  sessionStorage.removeItem(STORAGE_KEY_TOKEN)
  return await httpService.post(ENDPOINTS.AUTH_LOGOUT)
}

async function getProfile() {
  const user = await httpService.get(ENDPOINTS.USER_PROFILE)
  if (user) _saveLocalUser(user)
  return user
}

async function getConnections(userId) {
  return await httpService.get(ENDPOINTS.USER_CONNECTIONS(userId))
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
  return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER) || 'null')
}
