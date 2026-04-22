import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setFilterByPosts } from '../../store/actions/postActions'
import { PostPreview } from './post-preview/PostPreview'

const INITIAL_POST_COUNT = 1
const NEXT_BATCH_SIZE = 5

export const PostsList = () => {
  const dispatch = useDispatch()
  const requestedInitialExpansionRef = useRef(false)
  const [loadingPlaceholderCount, setLoadingPlaceholderCount] = useState(
    INITIAL_POST_COUNT
  )

  const { posts, isPostsLoading, postsLength, currPage, filterByPosts } = useSelector(
    (state) => state.postModule
  )

  const isFeedPage = currPage === 'home'

  const requestMorePosts = useCallback(
    (nextLimit, placeholderCount) => {
      setLoadingPlaceholderCount(placeholderCount)
      dispatch(
        setFilterByPosts({
          ...filterByPosts,
          page: 1,
          limit: nextLimit,
        })
      )
    },
    [dispatch, filterByPosts]
  )

  useEffect(() => {
    if (!isFeedPage) {
      setLoadingPlaceholderCount(0)
      requestedInitialExpansionRef.current = false
      return
    }

    if (!posts.length) {
      setLoadingPlaceholderCount(INITIAL_POST_COUNT)
      requestedInitialExpansionRef.current = false
      return
    }

    if (posts.length === 1 && !isPostsLoading && !requestedInitialExpansionRef.current) {
      requestedInitialExpansionRef.current = true
      const remainingPosts = Math.max(0, (postsLength || 0) - 1)
      const placeholderCount = Math.min(NEXT_BATCH_SIZE, remainingPosts || NEXT_BATCH_SIZE)
      requestMorePosts(INITIAL_POST_COUNT + NEXT_BATCH_SIZE, placeholderCount)
      return
    }

    if (!isPostsLoading) {
      setLoadingPlaceholderCount(0)
    }
  }, [isFeedPage, isPostsLoading, posts.length, postsLength, requestMorePosts])

  useEffect(() => {
    if (!isFeedPage) return

    const handleScroll = () => {
      if (isPostsLoading) return
      if (!postsLength || posts.length >= postsLength) return

      if (
        window.scrollY + window.innerHeight + 160 >=
        document.documentElement.scrollHeight
      ) {
        const remainingPosts = postsLength - posts.length
        const nextBatchSize = Math.min(NEXT_BATCH_SIZE, remainingPosts)
        requestMorePosts(posts.length + nextBatchSize, nextBatchSize)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isFeedPage, isPostsLoading, posts.length, postsLength, requestMorePosts])

  return (
    <section className="posts-list">
      {posts.map((post, idx) => (
        <PostPreview key={post._id + idx} post={post} />
      ))}

      {Array.from({ length: loadingPlaceholderCount }).map((_, idx) => (
        <PostPreview key={`post-loading-${idx}`} isLoading />
      ))}

      {!!posts.length && !isPostsLoading && postsLength === posts.length && (
        <div className="load-more">
          <p>No more posts</p>
        </div>
      )}
    </section>
  )
}
