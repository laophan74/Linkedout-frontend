import { httpService } from '../httpService'
import { API_CONFIG } from '../../config/constants'
import { userService } from '../user/userService'

const ENDPOINTS = API_CONFIG.ENDPOINTS

export const postService = {
  query,
  getById,
  remove,
  save,
  getPostsLength,
  likePost,
}

// Map backend comment fields to frontend schema
function mapBackendComment(backendComment) {
  if (!backendComment) return backendComment
  
  // Extract userId from createdBy (which can be string ID or full object)
  const createdByObj = backendComment.createdBy
  const userId = typeof createdByObj === 'object' ? createdByObj._id : createdByObj
  
  return {
    ...backendComment,
    _id: backendComment._id,
    userId: userId,
    txt: backendComment.txt,
    reactions: backendComment.likes || [],
    likes: backendComment.likes || [],
    replies: backendComment.replies || [],
    postId: backendComment.postId,
    createdBy:
      typeof backendComment.createdBy === 'object'
        ? userService.normalizeUser(backendComment.createdBy)
        : backendComment.createdBy, // Keep original for reference
  }
}

// Map backend post fields to frontend schema
function mapBackendPost(backendPost) {
  if (!backendPost) return backendPost
  
  // Extract userId from createdBy (which can be string ID or full object)
  const createdByObj = backendPost.createdBy
  const userId = typeof createdByObj === 'object' ? createdByObj._id : createdByObj
  
  return {
    ...backendPost,
    _id: backendPost._id,
    userId: userId,
    body: backendPost.txt,
    imgBodyUrl: backendPost.imgUrl,
    videoBodyUrl: backendPost.videoBodyUrl || '',
    link: backendPost.link || '',
    title: backendPost.title || '',
    reactions: backendPost.likes || [],
    comments: (backendPost.comments || []).map(mapBackendComment),
    txt: backendPost.txt, // Keep original for backend compatibility
    createdBy:
      typeof backendPost.createdBy === 'object'
        ? userService.normalizeUser(backendPost.createdBy)
        : backendPost.createdBy, // Keep original for backend compatibility
    likes: Array.isArray(backendPost.likes)
      ? backendPost.likes.map((like) =>
          typeof like === 'object' ? userService.normalizeUser(like) : like
        )
      : backendPost.likes, // Keep original for backend compatibility
  }
}

async function query(filterBy = {}) {
  const posts = await httpService.get(ENDPOINTS.POST_LIST, filterBy)
  if (!Array.isArray(posts)) return posts

  const mappedPosts = posts.map(mapBackendPost)
  if (posts._pagination) {
    Object.defineProperty(mappedPosts, '_pagination', {
      value: posts._pagination,
      enumerable: false,
    })
  }
  return mappedPosts
}

async function getPostsLength(filterBy = {}) {
  const posts = await query({ ...filterBy, page: 1, limit: 1 })
  return posts?._pagination?.total ?? posts.length
}

async function getById(id) {
  const post = await httpService.get(ENDPOINTS.POST_BY_ID(id))
  return mapBackendPost(post)
}

async function remove(id) {
  return await httpService.delete(ENDPOINTS.POST_BY_ID(id))
}

async function save(post) {
  const postToSave = {
    txt: post.body || post.txt,
    imgUrl: post.imgBodyUrl || post.imgUrl,
  }
  const method = post._id ? 'put' : 'post'
  const endpoint = post._id ? ENDPOINTS.POST_BY_ID(post._id) : ENDPOINTS.POST_LIST
  const result = await httpService[method](endpoint, postToSave)
  return mapBackendPost(result)
}

async function likePost(postId) {
  const result = await httpService.put(ENDPOINTS.POST_LIKE(postId))
  return mapBackendPost(result)
}
