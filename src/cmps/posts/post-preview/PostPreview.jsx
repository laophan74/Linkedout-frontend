import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { PostActions } from './PostActions'
import { PostBody } from './PostBody'
import { PostHeader } from './PostHeader'
import { SocialDetails } from './SocialDetails'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { userService } from '../../../services/user/userService'

import { PostMenu } from './PostMenu'
import { savePost, removePost } from '../../../store/actions/postActions'
import { saveActivity } from '../../../store/actions/activityAction'
import { ImgPreview } from '../../profile/ImgPreview'

export const PostPreview = ({ post }) => {
  const dispatch = useDispatch()

  const [userPost, setUserPost] = useState(null)
  const [isShowMenu, setIsShowMenu] = useState(false)
  const [isShowImgPreview, setIsShowImgPreview] = useState(false)

  const { loggedInUser } = useSelector((state) => state.userModule)

  useEffect(() => {
    loadUserPost(post.userId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedInUser])

  const toggleMenu = () => {
    setIsShowMenu((prevVal) => !prevVal)
  }

  const toggleShowImgPreview = () => {
    setIsShowImgPreview((prev) => !prev)
  }

  const loadUserPost = async (id) => {
    if (!post) return
    const userPost = await userService.getById(id)
    setUserPost(() => userPost)
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
      likes: newReactions, // Keep likes for backend compatibility
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

  const onRemovePost = () => {
    dispatch(removePost(post._id))
  }

  function copyToClipBoard() {
    const postUrl = `https://linkedout-frontend-laophan74.vercel.app/#/main/post/${post.userId}/${post._id}`
    /* Copy the text inside the text field */
    navigator.clipboard.writeText(postUrl)
    // alert('Copied the text: ' + postUrl)
  }

  return (
    <section className="post-preview bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-lg">
      <div className="menu" onClick={toggleMenu}>
        <FontAwesomeIcon className="dots-icon text-gray-500 dark:text-gray-400" icon="fa-solid fa-ellipsis" />
      </div>
      <PostHeader post={post} userPost={userPost} />
      <PostBody
        body={post.body}
        imgUrl={post.imgBodyUrl}
        videoUrl={post.videoBodyUrl}
        link={post.link}
        title={post.title}
        toggleShowImgPreview={toggleShowImgPreview}
      />
      <SocialDetails
        comments={post.comments}
        post={post}
      />
      <hr className="border-gray-200 dark:border-gray-700" />
      <PostActions
        post={post}
        onLikePost={onLikePost}
        loggedInUser={loggedInUser}
        onSharePost={onSharePost}
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
