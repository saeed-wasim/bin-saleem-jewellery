# Bin Saleem Jewellery - Setup Guide

## Prerequisites

- Node.js (v18+)
- MongoDB (local or Docker)
- Google Cloud Project

## Step 1: Set Up MongoDB

### Option A: Using Docker (Recommended)

```bash
docker compose up -d
```

### Option B: Local MongoDB

If you have MongoDB installed locally, ensure it's running on `localhost:27017`.

## Step 2: Set Up Google OAuth

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a Project" → "New Project"
3. Name it "Bin Saleem Jewellery" and click "Create"
4. Wait for the project to be created

### 2. Enable Google+ API

1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on it and press "Enable"

### 3. Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted, configure the OAuth consent screen first:
   - Choose "External"
   - Fill in the app name: "Bin Saleem Jewellery"
   - Add your email as a test user
   - Save and continue
4. For application type, select "Web application"
5. Add authorized redirect URIs:
   - `http://localhost:3000/`
   - `http://localhost:3001/`
6. Click "Create"
7. Copy the **Client ID** and **Client Secret**

### 4. Update Your .env File

Edit `c:\Projects\bin-saleem-jewellery\.env` and replace the placeholder values:

```env
DATABASE_URL="mongodb://127.0.0.1:27017/bin-saleem-jewellery"
GOOGLE_CLIENT_ID="your-copied-client-id"
GOOGLE_CLIENT_SECRET="your-copied-client-secret"
GOOGLE_REDIRECT_URI="http://localhost:3000/"
API_BASE_URL="http://localhost:3001"
FRONTEND_URL="http://localhost:3000"
PORT=3000
BACKEND_PORT=3001
```

## Step 3: Initialize the Database

```bash
npm run prisma:push
```

## Step 4: Start the Application

### Terminal 1 - Backend API

```bash
npm run server
```

Server will run on `http://localhost:3001`

### Terminal 2 - Frontend

```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## Step 5: Test Google Login

1. Open `http://localhost:3000` in your browser
2. Click "Continue with Google"
3. Sign in with your Google account
4. You should be redirected back and see your user info

## Troubleshooting

### "invalid_client" Error

- ✅ Verify your `GOOGLE_CLIENT_ID` in `.env` is correct (copy-paste from Google Cloud Console)
- ✅ Ensure redirect URIs in Google Cloud Console match your app URLs
- ✅ Check that the Google+ API is enabled in your project

### MongoDB Connection Error

- ✅ Ensure MongoDB is running: `docker compose up -d`
- ✅ Or check if local MongoDB is listening on port 27017

### "Server refused the connection" Error

- ✅ Ensure the backend server is running: `npm run server`
- ✅ Check that port 3001 is not in use by another process

## Project Structure

```
server/
  └── index.js                 # Express backend with Google OAuth endpoint
prisma/
  └── schema.prisma            # MongoDB schema (User model)
app/pages/
  └── index.vue               # Login page with Google button
.env                          # Configuration (add your Google credentials here)
docker-compose.yml            # MongoDB container setup
```

## API Endpoints

- `POST /api/auth/google` - Exchange Google auth code for user data
- `GET /api/health` - Server health check
