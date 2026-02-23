import { httpService } from '../httpService'
import { API_CONFIG } from '../../config/constants'

const ENDPOINTS = API_CONFIG.ENDPOINTS

export const commentService = {
  query,
  getById,
  remove,
  save,
  likeComment,
}

async function query(filterBy = {}) {
  const endpoint = filterBy.postId
    ? ENDPOINTS.COMMENT_BY_POST(filterBy.postId)
    : ENDPOINTS.COMMENT_LIST
  return await httpService.get(endpoint, filterBy)
}

async function getById(id) {
  return await httpService.get(ENDPOINTS.COMMENT_BY_ID(id))
}

async function remove(comment) {
  return await httpService.delete(ENDPOINTS.COMMENT_BY_ID(comment._id))
}

async function save(comment) {
  const method = comment._id ? 'put' : 'post'
  const endpoint = comment._id ? ENDPOINTS.COMMENT_BY_ID(comment._id) : ENDPOINTS.COMMENT_LIST
  return await httpService[method](endpoint, comment)
}

async function likeComment(commentId) {
  return await httpService.put(ENDPOINTS.COMMENT_LIKE(commentId))
}
