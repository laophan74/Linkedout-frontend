# LinkedOut Project Context

Last updated: 2026-06-17

## Workspace

The project lives locally at:

`C:\Users\admin\OneDrive\Máy tính\project\LinkedOut`

This repository is the React frontend. The backend is a separate repository in:

`..\social-media-backend`

The parent `LinkedOut` folder is only a local container and is not currently a Git repo.

## Deployment

The app is deployed on Vercel.

Important constraint: do not depend on realtime/socket features for free Vercel deployment. Messaging and notifications should work through normal REST requests, refreshes, navigation, or manual reloads. No Socket.IO server is required.

Frontend API base URL is controlled by:

`REACT_APP_API_BASE_URL`

If it is not set, production currently falls back to:

`https://linkedout-backend1.vercel.app/api/`

## Current Frontend Architecture

- React 18 with Create React App
- React Router v5 using `HashRouter`
- Redux + redux-thunk
- REST API access through `src/services/httpService.js`
- Socket service exists as a no-op mock in `src/services/socket.service.js`

## Recent Completion Work

- Removed manual notification creation from like/comment/message flows to avoid duplicate activities.
- Notification unread state now uses backend `activity.isRead`.
- Notification page calls the backend read-all endpoint when leaving the page.
- Notification preview now supports populated user objects and activity types:
  - `like`
  - `comment`
  - `connection`
  - `message`
- Notification links now navigate to absolute `/main/...` routes.

## Messaging And Notifications Policy

Do not add realtime dependencies.

Expected behavior:

- Messages are sent through `/api/chat/:id/message`.
- Message list is loaded through REST.
- Notifications are loaded through `/api/activity`.
- Unread counts are based on stored `Activity.isRead`.
- It is acceptable for notification/message state to update on page navigation or manual refresh.

## Verification

Frontend production build passed:

`npm run build`

## Recommended Next Steps

- Set `REACT_APP_API_BASE_URL` explicitly in Vercel frontend settings to avoid relying on fallback URLs.
- Add a backend endpoint to mark only message activities as read, instead of only read-all.
- Consider adding pagination metadata support in frontend services if infinite scrolling is needed later.
