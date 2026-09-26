# Portfolio Template Setup Guide

This guide will help you set up and deploy your own portfolio website using this template.

---

## 🚀 Quick Start

### 1. Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Add project"** and enter a project name (e.g., `my-portfolio`), then continue.
3. **Disable Google Analytics** (optional) and create the project.

### 2. Add a Web App
1. In your Firebase project, click the **`</>`** (Web) icon to add a new web app.
2. Enter an app name (e.g., `portfolio`).
3. **Do not enable Firebase Hosting** unless you want it.
4. Copy the `firebaseConfig` object — you will use these values as environment variables.

### 3. Enable Authentication
1. In the left sidebar, go to **Authentication** and click **Get started**.
2. Under the **Sign-in method** tab, enable **Google** sign-in and save.
3. In "Authorized domains", add your deployment domain (e.g., `yourapp.vercel.app`).

### 4. Set Up Firestore Database
1. In the sidebar, go to **Firestore Database** and create a new database.
2. Choose **Production mode**, select a region, and enable.
3. Once created, open the **Rules** tab and paste in the content from `firestore.rules` (make sure to set the admin email to your own in the rules).
4. Click **Publish** to save.

### 5. Configure Environment Variables
1. Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Fill in `.env` with your Firebase config values:

   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

### 6. Run Locally

```bash
npm install
npm run dev
# Open http://localhost:3000 in your browser
```

---

## 🔐 Admin Panel

- Access the admin panel at the `/admin` route on your deployed site.
- Sign in with Google using the email you configured as your admin email in Firestore rules.
- Use the admin panel to manage your profile, projects, skills, experience, and more.

---

## 🖼 Adding Project Images

- To add a project image, use a raw GitHub image URL:

  ```
  https://raw.githubusercontent.com/USERNAME/REPO/main/screenshot.png
  ```
- Or use any public image source (Unsplash, Imgur, etc.).

---

## 🚢 Deployment (Vercel recommended)

1. Push your code to a repository on GitHub.
2. Go to [Vercel](https://vercel.com), click **New Project**, and import your GitHub repo.
3. In **Environment Variables**, add all your `VITE_*` variables from `.env`.
4. Deploy!
5. After deployment, add your Vercel domain to Firebase → Authentication → Authorized domains.

---

## 📁 Project Structure

```
src/
  App.tsx           — Main components (Home, Admin, Navbar, etc.)
  index.css         — Tailwind and custom styles
  main.tsx          — React entry point
  services/
    firebase.ts     — Firebase init (uses .env)
public/
  profile.png       — Default profile image
.env.example        — Example env (copy to .env)
firestore.rules     — Firestore security rules
SETUP.md           — This file
```

---

## 🎨 Customization

- All content can be managed from the Admin panel when Firebase is connected.
- To change colors or fonts, edit `src/index.css` in the `@theme {}` block.

---

**Happy deploying! Feel free to customize anything to make your portfolio unique!**
