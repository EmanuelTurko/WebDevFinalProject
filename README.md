# Recipegram 🍳📷

Recipegram is a full-stack web app that lets users share, like, and comment on cooking posts — just like Instagram, but for food lovers. It supports Google login, JWT-based authentication, and features a "Recipe of the Day" powered by Gemini AI.

---

## 🔧 Tech Stack

**Frontend:**
- React
- Axios
- Vite

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- Google OAuth
- Gemini AI API (for recipe generation)

---

## ✨ Features

- 📷 Create, like, and comment on posts
- 🍳 Recipe of the Day generated from Gemini AI
- 🔐 Google Sign-In & JWT-based auth
- 🧾 RESTful API backend with MongoDB
- 🧪 Local `.env` configuration for both frontend and backend

---

## 📦 Project Structure
```bash
recipegram/
├── front/    # React frontend
└── back/     # Node.js/Express backend
```
---

## 🚀 Getting Started

> Clone the project and install dependencies for both frontend and backend.

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/recipegram.git
cd recipegram
```
### 2. Backend Setup
```bash
cd back
npm install
npm start

Backend Environment Variables (back/.env_dev)

Create a .env_dev file inside /back with the following values:

NODE_ENV=development
PORT=3000
HTTP=http://
DOMAIN_BASE=localhost
DB_CONNECT=mongodb://localhost:27017/recipegram
TOKEN_EXP=your_jwt_secret
REFRESH_TOKEN_EXP=your_refresh_token_secret
AI_API_KEY=your_gemini_api_key
GOOGLE_CLIENT_ID=your_google_client_id
```
### 3. Frontend Setup
```bash
cd front
npm install
npm run dev
