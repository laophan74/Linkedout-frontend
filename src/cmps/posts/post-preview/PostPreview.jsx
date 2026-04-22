import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { PostActions } from './PostActions'
import { PostBody } from './PostBody'
import { PostHeader } from './PostHeader'
import { SocialDetails } from './SocialDetails'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { userService } from '../../../services/user/userService'

import { PostMenu } from './PostMenu'
import { removePost, likePost } from '../../../store/actions/postActions'
import { saveActivity } from '../../../store/actions/activityAction'
import { ImgPreview } from '../../profile/ImgPreview'

export const PostPreview = ({ post, loadPriority = 'secondary' }) => {
  const dispatch = useDispatch()

  const [userPost, setUserPost] = useState(
    typeof post?.createdBy === 'object' ? post.createdBy : null
  )
  const [isShowMenu, setIsShowMenu] = useState(false)
  const [isShowImgPreview, setIsShowImgPreview] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [currentPost, setCurrentPost] = useState(post)
  const [isBodyReady, setIsBodyReady] = useState(false)
  const [isSocialReady, setIsSocialReady] = useState(false)

  const { loggedInUser } = useSelector((state) => state.userModule)

  const getReactionUserId = (reaction) => {
    if (!reaction) return null
    if (typeof reaction === 'string') return reaction
    return reaction.userId || reaction._id || null
  }

  useEffect(() => {
    let isMounted = true

    const loadPostUser = async () => {
      const postUserFromPost =
        typeof post?.createdBy === 'object' ? post.createdBy : null

      if (postUserFromPost) {
        setUserPost(postUserFromPost)
        return
      }

      if (!post?.userId) return

      const loadedUserPost = await userService.getById(post.userId)
      if (isMounted) setUserPost(loadedUserPost)
    }

    if (!post || !loggedInUser) return undefined

    setUserPost(typeof post?.createdBy === 'object' ? post.createdBy : null)
    loadPostUser()

    const userHasLiked = (post.reactions || post.likes || []).some(
      (reaction) => getReactionUserId(reaction) === loggedInUser._id
    )
    setIsLiked(userHasLiked)
    setLikeCount((post.reactions || post.likes || []).length)
    setCurrentPost(post)

    return () => {
      isMounted = false
    }
  }, [loggedInUser, post])

  useEffect(() => {
    setIsBodyReady(false)
    setIsSocialReady(false)

    if (!userPost) return undefined

    const bodyDelay = loadPriority === 'primary' ? 80 : 130
    const socialDelay = loadPriority === 'primary' ? 160 : 240

    const bodyTimeout = setTimeout(() => setIsBodyReady(true), bodyDelay)
    const socialTimeout = setTimeout(() => setIsSocialReady(true), socialDelay)

    return () => {
      clearTimeout(bodyTimeout)
      clearTimeout(socialTimeout)
    }
  }, [loadPriority, post._id, userPost])

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

  return (
    <section className="post-preview bg-white border-2 border-gray-200 rounded-lg">
      <div className="menu" onClick={toggleMenu}>
        <FontAwesomeIcon className="dots-icon text-gray-500" icon="fa-solid fa-ellipsis" />
      </div>
      <PostHeader post={post} userPost={userPost} />

      {isBodyReady ? (
        <PostBody
          body={post.body}
          imgUrl={post.imgBodyUrl}
          videoUrl={post.videoBodyUrl}
          link={post.link}
          title={post.title}
          toggleShowImgPreview={toggleShowImgPreview}
        />
      ) : (
        <div className="post-content-skeleton">
          <span className="skeleton-line skeleton-line-long"></span>
          <span className="skeleton-line skeleton-line-medium"></span>
        </div>
      )}

      {isSocialReady ? (
        <>
          <SocialDetails comments={post.comments} post={currentPost} />
          <hr className="border-gray-200" />
          <PostActions
            post={currentPost}
            onLikePost={onLikePost}
            loggedInUser={loggedInUser}
            onSharePost={onSharePost}
            isLiked={isLiked}
          />
        </>
      ) : (
        <div className="post-social-skeleton">
          <span className="skeleton-pill"></span>
          <span className="skeleton-pill"></span>
        </div>
      )}

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
