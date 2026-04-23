import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useDispatch, useSelector } from 'react-redux'
import { ImgPreview } from '../../profile/ImgPreview'
import { saveActivity } from '../../../store/actions/activityAction'
import { likePost, removePost } from '../../../store/actions/postActions'
import { useEffect, useState } from 'react'
import { PostActions } from './PostActions'
import { PostBody } from './PostBody'
import { PostHeader } from './PostHeader'
import { PostMenu } from './PostMenu'
import { SocialDetails } from './SocialDetails'

export const PostPreview = ({ post, isLoading = false }) => {
  const dispatch = useDispatch()
  const [isShowMenu, setIsShowMenu] = useState(false)
  const [isShowImgPreview, setIsShowImgPreview] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [currentPost, setCurrentPost] = useState(post)

  const { loggedInUser } = useSelector((state) => state.userModule)

  const getReactionUserId = (reaction) => {
    if (!reaction) return null
    if (typeof reaction === 'string') return reaction
    return reaction.userId || reaction._id || null
  }

  useEffect(() => {
    if (!post || !loggedInUser) return

    const userHasLiked = (post.reactions || post.likes || []).some(
      (reaction) => getReactionUserId(reaction) === loggedInUser._id
    )

    setIsLiked(userHasLiked)
    setLikeCount((post.reactions || post.likes || []).length)
    setCurrentPost(post)
  }, [loggedInUser, post])

  const toggleMenu = () => {
    setIsShowMenu((prevVal) => !prevVal)
  }

  const toggleShowImgPreview = () => {
    setIsShowImgPreview((prev) => !prev)
  }

  const onSharePost = async () => {
    const shareData = {
      title: 'Post',
      text: 'a post from Linkedout',
      url: `/main/post/${post.userId}/${post._id}`,
    }

    try {
      await navigator.share(shareData)
    } catch (err) {
      console.log(`Error: ${err}`)
    }
  }

  const onLikePost = () => {
    if (!loggedInUser) return

    const newIsLiked = !isLiked
    const newLikeCount = newIsLiked ? likeCount + 1 : likeCount - 1

    setIsLiked(newIsLiked)
    setLikeCount(newLikeCount)

    const newReactions = newIsLiked
      ? [...(currentPost.reactions || currentPost.likes || []), loggedInUser._id]
      : (currentPost.reactions || currentPost.likes || []).filter(
          (reaction) => getReactionUserId(reaction) !== loggedInUser._id
        )

    const optimisticPost = {
      ...currentPost,
      reactions: newReactions,
      likes: newReactions,
    }
    setCurrentPost(optimisticPost)

    dispatch(likePost(post._id))
      .then((savedPost) => {
        if (savedPost?._id === post._id) {
          const serverUserHasLiked = (savedPost.reactions || savedPost.likes || []).some(
            (reaction) => getReactionUserId(reaction) === loggedInUser._id
          )
          const serverLikeCount = (savedPost.reactions || savedPost.likes || []).length

          setIsLiked(serverUserHasLiked)
          setLikeCount(serverLikeCount)
          setCurrentPost(savedPost)

          const newActivity = {
            type: newIsLiked ? 'add-like' : 'remove-like',
            createdBy: loggedInUser._id,
            createdTo: post.userId,
            postId: post._id,
          }
          dispatch(saveActivity(newActivity))
        }
      })
      .catch((err) => {
        console.error('Error saving like:', err)
        setIsLiked(!newIsLiked)
        setLikeCount(likeCount)
      })
  }

  const onRemovePost = () => {
    dispatch(removePost(post._id))
  }

  function copyToClipBoard() {
    const postUrl = `https://linkedout-frontend-laophan74.vercel.app/#/main/post/${post.userId}/${post._id}`
    navigator.clipboard.writeText(postUrl)
  }

  if (isLoading) {
    return (
      <section className="post-preview post-preview-loading bg-white border-2 border-gray-200 rounded-lg">
        <PostHeader isLoading />
        <div className="post-content-skeleton">
          <span className="skeleton-line skeleton-line-long"></span>
          <span className="skeleton-line skeleton-line-medium"></span>
          <span className="skeleton-line skeleton-line-short"></span>
        </div>
        <div className="post-social-skeleton">
          <span className="skeleton-pill"></span>
          <span className="skeleton-pill"></span>
        </div>
      </section>
    )
  }

  const userPost = typeof post?.createdBy === 'object' ? post.createdBy : null

  return (
    <section className="post-preview bg-white border-2 border-gray-200 rounded-lg">
      <div className="menu" onClick={toggleMenu}>
        <FontAwesomeIcon className="dots-icon text-gray-500" icon="fa-solid fa-ellipsis" />
      </div>
      <PostHeader post={post} userPost={userPost} />
      <PostBody
        body={post.body}
        imgUrl={post.imgBodyUrl}
        videoUrl={post.videoBodyUrl}
        link={post.link}
        title={post.title}
        toggleShowImgPreview={toggleShowImgPreview}
        enableBodyTruncate
      />
      <SocialDetails comments={post.comments} post={currentPost} />
      <hr className="border-gray-200" />
      <PostActions
        post={currentPost}
        onLikePost={onLikePost}
        loggedInUser={loggedInUser}
        onSharePost={onSharePost}
        isLiked={isLiked}
      />

      {isShowMenu && (
        <PostMenu
          toggleMenu={toggleMenu}
          onRemovePost={onRemovePost}
          postUserId={post.userId}
          copyToClipBoard={copyToClipBoard}
        />
      )}

      {isShowImgPreview && (
        <ImgPreview
          toggleShowImg={toggleShowImgPreview}
          imgUrl={post.imgBodyUrl}
          title="Image"
        />
      )}
    </section>
  )
}
