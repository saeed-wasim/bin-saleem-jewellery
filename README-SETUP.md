# 🚀 Bin Saleem Jewellery - Complete Setup

## What You Have

✅ Express backend with Google OAuth  
✅ MongoDB database with Prisma  
✅ Nuxt frontend with Google Sign-In  
✅ Profile storage and display  

---

## ⚡ 3-Step Setup

### **Step 1: Run Setup Script** (1 minute)

```bash
npm run setup-oauth
```

This will guide you to get your Google Client ID from Google Cloud Console.

### **Step 2: Start Backend** (Terminal 1)

```bash
npm run server
```

You should see:
```
✅ Server running on http://localhost:3001
```

### **Step 3: Start Frontend** (Terminal 2)

```bash
npm run dev
```

You should see:
```
➜ Local: http://localhost:3000
```

---

## 🎯 How It Works

1. Open `http://localhost:3000`
2. Click "Sign in with Google"
3. Google popup opens → authenticate
4. Profile saved to MongoDB ✅
5. You see your name, email, and avatar
6. Click "Sign Out" to logout

---

## 🔧 If Something Goes Wrong

**"Google Sign-In not loaded"**
- Make sure your Client ID is set: `npm run validate`
- Check browser console (F12) for errors
- Make sure MongoDB is running

**"Invalid Client ID"**
- Run `npm run setup-oauth` again
- Double-check you copied the full Client ID from Google Cloud Console
- The ID should be ~100 characters long with dots and hyphens

**"API connection failed"**
- Make sure backend is running: `npm run server`
- Check it's on port 3001: `http://localhost:3001/api/health`
- Verify `.env` has `API_BASE_URL="http://localhost:3001"`

**MongoDB connection error**
- Install Docker: https://www.docker.com/products/docker-desktop
- Start MongoDB: `docker compose up -d`

---

## 📁 File Structure

```
server/index.js              ← Backend API with Google OAuth
prisma/schema.prisma         ← Database User model
app/pages/index.vue          ← Login & Profile page
.env                         ← Configuration (add Client ID here)
```

---

## 📚 Commands

```bash
npm run server          # Start backend
npm run dev             # Start frontend
npm run setup-oauth     # Configure Google Client ID
npm run validate        # Check setup
npm run prisma:push     # Create database schema
```

---

## ✨ What Gets Stored in Database

When you login with Google:

```javascript
{
  id: "unique-id",
  googleId: "google-unique-id",
  email: "your@gmail.com",
  name: "Your Name",
  picture: "https://...",
  createdAt: "2024-06-30T...",
  updatedAt: "2024-06-30T..."
}
```

Every time you login with the same Google account, the record updates automatically.

---

## 🎉 You're Ready!

Run the setup script now:
```bash
npm run setup-oauth
```

Then follow the prompts. Takes 2 minutes!
