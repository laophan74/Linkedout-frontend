import { httpService } from '../httpService'

export const postService = {
  query,
  getById,
  remove,
  save,
  getPostsLength,
  likePost,
}

async function query(filterBy = {}) {
  return await httpService.get(`post`, filterBy)
}

async function getPostsLength(filterBy = {}) {
  const posts = await httpService.get(`post`)
  return posts.length
}

async function getById(id) {
  return await httpService.get(`post/${id}`)
}

async function remove(id) {
  return await httpService.delete(`post/${id}`)
}

async function save(post) {
  return await httpService[post._id ? 'put' : 'post'](
    `post${post._id ? '/' + post._id : ''}`,
    post
  )
}

async function likePost(postId) {
  return await httpService.put(`post/${postId}/like`)
}
