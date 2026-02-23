import { httpService } from '../httpService'

export const postService = {
  query,
  getById,
  remove,
  save,
  getPostsLength,
  likePost,
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
    comments: backendPost.comments || [],
    txt: backendPost.txt, // Keep original for backend compatibility
    createdBy: backendPost.createdBy, // Keep original for backend compatibility
    likes: backendPost.likes, // Keep original for backend compatibility
  }
}

async function query(filterBy = {}) {
  const posts = await httpService.get(`post`, filterBy)
  return Array.isArray(posts) ? posts.map(mapBackendPost) : posts
}

async function getPostsLength(filterBy = {}) {
  const posts = await httpService.get(`post`)
  return posts.length
}

async function getById(id) {
  const post = await httpService.get(`post/${id}`)
  return mapBackendPost(post)
}

async function remove(id) {
  return await httpService.delete(`post/${id}`)
}

async function save(post) {
  const postToSave = {
    txt: post.body || post.txt,
    imgUrl: post.imgBodyUrl || post.imgUrl,
    videoBodyUrl: post.videoBodyUrl,
    link: post.link,
    title: post.title,
  }
  const result = await httpService[post._id ? 'put' : 'post'](
    `post${post._id ? '/' + post._id : ''}`,
    postToSave
  )
  return mapBackendPost(result)
}

async function likePost(postId) {
  const result = await httpService.put(`post/${postId}/like`)
  return mapBackendPost(result)
}
