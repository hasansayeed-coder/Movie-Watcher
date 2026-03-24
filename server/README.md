# 🎬 CineCritic — Backend API

> RESTful API for the CineCritic movie discovery and tracking application. Built with Node.js, Express, and MongoDB.

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat&logo=express)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat&logo=mongodb)](https://mongodb.com)
[![Railway](https://img.shields.io/badge/Deployed-Railway-0B0D0E?style=flat&logo=railway)](https://railway.app)

**Live API:** `https://movie-watcher-production.up.railway.app/api/v1`

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Project Structure](#project-structure)
- [Security](#security)

---

## ✨ Features

- 🔐 JWT authentication with email verification
- 🔑 Forgot password / reset password via email
- 🎬 TMDB API integration for movies and TV series
- ❤️ Favorites management
- 📋 Watchlist with watched/unwatched tracking
- ⭐ Review system with like/dislike voting
- 🕐 Recently viewed history (max 10 per user)
- 🖼️ Avatar upload via Cloudinary
- 🛡️ Rate limiting, Helmet.js, CORS security
- 📄 Paginated responses

---

## 🛠️ Tech Stack

| Package | Version | Purpose |
|---|---|---|
| Node.js | 18+ | Runtime |
| Express | 4.x | Web framework |
| MongoDB Atlas | — | Database |
| Mongoose | 7.x | ODM |
| JSON Web Token | 9.x | Authentication |
| Bcryptjs | 5.x | Password hashing |
| Nodemailer | 6.x | Email sending |
| Multer | 1.x | File upload |
| Cloudinary | 1.x | Image storage |
| Helmet | 7.x | HTTP security headers |
| Express Rate Limit | 7.x | Rate limiting |
| CORS | 2.x | Cross-origin requests |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- TMDB API key ([get one here](https://www.themoviedb.org/settings/api))
- Cloudinary account
- Mailtrap account (for email testing)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/movie-watcher-server.git
cd movie-watcher-server

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Fill in your values in .env

# Start development server
npm run dev

# Start production server
npm start
```

Server runs on `http://localhost:5000`

---

## 🔑 Environment Variables

Create a `.env` file in the root of the server folder:

```env
PORT=5000
MONGODB_URL=mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>
TOKEN_SECRET=your_strong_jwt_secret_key

# Frontend URL (no trailing slash)
CLIENT_URL=http://localhost:3000

# TMDB
TMDB_BASE_URL=https://api.themoviedb.org/3/
TMDB_KEY=your_tmdb_api_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Mailtrap (email testing)
MAILTRAP_USER=your_mailtrap_user
MAILTRAP_PASS=your_mailtrap_pass
MAIL_FROM=noreply@moviewatcher.com
```

---

## 📡 API Reference

Base URL: `/api/v1`

### 👤 Auth & User

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/user/signup` | No | Register new account |
| GET | `/user/verify-email?token=` | No | Verify email address |
| POST | `/user/signin` | No | Sign in, returns JWT |
| POST | `/user/signout` | ✅ | Sign out, blacklist token |
| GET | `/user/info` | ✅ | Get current user info |
| PUT | `/user/update-password` | ✅ | Update password |
| POST | `/user/forgot-password` | No | Request password reset email |
| POST | `/user/reset-password` | No | Reset password with token |
| POST | `/user/resend-verification` | ✅ | Resend verification email |
| POST | `/user/avatar` | ✅ | Upload avatar (multipart/form-data) |
| DELETE | `/user/avatar` | ✅ | Remove avatar |

### 🎬 Media (TMDB)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/:mediaType/genres` | No | Get genre list |
| GET | `/:mediaType/:category?page=` | No | Get media list (popular/top_rated) |
| GET | `/:mediaType/search?query=&page=` | No | Search media |
| GET | `/:mediaType/detail/:mediaId` | Optional | Get full media detail |

> `mediaType` is either `movie` or `tv`

### ❤️ Favorites

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/user/favorites?page=&pageSize=` | ✅ | Get favorites (paginated) |
| POST | `/user/favorites` | ✅ | Add to favorites |
| DELETE | `/user/favorites/:id` | ✅ | Remove from favorites |

### 📋 Watchlist

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/watchlist?page=&pageSize=&watched=` | ✅ | Get watchlist |
| POST | `/watchlist` | ✅ | Add to watchlist |
| PATCH | `/watchlist/:id/watched` | ✅ | Toggle watched status |
| DELETE | `/watchlist/:id` | ✅ | Remove from watchlist |

### ⭐ Reviews & Votes

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/reviews?page=&pageSize=` | ✅ | Get user reviews |
| POST | `/reviews` | ✅ | Post a review |
| DELETE | `/reviews/:reviewId` | ✅ | Delete a review |
| GET | `/reviews/:reviewId/votes` | ✅ | Get votes for a review |
| POST | `/reviews/:reviewId/votes` | ✅ | Vote on a review |

### 🕐 Recently Viewed

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/recently-viewed` | ✅ | Get recently viewed list |
| POST | `/recently-viewed` | ✅ | Add to recently viewed |
| DELETE | `/recently-viewed/clear` | ✅ | Clear all history |
| DELETE | `/recently-viewed/:mediaId` | ✅ | Remove one item |

### 🎭 Person

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/person/:personId` | No | Get person/actor details |
| GET | `/person/:personId/medias` | No | Get person's filmography |

---

## 📁 Project Structure

```
server/
├── index.js                        # Entry point, Express app setup
├── package.json
├── .env
└── src/
    ├── routes/
    │   ├── index.js                # Central router (order matters!)
    │   ├── user.route.js
    │   ├── media.route.js
    │   ├── review.route.js
    │   ├── favorite.route.js
    │   ├── watchlist.route.js
    │   ├── recentlyViewed.route.js
    │   ├── person.route.js
    │   ├── avatar.route.js
    │   └── reviewVote.route.js
    ├── controllers/
    │   ├── user.controller.js
    │   ├── media.controller.js
    │   ├── review.controller.js
    │   ├── favorite.controller.js
    │   ├── watchlist.controller.js
    │   ├── recentlyViewed.controller.js
    │   ├── person.controller.js
    │   ├── avatar.controller.js
    │   └── reviewVote.controller.js
    ├── models/
    │   ├── user.model.js
    │   ├── favorite.model.js
    │   ├── watchlist.model.js
    │   ├── review.model.js
    │   ├── reviewVote.model.js
    │   └── recentlyViewed.model.js
    ├── middlewares/
    │   ├── token.middleware.js
    │   ├── rateLimiter.middleware.js
    │   └── upload.middleware.js
    ├── tmdb/
    │   ├── tmdb.api.js
    │   ├── tmdb.client.js
    │   └── tmdb.endpoints.js
    ├── config/
    │   ├── cloudinary.config.js
    │   └── mailtrap.config.js
    ├── handlers/
    │   ├── response.handler.js
    │   └── request.handler.js
    └── utils/
        ├── tokenBlacklist.js
        ├── paginate.js
        └── sendEmail.js
```

---

## 🔒 Security

- **Helmet.js** — sets secure HTTP headers including CSP for TMDB image domains
- **CORS** — restricted to `CLIENT_URL` environment variable only
- **JWT** — tokens are blacklisted on signout (in-memory Set with auto-cleanup)
- **Bcrypt** — passwords hashed with salt rounds before storage
- **Rate Limiting** — signin: 10/15min, signup: 20/hr, general API: 200/15min
- **Email Verification** — accounts require email verification before signin
- **Input Validation** — all request bodies validated before processing

---

## 📜 Scripts

```bash
npm start       # Production server (node index.js)
npm run dev     # Development server with nodemon
```

---

## 🚂 Deployment (Railway)

1. Push to GitHub
2. Create new project on [railway.app](https://railway.app) from GitHub repo
3. Add all environment variables in the **Variables** tab
4. Set `PORT=5000` in Networking settings
5. Railway auto-deploys on every push to main

---

*Built by Hasan Sayeed — 2025*