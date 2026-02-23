import { httpService } from '../httpService'

const STORAGE_KEY_LOGGEDIN_USER = 'user'
const STORAGE_KEY_TOKEN = 'token'

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
  return await httpService.get(`user`, filterBy)
}

async function getById(userId) {
  return await httpService.get(`user/${userId}`)
}

function remove(userId) {
  return httpService.delete(`user/${userId}`)
}

async function update(user) {
  const savedUser = await httpService.put(`user/${user._id}`, user)
  // Handle case in which admin updates other user's details
  if (getLoggedinUser()._id === savedUser._id) _saveLocalUser(savedUser)
  return savedUser
}

async function login(userCred) {
  const { token, user } = await httpService.post('auth/login', userCred)
  if (user && token) {
    _saveLocalUser(user, token)
    return user
  }
}

async function signup(userCred) {
  const { token, user } = await httpService.post('auth/signup', userCred)
  if (user && token) {
    _saveLocalUser(user, token)
    return user
  }
}

async function logout() {
  sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
  sessionStorage.removeItem(STORAGE_KEY_TOKEN)
  return await httpService.post('auth/logout')
}

async function getProfile() {
  const user = await httpService.get('user/profile/me')
  if (user) _saveLocalUser(user)
  return user
}

async function getConnections(userId) {
  return await httpService.get(`user/${userId}/connections`)
}

async function connectUser(userId) {
  return await httpService.post(`user/${userId}/connect`)
}

async function disconnectUser(userId) {
  return await httpService.delete(`user/${userId}/disconnect`)
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
