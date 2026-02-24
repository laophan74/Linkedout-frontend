import { InputComment } from './InputComment'
import { CommentsList } from './CommentsList'
import { useDispatch, useSelector } from 'react-redux'
import { saveComment } from '../../store/actions/postActions'
import { saveActivity } from '../../store/actions/activityAction'
import { useState, useEffect } from 'react'
import { utilService } from '../../services/utilService'

export const Comments = ({ postId, comments: initialComments, userPostId }) => {
  const dispatch = useDispatch()
  const { loggedInUser } = useSelector((state) => state.userModule)
  const [comments, setComments] = useState(initialComments || [])

  // Sync with initial comments from Redux (when post updates)
  useEffect(() => {
    setComments(initialComments || [])
  }, [initialComments])

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

    // Add to local state immediately (optimistic update)
    setComments((prevComments) => [...(prevComments || []), optimisticComment])

    // Submit to server in background
    const commentToSave = { ...comment, postId }
    dispatch(saveComment(commentToSave)).then((savedComment) => {
      if (savedComment) {
        // Replace temporary comment with real comment from server
        setComments((prevComments) =>
          prevComments.map((c) =>
            c._id === tempId ? savedComment : c
          )
        )

        // Create activity
        const newActivity = {
          type: commentToSave._id ? 'update-comment' : 'add-comment',
          description: '',
          createdBy: loggedInUser._id,
          createdTo: userPostId,
          commentId: savedComment._id,
          postId: savedComment.postId,
        }
        dispatch(saveActivity(newActivity))
      }
      return savedComment
    }).catch((err) => {
      // On error, remove the optimistic comment
      console.error('Error saving comment:', err)
      setComments((prevComments) =>
        prevComments.filter((c) => c._id !== tempId)
      )
    })
  }

  if (!comments) return <div>Loading</div>
  
  return (
    <section className="bg-white dark:bg-gray-900 py-8 lg:py-16 antialiased">
      <div className="max-w-2xl mx-auto px-4">
        {/* Comments Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">
            Comments ({comments?.length || 0})
          </h2>
        </div>

        {/* Input Form */}
        <InputComment onSaveComment={onSaveComment} />

        {/* Comments List */}
        <CommentsList
          postId={postId}
          comments={comments}
          onSaveComment={onSaveComment}
        />
      </div>
    </section>
  )
}
