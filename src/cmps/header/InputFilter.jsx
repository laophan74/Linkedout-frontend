import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadPosts, setFilterByPosts } from '../../store/actions/postActions'

export const InputFilter = () => {
  const dispatch = useDispatch()
  const { users } = useSelector((state) => state.userModule)
  const { filterByPosts, currPage } = useSelector((state) => state.postModule)
  const [txt, setTxt] = useState('')
  const [isFocus, setIsFocus] = useState(false)

  const suggestions = useMemo(() => {
    const search = txt.trim().toLowerCase()
    if (!search || !Array.isArray(users)) return []

    return users
      .map((user) => user.fullname)
      .filter(Boolean)
      .filter((name) => name.toLowerCase().includes(search))
      .slice(0, 5)
  }, [txt, users])

  useEffect(() => {
    if (currPage !== 'home' && currPage !== 'profile') return

    const timeoutId = setTimeout(() => {
      const nextFilter = {
        ...filterByPosts,
        page: 1,
        limit: filterByPosts?.limit || 5,
        txt: txt.trim(),
      }

      if (!nextFilter.txt) delete nextFilter.txt
      dispatch(setFilterByPosts(nextFilter))
      dispatch(loadPosts(nextFilter))
    }, 350)

    return () => clearTimeout(timeoutId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txt])

  const onSelectSuggestion = (name) => {
    setTxt(name)
    setIsFocus(false)
  }

  return (
    <section className="input">
      <FontAwesomeIcon className="search-icon" icon="fas fa-search" />
      <input
        type="text"
        placeholder="Search posts..."
        onChange={({ target }) => setTxt(target.value)}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setTimeout(() => setIsFocus(false), 120)}
        id="txt"
        name="txt"
        value={txt}
        autoComplete="off"
      />
      {isFocus && suggestions.length > 0 && (
        <ul className="suggestions focus">
          {suggestions.map((name) => (
            <li key={name}>
              <button type="button" onMouseDown={() => onSelectSuggestion(name)}>
                {name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
