import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AddPost } from './AddPost'
import { PostsList } from './PostsList'
import { loadPosts, getPostsLength } from '../../store/actions/postActions'
import loadongGif from '../../assets/imgs/loading-gif.gif'

export const Posts = () => {
  const dispatch = useDispatch()

  const { posts } = useSelector((state) => state.postModule)
  const { isPostsLoading } = useSelector((state) => state.postModule)

  useEffect(() => {
    dispatch(loadPosts())
    dispatch(getPostsLength())
  }, [dispatch])


  // Show loading spinner during initial load
  if (isPostsLoading && posts.length === 0)
    return (
      <section className="posts">
        <img
          src={loadongGif}
          alt=""
          style={{
            position: 'relative',
            left: ' 50%',
            transform: ' translate(-50%)',
          }}
        />
      </section>
    )

  return (
    <section className="posts">
      <AddPost />
      {posts && <PostsList />}
    </section>
  )
}
