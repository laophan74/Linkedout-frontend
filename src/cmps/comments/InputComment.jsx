import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSelector } from 'react-redux'
import { useState } from 'react' 

export const InputComment = ({ onSaveComment }) => {
  const { loggedInUser } = useSelector((state) => state.userModule)
  const { imgUrl, _id } = loggedInUser

  const [newComment, setNewComment] = useState({
    txt: '',
    userId: _id,
  })

  const handleChange = async ({ target }) => {
    const field = target.name
    let value = target.type === 'number' ? +target.value || '' : target.value
    setNewComment((prevCred) => ({ ...prevCred, [field]: value }))
  }

  const doSubmit = (e) => {
    e.preventDefault()
    if (!newComment.txt.trim()) return
    onSaveComment(newComment)
    setNewComment(() => ({ txt: '', userId: _id }))
  }

  return (
    <form className="mb-6" onSubmit={doSubmit}>
      <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <label htmlFor="comment" className="sr-only">Your comment</label>
        <textarea 
          id="comment" 
          rows="6"
          name="txt"
          value={newComment.txt}
          onChange={handleChange}
          className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
          placeholder="Write a comment..." 
          required
        />
      </div>
      <button 
        type="submit"
        className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
      >
        Post comment
      </button>
    </form>
  )
}
