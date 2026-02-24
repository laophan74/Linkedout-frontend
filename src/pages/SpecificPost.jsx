import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { PostHeader } from '../cmps/posts/post-preview/PostHeader'
import { PostBody } from '../cmps/posts/post-preview/PostBody'
import { SocialDetails } from '../cmps/posts/post-preview/SocialDetails'
import { Comments } from '../cmps/comments/Comments'
import { userService } from '../services/user/userService'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  getPostsLength,
  loadPosts,
  setCurrPage,
  setFilterByPosts,
  savePost,
} from '../store/actions/postActions'
import { saveActivity } from '../store/actions/activityAction'

const SpecificPost = (props) => {
  const dispatch = useDispatch()
  const params = useParams()
  const { posts } = useSelector((state) => state.postModule)
  const { loggedInUser } = useSelector((state) => state.userModule)
  
  const [userPost, setUserPost] = useState(null)

  useEffect(() => {
    dispatch(setCurrPage(null))
    const filterBy = {
      _id: params.postId,
    }
    dispatch(setFilterByPosts(filterBy))
    dispatch(loadPosts())
    dispatch(getPostsLength())

    return () => {
      dispatch(setFilterByPosts(null))
    }
  }, [dispatch, params.postId])

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

  if (!posts || posts.length === 0) {
    return <div className="post-detail-container"><div className="loading">Loading...</div></div>
  }

  const post = posts[0]

  return (
    <section className="post-detail-container">
      <article className="post-detail">
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
          <button className="action-btn like" onClick={onLikePost}>
            <FontAwesomeIcon icon="fa-solid fa-thumbs-up" />
            <span>Like</span>
          </button>
          <button className="action-btn comment">
            <FontAwesomeIcon icon="fa-solid fa-comment" />
            <span>Comment</span>
          </button>
          <button className="action-btn share">
            <FontAwesomeIcon icon="fa-solid fa-share" />
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
