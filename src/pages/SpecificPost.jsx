import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { PostHeader } from '../cmps/posts/post-preview/PostHeader'
import { PostBody } from '../cmps/posts/post-preview/PostBody'
import { SocialDetails } from '../cmps/posts/post-preview/SocialDetails'
import { Comments } from '../cmps/comments/Comments'
import { userService } from '../services/user/userService'
import {
  getPostsLength,
  loadPosts,
  setCurrPage,
  setFilterByPosts,
  savePost,
} from '../store/actions/postActions'
import { saveActivity } from '../store/actions/activityAction'
import loadingGif from '../assets/imgs/loading-gif.gif'

const SpecificPost = (props) => {
  const dispatch = useDispatch()
  const params = useParams()
  const { posts, isPostsLoading } = useSelector((state) => state.postModule)
  const { loggedInUser } = useSelector((state) => state.userModule)
  
  const [userPost, setUserPost] = useState(null)
  const [loadError, setLoadError] = useState(false)
  const [loadTimeout, setLoadTimeout] = useState(false)

  useEffect(() => {
    const loadPostData = async () => {
      try {
        console.log('[SpecificPost] Loading post with ID:', params.postId)
        setLoadError(false)
        setLoadTimeout(false)
        
        // Clear old posts to prevent mismatch errors
        dispatch({ type: 'SET_POSTS', posts: [] })
        
        dispatch(setCurrPage(null))
        const filterBy = {
          _id: params.postId,
        }
        dispatch(setFilterByPosts(filterBy))
        await dispatch(loadPosts())
        dispatch(getPostsLength())

        // Reset user post when loading new post
        setUserPost(null)
      } catch (err) {
        console.error('[SpecificPost] Error loading post:', err)
        setLoadError(true)
        dispatch({ type: 'SET_IS_POSTS_LOADING', isLoading: false })
      }
    }

    loadPostData()

    return () => {
      dispatch(setFilterByPosts(null))
    }
  }, [dispatch, params.postId])

  // Timeout check - if loading takes too long, show error
  useEffect(() => {
    if (!isPostsLoading) return

    const timeoutId = setTimeout(() => {
      console.error('[SpecificPost] Post loading timeout - taking too long')
      setLoadTimeout(true)
      dispatch({ type: 'SET_IS_POSTS_LOADING', isLoading: false })
    }, 10000) // 10 second timeout

    return () => clearTimeout(timeoutId)
  }, [isPostsLoading, dispatch])

  // Check if loaded but no matching post found
  useEffect(() => {
    if (!isPostsLoading && !loadError && !loadTimeout && posts && posts.length > 0) {
      console.log('[SpecificPost] Load complete. Posts:', posts.length, 'Expected ID:', params.postId)
      if (posts[0]._id !== params.postId) {
        console.error('[SpecificPost] Post ID mismatch. Got:', posts[0]._id, 'Expected:', params.postId)
        setLoadError(true)
      } else {
        console.log('[SpecificPost] Post loaded successfully')
      }
    } else if (!isPostsLoading && !loadError && !loadTimeout && posts && posts.length === 0) {
      console.error('[SpecificPost] No posts returned from API')
      setLoadError(true)
    }
  }, [isPostsLoading, posts, params.postId, loadError, loadTimeout])

  useEffect(() => {
    if (posts && posts.length > 0) {
      loadUserPost(posts[0].userId)
    }
  }, [posts])

  const loadUserPost = async (id) => {
    try {
      const user = await userService.getById(id)
      setUserPost(user)
    } catch (err) {
      console.error('Error loading user:', err)
    }
  }

  const onLikePost = () => {
    if (!posts || posts.length === 0) return
    const post = posts[0]
    
    const isAlreadyLike = (post.reactions || post.likes || []).some(
      (reaction) => reaction.userId === loggedInUser._id || reaction === loggedInUser._id
    )
    const newReactions = isAlreadyLike
      ? (post.reactions || post.likes || []).filter(
          (reaction) => reaction.userId !== loggedInUser._id && reaction !== loggedInUser._id
        )
      : [...(post.reactions || post.likes || []), loggedInUser._id]

    const postToSave = {
      ...post,
      reactions: newReactions,
      likes: newReactions,
    }

    dispatch(savePost(postToSave)).then((savedPost) => {
      if (savedPost?._id === post._id) {
        const newActivity = {
          type: isAlreadyLike ? 'remove-like' : 'add-like',
          createdBy: loggedInUser._id,
          createdTo: post.userId,
          postId: post._id,
        }
        dispatch(saveActivity(newActivity))
      }
    })
  }

  // Show loading when posts are being fetched or when the loaded post doesn't match the URL
  const isCorrectPostLoaded = posts && posts.length > 0 && posts[0]._id === params.postId
  
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
  
  if (isPostsLoading || !isCorrectPostLoaded) {
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

  const post = posts[0]

  return (
    <section className="post-detail-container">
      <article className="post-detail bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        {/* Post Header */}
        <div className="post-detail-header">
          <PostHeader post={post} userPost={userPost} />
        </div>

        {/* Post Body */}
        <div className="post-detail-body">
          <PostBody 
            body={post.body}
            imgUrl={post.imgBodyUrl}
            videoUrl={post.videoBodyUrl}
            link={post.link}
            title={post.title}
          />
        </div>

        {/* Social Details */}
        <div className="post-detail-social">
          <SocialDetails post={post} comments={post.comments} />
        </div>

        {/* Post Actions */}
        <div className="post-detail-actions">
          <button className="action-btn like text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={onLikePost}>
            <svg
              className="mr-1.5 w-3.5 h-3.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.008 8.714H1V18h3.008M4.008 8.714c2.763.071 4.527.055 6.011 0 0-3.707.785-6.714 3.008-6.714 1.497 0 1.994 2.297 1.994 3.571 0 2.143-1.994 3.143-1.994 3.143h3.979c.114 0 .224.013.333.036l.086.023A1.5 1.5 0 0 1 18 10.205v.5a1.5 1.5 0 0 1-1.5 1.5h-.5a1.5 1.5 0 0 1-1.5 1.5h-.5a1.5 1.5 0 0 1-1.5 1.5h-.5a1.5 1.5 0 0 1-1.5 1.5h-5.006V8.714Z"
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
      <Comments postId={post._id} comments={post.comments} userPostId={post.userId} />
    </section>
  )
}

export default SpecificPost
