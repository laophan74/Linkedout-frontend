import { InputComment } from './InputComment'
import { CommentsList } from './CommentsList'
import { useDispatch, useSelector } from 'react-redux'
import { saveComment } from '../../store/actions/postActions'
import { saveActivity } from '../../store/actions/activityAction'

export const Comments = ({ postId, comments, userPostId }) => {
  const dispatch = useDispatch()
  const { loggedInUser } = useSelector((state) => state.userModule)

  const onSaveComment = async (comment) => {
    const commentToSave = { ...comment, postId }
    dispatch(saveComment(commentToSave)).then((savedComment) => {
      if (savedComment) {
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
