import { InputComment } from './InputComment'
import { CommentsList } from './CommentsList'
import { useDispatch, useSelector } from 'react-redux'
import { saveComment } from '../../store/actions/postActions'
import { useState, useEffect, useRef } from 'react'
import { utilService } from '../../services/utilService'

export const Comments = ({ postId, comments: initialComments }) => {
  const dispatch = useDispatch()
  const post = useSelector((state) => state.postModule.posts.find(p => p._id === postId))
  const comments = post ? post.comments || [] : initialComments || []
  const [optimisticComments, setOptimisticComments] = useState([])
  const previousPostId = useRef(postId)

  // Reset optimistic comments when postId changes
  useEffect(() => {
    if (previousPostId.current !== postId) {
      setOptimisticComments([])
      previousPostId.current = postId
    }
  }, [postId])

  // Combine store comments with optimistic comments
  const allComments = [...comments, ...optimisticComments]

  // Sort comments by createdAt in descending order (newest first)
  const sortedComments = [...allComments].sort((a, b) => {
    const dateA = new Date(a.createdAt || 0).getTime()
    const dateB = new Date(b.createdAt || 0).getTime()
    return dateB - dateA
  })

  const onSaveComment = async (comment) => {
    // Create optimistic comment with temporary ID
    const tempId = `temp_${utilService.makeId()}`
    const optimisticComment = {
      ...comment,
      _id: tempId,
      postId,
      createdAt: new Date().toISOString(),
      reactions: [],
      replies: [],
    }

    // Add to optimistic state immediately (optimistic update)
    setOptimisticComments((prev) => [...prev, optimisticComment])

    // Submit to server in background
    const commentToSave = { ...comment, postId }
    dispatch(saveComment(commentToSave)).then((savedComment) => {
      if (savedComment) {
        // Remove optimistic comment since Redux store is updated
        setOptimisticComments((prev) => prev.filter((c) => c._id !== tempId))

      }
      return savedComment
    }).catch((err) => {
      // On error, remove the optimistic comment
      console.error('Error saving comment:', err)
      setOptimisticComments((prev) => prev.filter((c) => c._id !== tempId))
    })
  }

  return (
    <section className="comments bg-white py-8 lg:py-16 antialiased">
      <div className="max-w-2xl mx-auto px-4">
        {/* Comments Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg lg:text-2xl font-bold text-gray-900">
            Comments ({allComments.length})
          </h2>
        </div>

        {/* Input Form */}
        <InputComment onSaveComment={onSaveComment} />

        {/* Comments List */}
        <CommentsList
          postId={postId}
          comments={sortedComments}
          onSaveComment={onSaveComment}
        />
      </div>
    </section>
  )
}
