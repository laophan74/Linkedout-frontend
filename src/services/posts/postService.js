import { mockDataService } from '../mockDataService'

const ENDPOINT = 'post'

export const postService = {
  query,
  getById,
  remove,
  save,
  getPostsLength,
}

const postsCash = {}

async function query(filterBy = {}) {
  return await mockDataService.getPosts()
}
async function getPostsLength(filterBy = {}) {
  const posts = await mockDataService.getPosts()
  return posts.length
}

async function getById(id) {
  if (postsCash[id]) return postsCash[id]
  else {
    const post = await mockDataService.getPostById(id)
    if (post) postsCash[id] = post
    return post
  }
}

async function remove(id) {
  return await mockDataService.deletePost(id)
}

async function save(post) {
  return await mockDataService.savePost(post)
}
