import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import eruda from 'eruda'
import App from './App'
import { store } from './store'

// Import Tailwind CSS
import './index.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import {
  faCheckSquare,
  faCoffee,
  faHomeLgAlt,
  faUserFriends,
  faSuitcase,
  faSearch,
  faComment,
  faBell,
  faSortDown,
  faTh,
  faPlus,
  faImage,
  faVideo,
  faCalendarDays,
  faNewspaper,
  faEllipsis,
  faThumbsUp,
  faShare,
  faPaperPlane,
  faFaceSmile,
  faCompass,
  faUserGroup,
  faX,
  faAlignRight,
  faPeopleGroup,
  faUserPlus,
  faTrash,
  faCloudArrowUp,
  faMessage,
  faMapLocation,
  faLocationDot,
  faCommentDots,
  faCaretDown,
  faCopy,
  faArrowRightFromBracket,
  faUser,
  faLock,
  faExclamationCircle,
  faMapMarkedAlt,
  faComments,
  faSun,
  faMoon,
  faBookmark,
} from '@fortawesome/free-solid-svg-icons'

const debugParams = new URLSearchParams(window.location.search)
const debugValue = debugParams.get('debug')

if (debugValue === '0' || debugValue === 'false') {
  localStorage.removeItem('mobileDebug')
}

if (
  debugParams.has('debug') ||
  window.location.hash.includes('debug') ||
  localStorage.getItem('mobileDebug') === 'true'
) {
  localStorage.setItem('mobileDebug', 'true')
  eruda.init()
}

library.add(
  fab,
  faCheckSquare,
  faCoffee,
  faHomeLgAlt,
  faUserFriends,
  faSuitcase,
  faSearch,
  faComment,
  faBell,
  faSortDown,
  faTh,
  faPlus,
  faImage,
  faVideo,
  faCalendarDays,
  faNewspaper,
  faEllipsis,
  faThumbsUp,
  faShare,
  faPaperPlane,
  faFaceSmile,
  faCompass,
  faUserGroup,
  faX,
  faAlignRight,
  faPeopleGroup,
  faUserPlus,
  faTrash,
  faCloudArrowUp,
  faMessage,
  faMapLocation,
  faLocationDot,
  faCommentDots,
  faCaretDown,
  faCopy,
  faArrowRightFromBracket,
  faUser,
  faLock,
  faExclamationCircle,
  faMapMarkedAlt,
  faComments,
  faSun,
  faMoon,
  faBookmark
)

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <App />
  </Provider>
  // </React.StrictMode>
)

