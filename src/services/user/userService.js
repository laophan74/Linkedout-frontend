import { mockDataService } from '../mockDataService'
// Using MOCK DATA SERVICE - No backend required for demo
const STORAGE_KEY_LOGGEDIN_USER = 'user'

export const userService = {
  login,
  logout,
  signup,
  getLoggedinUser,
  getUsers,
  getById,
  remove,
  update,
}

const usersCash = {}

async function getUsers(filterBy) {
  return await mockDataService.getUsers()
}

async function getById(userId) {
  if (usersCash[userId]) return usersCash[userId]
  else {
    const user = await mockDataService.getUserById(userId)
    if (user) usersCash[userId] = user
    return user
  }
}
function remove(userId) {
  // Mock: just return success
  return Promise.resolve(true)
}

async function update(user) {
  const savedUser = await mockDataService.updateUser(user)
  // Handle case in which admin updates other user's details
  if (getLoggedinUser()._id === savedUser._id) _saveLocalUser(savedUser)
  return savedUser
}

async function login(userCred) {
  const user = await mockDataService.login(userCred)
  if (user) return _saveLocalUser(user)
}
async function signup(userCred) {
  // Mock: signup creates new user (for demo, just login)
  return await login(userCred)
}
async function logout() {
  sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
  return await mockDataService.logout()
}

function _saveLocalUser(user) {
  sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
  return user
}

function getLoggedinUser() {
  return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER) || 'null')
}
