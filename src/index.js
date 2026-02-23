import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
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
} from '@fortawesome/free-solid-svg-icons'

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
  faComments
)

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <App />
  </Provider>
  // </React.StrictMode>
)

