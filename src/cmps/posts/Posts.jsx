import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AddPost } from './AddPost'
import { PostsList } from './PostsList'
import { loadPosts, getPostsLength } from '../../store/actions/postActions'

export const Posts = () => {
  const dispatch = useDispatch()

  const { filterByPosts, currPage } = useSelector((state) => state.postModule)

  useEffect(() => {
    if (currPage === 'home' && !filterByPosts?.limit) return

    dispatch(loadPosts())
    dispatch(getPostsLength())
  }, [currPage, dispatch, filterByPosts?.page, filterByPosts?.limit, filterByPosts?.txt])

  return (
    <section className="posts">
      <AddPost />
      <PostsList />
    </section>
  )
}
