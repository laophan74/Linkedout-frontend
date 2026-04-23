import { httpService } from '../httpService'
import { API_CONFIG } from '../../config/constants'
import { userService } from '../user/userService'

const ENDPOINTS = API_CONFIG.ENDPOINTS

function mapBackendReply(reply) {
  if (!reply) return reply

  const createdByObj = reply.createdBy
  const userId =
    reply.userId ||
    (typeof createdByObj === 'object' ? createdByObj?._id : createdByObj)

  return {
    ...reply,
    _id: reply._id,
    userId,
    postId: reply.postId || reply.post?._id || reply.post,
    commentId: reply.commentId || reply.comment?._id || reply.comment,
    reactions: reply.likes || reply.reactions || [],
    likes: reply.likes || reply.reactions || [],
    createdBy:
      typeof reply.createdBy === 'object'
        ? userService.normalizeUser(reply.createdBy)
        : reply.createdBy,
  }
}

function mapBackendComment(comment) {
  if (!comment) return comment

  const createdByObj = comment.createdBy
  const userId =
    comment.userId ||
    (typeof createdByObj === 'object' ? createdByObj?._id : createdByObj)

  return {
    ...comment,
    _id: comment._id,
    userId,
    postId: comment.postId || comment.post?._id || comment.post,
    txt: comment.txt,
    reactions: comment.likes || comment.reactions || [],
    likes: comment.likes || comment.reactions || [],
    replies: (comment.replies || []).map(mapBackendReply),
    createdBy:
      typeof comment.createdBy === 'object'
        ? userService.normalizeUser(comment.createdBy)
        : comment.createdBy,
  }
}

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
  const comments = await httpService.get(endpoint, filterBy)
  return Array.isArray(comments) ? comments.map(mapBackendComment) : comments
}

async function getById(id) {
  const comment = await httpService.get(ENDPOINTS.COMMENT_BY_ID(id))
  return mapBackendComment(comment)
}

async function remove(comment) {
  return await httpService.delete(ENDPOINTS.COMMENT_BY_ID(comment._id))
}

async function save(comment) {
  const method = comment._id ? 'put' : 'post'
  const endpoint = comment._id ? ENDPOINTS.COMMENT_BY_ID(comment._id) : ENDPOINTS.COMMENT_LIST
  const savedComment = await httpService[method](endpoint, comment)
  return mapBackendComment(savedComment)
}

async function likeComment(commentId) {
  return await httpService.put(ENDPOINTS.COMMENT_LIKE(commentId))
}
