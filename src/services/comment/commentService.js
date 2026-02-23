import { httpService } from '../httpService'

export const commentService = {
  query,
  getById,
  remove,
  save,
  likeComment,
}

async function query(filterBy = {}) {
  return await httpService.get(`comment`, filterBy)
}

async function getById(id) {
  return await httpService.get(`comment/${id}`)
}

async function remove(comment) {
  return await httpService.delete(`comment/${comment._id}`)
}

async function save(comment) {
  return await httpService[comment._id ? 'put' : 'post'](
    `comment${comment._id ? '/' + comment._id : ''}`,
    comment
  )
}

async function likeComment(commentId) {
  return await httpService.put(`comment/${commentId}/like`)
}
