# Portfolio Setup Guide

## 🚀 Quick Start

### 1. Create Firebase Project

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add project"** → enter a name (e.g. `gulfamali-portfolio`) → Continue
3. Disable Google Analytics (optional) → **Create project**

### 2. Add a Web App

1. In your new project, click the **`</>`** (Web) icon
2. Register app name: `portfolio`
3. **Don't** check "Firebase Hosting" unless you want it
4. Copy the `firebaseConfig` object — you'll need these values

### 3. Enable Authentication

1. Left sidebar → **Authentication** → **Get started**
2. **Sign-in method** tab → **Google** → Enable → Save
3. Under "Authorized domains", add your deployment domain (e.g. `yourapp.vercel.app`)

### 4. Create Firestore Database

1. Left sidebar → **Firestore Database** → **Create database**
2. Choose **Production mode** → select a region → Enable
3. After creation, go to **Rules** tab and paste the contents of `firestore.rules`
4. Click **Publish**

### 5. Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env
```

Fill in `.env` with your Firebase config values:

```
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123:web:abc
```

### 6. Run Locally

```bash
npm install
npm run dev
# → Open http://localhost:3000
```

---

## 🔐 Admin Panel

- Visit `/admin` on your site
- Sign in with **Google** using the admin email (`gulfamoffi62@gmail.com`)
- Manage: Projects, Experience, Skills, Profile, Inbox

### GitHub Image Links for Projects

When adding a project image, use a raw GitHub URL:
```
https://raw.githubusercontent.com/USERNAME/REPO/main/screenshot.png
```
Or use any public image URL (Unsplash, Imgur, etc.)

---

## 🚢 Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. In **Environment Variables**, add all `VITE_*` vars from your `.env`
4. Deploy!
5. After deploy, add your Vercel URL to Firebase → Authentication → Authorized domains

---

## 📁 Project Structure

```
src/
  App.tsx          — All components (Home, Admin, Navbar, etc.)
  index.css        — Tailwind + custom styles
  main.tsx         — React entry point
  services/
    firebase.ts    — Firebase init (uses .env)
public/
  profile.png      — Default profile image
.env.example       — Copy to .env and fill credentials
firestore.rules    — Firestore security rules
SETUP.md           — This file
```

---

## 🎨 Customization

All content is editable from the Admin panel once Firebase is connected.

To change colors/fonts, edit `src/index.css` under `@theme {}`.
