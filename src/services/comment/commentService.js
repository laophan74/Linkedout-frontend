import { mockDataService } from '../mockDataService'

export const commentService = {
  query,
  getById,
  remove,
  save,
}

async function query(filterBy = {}) {
  return await mockDataService.getComments()
}

async function getById(id) {
  const comments = await mockDataService.getComments()
  return comments.find(c => c._id === id)
}

async function remove(comment) {
  // Mock: just return success
  return Promise.resolve(true)
}

async function save(comment) {
  return await mockDataService.saveComment(comment)
}
