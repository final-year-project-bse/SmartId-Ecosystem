# 🚀 Starting SmartID Frontend

## Current Status: Installing Dependencies

The project is currently installing all required packages. This may take 2-5 minutes.

## What's Being Installed:

### Core Dependencies:
- ✓ react & react-dom (UI library)
- ✓ react-router-dom (routing)
- ✓ zustand (state management)

### UI & Styling:
- ✓ tailwindcss (CSS framework)
- ✓ postcss & autoprefixer (CSS processing)
- ✓ lucide-react (icons)

### Features:
- ✓ recharts (data visualization)
- ✓ i18next & react-i18next (internationalization)
- ✓ react-webcam (camera access)
- ✓ date-fns (date formatting)

## After Installation Completes:

### Start the Development Server:
```bash
cd smartid-frontend
npm run dev
```

### Then Open Browser:
Visit: **http://localhost:5173**

## What You'll See:

1. **Dashboard** - Overview with stats and charts
2. **Enroll** - Webcam capture for user enrollment
3. **Authenticate** - Face recognition authentication
4. **Sessions** - Manage class sessions
5. **Today** - Today's attendance
6. **Reports** - Attendance reports with filters
7. **Notifications** - System notifications
8. **Settings** - Theme, language, profile

## Features to Test:

### Theme Toggle
- Click the moon/sun icon in the topbar
- Watch the app switch between light and dark modes

### Language Switch
- Click the globe icon in the topbar
- Toggle between English and Urdu

### Webcam Features
- Go to Enroll or Authenticate pages
- Allow camera access when prompted
- Capture photos for enrollment/authentication

### Role Testing
- Edit `src/store/useAppStore.js`
- Change `role: 'ADMIN'` to `'PROFESSOR'` or `'STUDENT'`
- See different views and permissions

## Troubleshooting:

### If installation fails:
```bash
# Delete node_modules and try again
rmdir /s /q node_modules
del package-lock.json
npm install
```

### If port 5173 is in use:
```bash
# The dev server will automatically use the next available port
# Or specify a different port:
npm run dev -- --port 3000
```

## 📚 Documentation:

- **README_PROJECT.md** - Full project documentation
- **QUICKSTART.md** - Quick start guide
- **PROJECT_SUMMARY.md** - File structure and overview

---

**Note:** Installation is currently in progress. Please wait for it to complete before running `npm run dev`.
