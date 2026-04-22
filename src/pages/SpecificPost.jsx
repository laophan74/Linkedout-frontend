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
        <div className="p-8 text-center bg-white rounded-lg">
          <p className="text-red-600 mb-4 text-lg">
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
      <article className="post-detail bg-white border border-gray-200">
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
          <section className="button-container">
            <button className={`button flex-center ${isLiked ? 'liked' : ''}`} onClick={onLikePost} title="Like">
              <svg
                viewBox="0 0 24 24"
                className="btn-svg"
                width="22px"
                fill={isLiked ? '#dc2626' : 'none'}
                stroke={isLiked ? 'none' : 'currentColor'}
                strokeWidth={isLiked ? '0' : '2'}
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                    fill={isLiked ? '#dc2626' : 'none'}
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={isLiked ? '0' : '2'}
                  ></path>
                </g>
              </svg>
            </button>
            <button className="button flex-center" title="Comment">
              <svg
                viewBox="0 0 24 24"
                className="btn-svg"
                width="22px"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <path d="M20 15a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12v4l4-4z" />
                </g>
              </svg>
            </button>
            <button className="button flex-center" title="Share">
              <svg
                viewBox="0 0 24 24"
                className="btn-svg"
                width="22px"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <circle cx="18" cy="5" r="3"></circle>
                  <circle cx="6" cy="12" r="3"></circle>
                  <circle cx="18" cy="19" r="3"></circle>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </g>
              </svg>
            </button>
          </section>
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
