# 🎬 CineCritic — Frontend

> Movie discovery and tracking web application. Built with React, Redux Toolkit, and Material UI.

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat&logo=react)](https://reactjs.org)
[![Redux](https://img.shields.io/badge/Redux_Toolkit-2.x-764ABC?style=flat&logo=redux)](https://redux-toolkit.js.org)
[![MUI](https://img.shields.io/badge/MUI-7.x-007FFF?style=flat&logo=mui)](https://mui.com)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=flat&logo=vercel)](https://vercel.com)

**Live App:** `https://movie-watcher-gules.vercel.app`

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Pages](#pages)
- [State Management](#state-management)
- [Deployment](#deployment)

---

## ✨ Features

- 🎬 Browse popular and top-rated movies and TV series
- 🔍 Search across movies, TV series, and people
- 🔐 Full authentication — signup, signin, email verification, password reset
- ❤️ Save and manage favorites
- 📋 Watchlist with watched/unwatched toggle and filter
- 🕐 Recently viewed history (auto-tracked)
- ⭐ Post and manage reviews with like/dislike voting
- 🖼️ Avatar upload and profile management
- 🌙 Dark and light theme toggle
- 📱 Fully responsive design

---

## 🛠️ Tech Stack

| Package | Version | Purpose |
|---|---|---|
| React | 18.x | UI framework |
| Redux Toolkit | 2.x | State management |
| React Router DOM | 7.x | Client-side routing |
| Material UI (MUI) | 7.x | UI component library |
| Axios | 1.x | HTTP client |
| Formik | 2.x | Form management |
| Yup | 1.x | Form validation |
| Swiper | 11.x | Carousels and sliders |
| React Toastify | 10.x | Toast notifications |
| Day.js | 1.x | Date formatting |
| Query String | 8.x | URL parameter serialization |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Backend API running (see [server README](../server/README.md))

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/movie-watcher-client.git
cd movie-watcher-client

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Fill in your API URL

# Start development server
npm start
```

App runs on `http://localhost:3000`

---

## 🔑 Environment Variables

Create a `.env` file in the root of the client folder:

```env
# Backend API base URL
REACT_APP_API_URL=http://localhost:5000/api/v1

# Set to false to prevent ESLint warnings from failing build
CI=false
```

### For production (Vercel):
```env
REACT_APP_API_URL=https://movie-watcher-production.up.railway.app/api/v1
CI=false
```

---

## 📁 Project Structure

```
client/src/
├── api/
│   ├── client/
│   │   ├── private.client.js       # Axios instance with auth token
│   │   └── public.client.js        # Axios instance without auth
│   ├── configs/
│   │   └── tmdb.configs.js         # TMDB image URL helpers
│   └── modules/
│       ├── user.api.js             # Auth, profile endpoints
│       ├── media.api.js            # TMDB media endpoints
│       ├── favorite.api.js         # Favorites endpoints
│       ├── watchlist.api.js        # Watchlist endpoints
│       ├── recentlyViewed.api.js   # Recently viewed endpoints
│       ├── review.api.js           # Reviews endpoints
│       ├── reviewVote.api.js       # Review votes endpoints
│       ├── avatar.api.js           # Avatar upload endpoints
│       ├── genre.api.js            # Genre endpoints
│       └── person.api.js           # Person/actor endpoints
│
├── components/
│   ├── common/
│   │   ├── AuthModal.jsx           # Signin/signup modal
│   │   ├── AutoSwiper.jsx          # Auto-width Swiper wrapper
│   │   ├── BackdropSlide.jsx       # Movie backdrop slider
│   │   ├── CastSlide.jsx           # Cast member slider
│   │   ├── CircularRate.jsx        # Circular rating indicator
│   │   ├── Container.jsx           # Section wrapper with heading
│   │   ├── Footer.jsx              # App footer
│   │   ├── GlobalLoading.jsx       # Full-screen loading overlay
│   │   ├── HeroSlide.jsx           # Auto-rotating hero banner
│   │   ├── ImageHeader.jsx         # Page backdrop header
│   │   ├── Logo.jsx                # App logo
│   │   ├── MediaGrid.jsx           # Responsive media card grid
│   │   ├── MediaItem.jsx           # Individual media card
│   │   ├── MediaReview.jsx         # Reviews section component
│   │   ├── MediaSlide.jsx          # Horizontal media carousel
│   │   ├── MediaVideosSlide.jsx    # YouTube video slider
│   │   ├── NavigationSwiper.jsx    # Swiper with prev/next arrows
│   │   ├── PageWrapper.jsx         # Page scroll reset + state
│   │   ├── PersonMediaGrid.jsx     # Person filmography grid
│   │   ├── PosterSlide.jsx         # Movie poster slider
│   │   ├── ProtectedPage.jsx       # Auth guard HOC
│   │   ├── RecommendSlide.jsx      # Recommendations carousel
│   │   ├── SigninForm.jsx          # Sign in form
│   │   ├── SignupForm.jsx          # Sign up form
│   │   ├── TextAvatar.jsx          # Color avatar from name
│   │   └── UserMenu.jsx            # User dropdown menu
│   └── layout/
│       ├── MainLayout.jsx          # Root layout with Topbar/Footer
│       ├── Sidebar.jsx             # Mobile navigation drawer
│       └── Topbar.jsx              # Top navigation bar
│
├── configs/
│   ├── theme.config.js             # MUI theme (dark/light)
│   ├── ui.configs.js               # Reusable style objects
│   └── menu.configs.js             # Navigation menu items
│
├── hooks/
│   └── usePrevious.jsx             # Get previous value of state
│
├── pages/
│   ├── HomePage.jsx                # Home with hero + carousels
│   ├── MediaList.jsx               # Movies or TV series list
│   ├── MediaDetail.jsx             # Full media detail page
│   ├── MediaSearch.jsx             # Search page
│   ├── PersonDetail.jsx            # Actor/person detail
│   ├── FavoriteList.jsx            # User favorites
│   ├── WatchlistPage.jsx           # User watchlist
│   ├── RecentlyViewedPage.jsx      # Recently viewed history
│   ├── ReviewList.jsx              # User reviews
│   ├── UserProfilePage.jsx         # Profile + avatar
│   ├── PasswordUpdate.jsx          # Change password
│   ├── VerifyEmailPage.jsx         # Email verification handler
│   ├── ForgotPasswordPage.jsx      # Request password reset
│   └── ResetPasswordPage.jsx       # Set new password
│
├── redux/
│   ├── store.js                    # Redux store
│   └── features/
│       ├── userSlice.js            # User + favorites + watchlist
│       ├── authModalSlice.js       # Auth modal open/close
│       ├── globalLoadingSlice.js   # Global loading state
│       ├── themeModeSlice.js       # Dark/light theme
│       └── appStateSlice.js        # Active nav item
│
├── routes/
│   └── routes.jsx                  # Route definitions + routesGen
│
└── utils/
    ├── favorite.utils.js           # Check if media is favorited
    └── watchlist.utils.js          # Check if media is in watchlist
```

---

## 📄 Pages

| Page | Route | Protected | Description |
|---|---|---|---|
| HomePage | `/` | No | Hero slide + 4 media carousels |
| MediaList | `/:mediaType` | No | Browse movies or TV series |
| MediaDetail | `/:mediaType/:mediaId` | No | Full detail + cast + videos |
| MediaSearch | `/search` | No | Search movies, TV, people |
| PersonDetail | `/person/:personId` | No | Actor detail + filmography |
| FavoriteList | `/favorites` | ✅ | Saved favorites |
| WatchlistPage | `/watchlist` | ✅ | Watchlist with filter |
| RecentlyViewedPage | `/recently-viewed` | ✅ | Auto-tracked history |
| ReviewList | `/reviews` | ✅ | Posted reviews |
| UserProfilePage | `/profile` | ✅ | Profile + avatar upload |
| PasswordUpdate | `/password-update` | ✅ | Change password |
| VerifyEmailPage | `/verify-email` | No | Handles email token |
| ForgotPasswordPage | `/forgot-password` | No | Request reset link |
| ResetPasswordPage | `/reset-password` | No | Set new password |

---

## 🗃️ State Management

Redux Toolkit with 5 slices:

### `userSlice`
```javascript
{
  user: null,              // Current user object (null if logged out)
  listFavorites: [],       // User's favorites array
  listWatchlist: [],       // User's watchlist array
  recentlyViewed: []       // Recently viewed history
}
```
Key actions: `setUser`, `addFavorite`, `removeFavorite`, `addToWatchlist`, `removeFromWatchlist`, `toggleWatchlistItem`, `addRecentlyViewed`, `clearRecentlyViewed`

### `authModalSlice`
Controls the signin/signup modal visibility. Dispatch `setAuthModalOpen(true)` to open it from anywhere.

### `globalLoadingSlice`
Controls the full-screen loading overlay. Used in all pages before/after API calls.

### `themeModeSlice`
Stores `"dark"` or `"light"`. Passed to MUI `ThemeProvider`.

### `appStateSlice`
Tracks the current active page state string for navbar highlighting.

---

## 🔌 API Integration Pattern

Two Axios clients handle all requests:

```javascript
// private.client.js — attaches Bearer token automatically
import privateClient from "../api/client/private.client";

// public.client.js — no auth header
import publicClient from "../api/client/public.client";
```

All API functions return `{ response, err }`:
```javascript
const { response, err } = await mediaApi.getDetail({ mediaType, mediaId });

if (response) {
  setMedia(response);
}
if (err) {
  toast.error(err.message);
}
```

---

## 📜 Scripts

```bash
npm start         # Start development server on localhost:3000
npm run build     # Build for production
npm test          # Run tests
```

---

## ▲ Deployment (Vercel)

1. Push to GitHub
2. Import repo on [vercel.com](https://vercel.com)
3. Add environment variables:
   ```
   REACT_APP_API_URL = https://your-backend.railway.app/api/v1
   CI = false
   ```
4. Vercel auto-detects Create React App and builds
5. Auto-deploys on every push to main

---

## 🔗 Related

- [Backend Repository](https://github.com/yourusername/movie-watcher-server)
- [Live Application](https://movie-watcher-gules.vercel.app)
- [TMDB API](https://www.themoviedb.org/documentation/api)

---

*Built by Hasan Sayeed — 2025*