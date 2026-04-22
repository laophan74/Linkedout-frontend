import { PostPreview } from './post-preview/PostPreview'
import { useDispatch, useSelector } from 'react-redux'
import { useCallback, useEffect, useRef, useState } from 'react'
import loadingGif from '../../assets/imgs/loading-gif.gif'
import { addPosts, setNextPage } from '../../store/actions/postActions'

const INITIAL_VISIBLE_POSTS = 1
const PAGE_BATCH_SIZE = 5

export const PostsList = () => {
  const dispatch = useDispatch()
  const [visibleCount, setVisibleCount] = useState(0)
  const initialBatchTimeoutRef = useRef(null)
  const prevPostsLengthRef = useRef(0)

  const { posts, pageNumber, isPostsLoading, postsLength, currPage } = useSelector(
    (state) => state.postModule
  )

  const isFeedPage = currPage === 'home'
  const visiblePosts = isFeedPage ? posts.slice(0, visibleCount) : posts

  const onLoadNextPage = useCallback(() => {
    if (!isFeedPage) return
    if (isPostsLoading) return

    if (visibleCount < posts.length) {
      setVisibleCount((currentVisibleCount) =>
        Math.min(currentVisibleCount + PAGE_BATCH_SIZE, posts.length)
      )
      return
    }

    if (!postsLength && !posts?.length) return
    if (postsLength === posts?.length) return

    dispatch(addPosts())
    dispatch(setNextPage())
  }, [dispatch, isFeedPage, isPostsLoading, posts.length, postsLength, visibleCount])

  useEffect(() => {
    if (!isFeedPage) {
      setVisibleCount(posts.length)
      prevPostsLengthRef.current = posts.length
      return
    }

    if (initialBatchTimeoutRef.current) {
      clearTimeout(initialBatchTimeoutRef.current)
      initialBatchTimeoutRef.current = null
    }

    if (!posts.length) {
      setVisibleCount(0)
      prevPostsLengthRef.current = 0
      return
    }

    const prevLength = prevPostsLengthRef.current
    const hasNewBatch = posts.length > prevLength

    if (prevLength === 0) {
      setVisibleCount(INITIAL_VISIBLE_POSTS)
      initialBatchTimeoutRef.current = setTimeout(() => {
        setVisibleCount(Math.min(PAGE_BATCH_SIZE, posts.length))
      }, 220)
    } else if (hasNewBatch) {
      setVisibleCount(posts.length)
    } else {
      setVisibleCount((currentVisibleCount) =>
        Math.min(currentVisibleCount || PAGE_BATCH_SIZE, posts.length)
      )
    }

    prevPostsLengthRef.current = posts.length

    return () => {
      if (initialBatchTimeoutRef.current) {
        clearTimeout(initialBatchTimeoutRef.current)
        initialBatchTimeoutRef.current = null
      }
    }
  }, [isFeedPage, posts])

  useEffect(() => {
    if (!isFeedPage) return

    const handleScroll = () => {
      if (isPostsLoading) return
      if (visibleCount >= postsLength && visibleCount >= posts.length) return

      if (
        window.scrollY + window.innerHeight + 160 >=
        document.documentElement.scrollHeight
      ) {
        onLoadNextPage()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isFeedPage, isPostsLoading, onLoadNextPage, pageNumber, posts?.length, postsLength, visibleCount])

  return (
    <section className="posts-list">
      {!posts.length && isPostsLoading && (
        <div className="posts-list-loader">
          <img className="loading-gif" src={loadingGif} alt="Loading posts" />
        </div>
      )}

      {visiblePosts.map((post, idx) => (
        <PostPreview
          key={post._id + idx}
          post={post}
          loadPriority={idx === 0 ? 'primary' : 'secondary'}
        />
      ))}

      {!!posts.length && isPostsLoading && posts?.length < postsLength && (
        <div className="load-more">
          <span className="gif-container">
            <img className="loading-gif" src={loadingGif} alt="Loading more posts" />
          </span>
        </div>
      )}

      {!!posts.length && posts?.length === postsLength && (
        <div className="load-more">
          <p>No more posts</p>
        </div>
      )}
    </section>
  )
}
