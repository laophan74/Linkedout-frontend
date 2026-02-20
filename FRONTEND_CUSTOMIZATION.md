# 🎨 Frontend Customization Guide

Hướng dẫn thay đổi frontend theo ý của bạn.

## 📦 Basic Updates

### 1. package.json - Thông tin project

**File:** [package.json](package.json)

```json
{
  "name": "linkedout-frontend",           // ← Change this
  "version": "1.0.0",                     // Tùy chọn thay đổi
  "description": "LinkedOut - Professional Social Network",  // ← Change
  "author": "Your Name",                  // ← Add your name
  "private": true
  // ...
}
```

### 2. Tên App & Logo

**File:** [public/index.html](public/index.html)
```html
<head>
  <title>LinkedOut</title>  <!-- Change app name -->
  <meta name="description" content="LinkedOut - Professional Social Network">
  <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />  <!-- Change favicon -->
</head>
```

**File:** [public/manifest.json](public/manifest.json)
```json
{
  "short_name": "LinkedOut",
  "name": "LinkedOut - Professional Social Network",
  "description": "Your app description",
  "start_url": ".",
  "scope": ".",
  "display": "standalone",
  // ...
}
```

---

## 🎨 Styling & Branding

### 1. Colors - Global SCSS Variables

**File:** [src/assets/scss/setup/_colors.scss](src/assets/scss/setup/) (hoặc tạo file mới)

```scss
// Primary Colors
$primary-color: #007bff;      // ← Main brand color
$secondary-color: #6c757d;    // ← Secondary color
$success-color: #28a745;
$danger-color: #dc3545;
$warning-color: #ffc107;
$info-color: #17a2b8;

// Neutral Colors
$light: #f8f9fa;
$dark: #212529;
$gray-100: #f8f9fa;
$gray-200: #e9ecef;
// ... etc

// Typography
$font-family-base: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
$font-size-base: 1rem;
$line-height-base: 1.5;
```

### 2. Tailwind Config

**File:** [tailwind.config.js](tailwind.config.js)

```javascript
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#007bff',
        secondary: '#6c757d',
        // Add your colors
      },
      fontFamily: {
        sans: ['Segoe UI', 'Tahoma', 'Geneva'],
        // Add custom fonts
      },
    },
  },
  plugins: [],
}
```

### 3. Global Styles

**File:** [src/index.css](src/index.css)

```css
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --font-family: 'Segoe UI', sans-serif;
  /* Add your CSS variables */
}

body {
  font-family: var(--font-family);
  /* Customize */
}
```

---

## 🏗️ Component Customization

### 1. Logo Component

**File:** [src/cmps/header/Header.jsx](src/cmps/header/Header.jsx)

```jsx
// Update logo/brand name
<div className="header-logo">
  <h1>LinkedOut</h1>  {/* ← Change */}
  {/* hoặc */}
  <img src={logoImage} alt="LinkedOut" />
</div>
```

### 2. Navigation

**File:** [src/cmps/header/Nav.jsx](src/cmps/header/Nav.jsx)

```jsx
// Update nav items
const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Profile', path: '/profile' },
  { name: 'Messages', path: '/messages' },
  // Add/remove items
];
```

### 3. Landing Page

**File:** [src/pages/Home.jsx](src/pages/Home.jsx)

```jsx
// Customize homepage content
<section className="hero">
  <h1>Welcome to LinkedOut</h1>
  <p>Your professional social network</p>
  {/* Customize content */}
</section>
```

---

## 🔗 API Configuration

### Development vs Production

**File:** [src/services/httpService.js](src/services/httpService.js)

```javascript
// Current setup
const BASE_URL =
  process.env.NODE_ENV === 'production' 
    ? '/api/'  // Production (same domain)
    : '//localhost:3030/api/'  // Development

// Nếu backend khác domain:
const BASE_URL = process.env.REACT_APP_API_URL || '//localhost:3030/api/'
```

### Socket.io Configuration

**File:** [src/services/socket.service.js](src/services/socket.service.js)

```javascript
const baseUrl = process.env.NODE_ENV === 'production' 
  ? '' // Production (same domain)
  : '//localhost:3030'  // Development

// Hoặc xài .env:
const baseUrl = process.env.REACT_APP_SOCKET_URL || '//localhost:3030'
```

---

## 📱 Responsive Design

### Tailwind Breakpoints

File: [tailwind.config.js](tailwind.config.js)

```javascript
theme: {
  screens: {
    'sm': '640px',   // Small devices
    'md': '768px',   // Medium
    'lg': '1024px',  // Large
    'xl': '1280px',  // Extra large
    // Add custom breakpoints
  }
}
```

### Mobile First Approach

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* 1 column on mobile, 2 on tablet, 3 on desktop */}
</div>
```

---

## 🎭 Theming (Dark Mode, etc.)

### Tailwind Dark Mode

**File:** [tailwind.config.js](tailwind.config.js)

```javascript
module.exports = {
  darkMode: 'class',  // or 'media'
  theme: {
    extend: {},
  },
}
```

**Usage:**
```jsx
<div className="bg-white dark:bg-slate-900">
  {/* White on light mode, dark on dark mode */}
</div>
```

---

## 🧩 Component Structure

```
src/
├── cmps/                 # Reusable components
│   ├── header/          # Header components
│   ├── profile/         # Profile components
│   ├── posts/           # Post-related components
│   └── ...
├── pages/               # Page components
├── assets/              # Images, styles, icons
├── services/            # API calls, utilities
├── store/               # Redux state management
├── hooks/               # Custom React hooks
└── App.js              # Main app component
```

---

## 🔄 State Management (Redux)

### Redux Structure

**File:** [src/store/index.js](src/store/index.js)

```javascript
// Store configuration
export default createStore(
  combineReducers({
    post: postReducer,
    user: userReducer,
    chat: chatReducer,
    activity: activityReducer,
    // Add new reducers
  }),
  applyMiddleware(thunk)
)
```

### Using Redux

```jsx
import { useDispatch, useSelector } from 'react-redux'

export function MyComponent() {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  
  const handleAction = () => {
    dispatch(myAction(data))
  }
  
  return <div>{/* Use state */}</div>
}
```

---

## 📝 Adding New Pages

1. **Create page component:**
   ```jsx
   // src/pages/MyNewPage.jsx
   export function MyNewPage() {
     return <div>New page content</div>
   }
   ```

2. **Add route:**
   ```jsx
   // src/App.js or pages/Main.jsx
   <Route path="/my-page" component={MyNewPage} />
   ```

3. **Add navigation:**
   ```jsx
   // src/cmps/header/Nav.jsx
   <Link to="/my-page">My Page</Link>
   ```

---

## 🚀 Build & Deploy

### Development Build
```bash
npm start
```

### Production Build
```bash
npm run build
```

### Deploy to Vercel (Recommended)

1. Push to GitHub ✅
2. Visit https://vercel.com
3. Import project
4. Deploy!

---

## 📚 Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Redux Guide](https://redux.js.org)
- [React Router](https://reactrouter.com)

---

**Need help? Check the [SETUP_GUIDE.md](../SETUP_GUIDE.md) for more details!**
