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
const isMobileDebugDisabled = debugValue === '0' || debugValue === 'false'
const shouldResetSession = debugParams.has('reset')
const isMobileDebugEnabled =
  !isMobileDebugDisabled &&
  (debugParams.has('debug') ||
    window.location.hash.includes('debug') ||
    localStorage.getItem('mobileDebug') === 'true')

const showMobileDebugger = () => {
  eruda.init()
  eruda.show()

  const existingButton = document.getElementById('mobile-debug-button')
  if (existingButton) return

  const debugButton = document.createElement('button')
  debugButton.id = 'mobile-debug-button'
  debugButton.type = 'button'
  debugButton.textContent = 'Debug'
  debugButton.style.cssText = [
    'position:fixed',
    'right:12px',
    'bottom:72px',
    'z-index:2147483647',
    'display:block',
    'min-width:72px',
    'height:40px',
    'padding:0 12px',
    'border:0',
    'border-radius:20px',
    'background:#111827',
    'color:#fff',
    'font:600 14px/40px system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',
    'box-shadow:0 8px 24px rgba(0,0,0,.28)',
  ].join(';')
  debugButton.addEventListener('click', () => eruda.show())
  document.body.appendChild(debugButton)
}

if (isMobileDebugDisabled) {
  localStorage.removeItem('mobileDebug')
}

if (shouldResetSession) {
  localStorage.removeItem('user')
  localStorage.removeItem('token')
  sessionStorage.removeItem('user')
  sessionStorage.removeItem('token')
}

if (isMobileDebugEnabled) {
  localStorage.setItem('mobileDebug', 'true')
  if (document.body) {
    showMobileDebugger()
  } else {
    window.addEventListener('DOMContentLoaded', showMobileDebugger, { once: true })
  }
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

