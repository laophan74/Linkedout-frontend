import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { PostHeader } from '../cmps/posts/post-preview/PostHeader'
import { PostBody } from '../cmps/posts/post-preview/PostBody'
import { SocialDetails } from '../cmps/posts/post-preview/SocialDetails'
import { Comments } from '../cmps/comments/Comments'
import { userService } from '../services/user/userService'
import { postService } from '../services/posts/postService'
import {
  getPostsLength,
  setCurrPage,
  setFilterByPosts,
  likePost,
} from '../store/actions/postActions'
import { saveActivity } from '../store/actions/activityAction'
import loadingGif from '../assets/imgs/loading-gif.gif'

const SpecificPost = (props) => {
  const dispatch = useDispatch()
  const params = useParams()
  const { loggedInUser } = useSelector((state) => state.userModule)
  const loggedInUserId = loggedInUser?._id
  
  const [post, setPost] = useState(null)
  const [userPost, setUserPost] = useState(null)
  const [loadError, setLoadError] = useState(false)
  const [loadTimeout, setLoadTimeout] = useState(false)
  const [isLoadingPost, setIsLoadingPost] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)

  const getReactionUserId = (reaction) => {
    if (!reaction) return null
    if (typeof reaction === 'string') return reaction
    return reaction.userId || reaction._id || null
  }

  useEffect(() => {
    const loadPostData = async () => {
      try {
        console.log('[SpecificPost] Loading post with ID:', params.postId)
        setLoadError(false)
        setLoadTimeout(false)
        setIsLoadingPost(true)

        // Clear old posts to prevent mismatch errors
        dispatch({ type: 'SET_POSTS', posts: [] })
        dispatch(setCurrPage(null))

        const loadedPost = await postService.getById(params.postId)
        if (!loadedPost || loadedPost._id !== params.postId) {
          throw new Error('Loaded post does not match requested id')
        }

        setPost(loadedPost)
        dispatch({ type: 'SET_POSTS', posts: [loadedPost] })
        dispatch(getPostsLength())

        // Initialize like state
        const userHasLiked = (loadedPost.reactions || loadedPost.likes || []).some(
          (reaction) => getReactionUserId(reaction) === loggedInUserId
        )
        setIsLiked(userHasLiked)
        setLikeCount((loadedPost.reactions || loadedPost.likes || []).length)

        // Reset user post when loading new post
        setUserPost(null)
      } catch (err) {
        console.error('[SpecificPost] Error loading post:', err)
        setLoadError(true)
        dispatch({ type: 'SET_IS_POSTS_LOADING', isLoading: false })
      } finally {
        setIsLoadingPost(false)
      }
    }

    loadPostData()

    return () => {
      dispatch(setFilterByPosts(null))
    }
  }, [dispatch, params.postId, loggedInUserId])

  // Timeout check - if loading takes too long, show error
  useEffect(() => {
    if (!isLoadingPost) return

    const timeoutId = setTimeout(() => {
      console.error('[SpecificPost] Post loading timeout - taking too long')
      setLoadTimeout(true)
      dispatch({ type: 'SET_IS_POSTS_LOADING', isLoading: false })
    }, 10000) // 10 second timeout

    return () => clearTimeout(timeoutId)
  }, [isLoadingPost, dispatch])

  useEffect(() => {
    if (post) {
      loadUserPost(post.userId)
    }
  }, [post])

  const loadUserPost = async (id) => {
    try {
      const user = await userService.getById(id)
      setUserPost(user)
    } catch (err) {
      console.error('Error loading user:', err)
    }
  }

  const onLikePost = () => {
    if (!post || !loggedInUserId) return

    // Optimistic update
    const newIsLiked = !isLiked
    const newLikeCount = newIsLiked ? likeCount + 1 : likeCount - 1

    setIsLiked(newIsLiked)
    setLikeCount(newLikeCount)

    // Update local post state for immediate UI feedback
    const newReactions = newIsLiked
      ? [...(post.reactions || post.likes || []), loggedInUser._id]
      : (post.reactions || post.likes || []).filter(
          (reaction) => getReactionUserId(reaction) !== loggedInUser._id
        )

    const optimisticPost = {
      ...post,
      reactions: newReactions,
      likes: newReactions,
    }
    setPost(optimisticPost)

    // Send to backend
    dispatch(likePost(post._id)).then((savedPost) => {
      if (savedPost?._id === post._id) {
        // Update with server response
        const serverUserHasLiked = (savedPost.reactions || savedPost.likes || []).some(
          (reaction) => getReactionUserId(reaction) === loggedInUserId
        )
        const serverLikeCount = (savedPost.reactions || savedPost.likes || []).length

        setIsLiked(serverUserHasLiked)
        setLikeCount(serverLikeCount)
        setPost(savedPost)

        const newActivity = {
          type: newIsLiked ? 'add-like' : 'remove-like',
          createdBy: loggedInUser._id,
          createdTo: post.userId,
          postId: post._id,
        }
        dispatch(saveActivity(newActivity))
      }
    }).catch((err) => {
      // Revert optimistic update on error
      console.error('Error saving like:', err)
      setIsLiked(!newIsLiked)
      setLikeCount(likeCount)
      setPost(post)
    })
  }

  // Show loading when posts are being fetched or when the loaded post doesn't match the expected ID
  const isCorrectPostLoaded = !isLoadingPost && post && post._id === params.postId
  
  // Show error state if loading failed or timed out
  if (loadError || loadTimeout) {
    return (
      <section className="post-detail-container">
        <div className="p-8 text-center bg-white dark:bg-gray-900 rounded-lg">
          <p className="text-red-600 dark:text-red-400 mb-4 text-lg">
            {loadTimeout ? 'Request timeout. The server is taking too long to respond.' : 'Failed to load post. The post may not exist or there was a network error.'}
          </p>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      </section>
    )
  }
  
  if (isLoadingPost || !isCorrectPostLoaded) {
    return (
      <section className="post-detail-container">
        <div className="loading">
          <span>
            <img src={loadingGif} alt="Loading..." />
          </span>
        </div>
      </section>
    )
  }

  const postToRender = post

  return (
    <section className="post-detail-container">
      <article className="post-detail bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-700">
        {/* Post Header */}
        <div className="post-detail-header">
          <PostHeader post={postToRender} userPost={userPost} />
        </div>

        {/* Post Body */}
        <div className="post-detail-body">
          <PostBody 
            body={postToRender.body}
            imgUrl={postToRender.imgBodyUrl}
            videoUrl={postToRender.videoBodyUrl}
            link={postToRender.link}
            title={postToRender.title}
          />
        </div>

        {/* Social Details */}
        <div className="post-detail-social">
          <SocialDetails
            post={{ ...postToRender, reactions: Array(likeCount).fill(null) }}
            comments={postToRender.comments}
          />
        </div>

        {/* Post Actions */}
        <div className="post-detail-actions">
          <button
            className="action-btn like text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            onClick={onLikePost}
          >
            <svg
              className={`mr-1.5 w-3.5 h-3.5 ${isLiked ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill={isLiked ? 'currentColor' : 'none'}
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"
              />
            </svg>
            <span>Like</span>
          </button>
          <button className="action-btn comment text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
            <svg
              className="mr-1.5 w-3.5 h-3.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 18"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 5h5M5 8h2m6-3h2m-5 3h6m2-7H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3v5l5-5h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"
              />
            </svg>
            <span>Comment</span>
          </button>
          <button className="action-btn share text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
            <svg
              className="mr-1.5 w-3.5 h-3.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 18 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1.248 15C.22 11.77 2.275 4.232 9.466 4.232V2.079a1.025 1.025 0 0 1 1.644-.862l5.479 4.307a1.108 1.108 0 0 1 0 1.723l-5.48 4.307a1.026 1.026 0 0 1-1.643-.861V8.539C6.169 9.277 2.753 11.803 1.248 15Z"
              />
            </svg>
            <span>Share</span>
          </button>
        </div>
      </article>

      {/* Comments Section */}
      <div className="post-detail-comments">
        <Comments postId={postToRender._id} comments={postToRender.comments} userPostId={postToRender.userId} />
      </div>
    </section>
  )
}

export default SpecificPost
