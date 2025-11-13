# 🚀 SmartID Frontend - Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Modern web browser
- Webcam (for enrollment and authentication features)

## Installation & Setup

### 1. Navigate to Project
```bash
cd smartid-frontend
```

### 2. Install Dependencies (if needed)
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Open in Browser
Visit: **http://localhost:5173**

---

## 🎯 First Steps

### 1. Explore the Dashboard
- View summary statistics
- Check attendance chart
- See recent notifications

### 2. Try Theme Toggle
- Click the **moon/sun icon** in the topbar
- Watch the app switch between light and dark modes
- Theme preference is saved automatically

### 3. Switch Language
- Click the **globe icon** in the topbar
- Toggle between English (EN) and Urdu (UR)
- Language preference is saved automatically

### 4. Test Webcam Features

#### Enroll Page
1. Navigate to **Enroll** from sidebar
2. Allow camera access when prompted
3. Click **Capture** to take a photo
4. Fill in user information
5. Check the consent checkbox
6. Click **Submit**

#### Authenticate Page
1. Navigate to **Authenticate** from sidebar
2. Allow camera access
3. Click **Capture** to take a photo
4. Click **Authenticate** button
5. View authentication result

### 5. Manage Sessions (Professor View)
1. Navigate to **Sessions** from sidebar
2. Click **Start Session** on any course
3. Watch status change to "Active"
4. Click **Stop Session** to end

### 6. View Reports
1. Navigate to **Reports** from sidebar
2. Select filters (course, date range)
3. View attendance chart and table
4. Click **Export CSV** to download data

---

## 🔧 Testing Different Roles

To test different user roles:

1. Open `src/store/useAppStore.js`
2. Find the `user` object (around line 4)
3. Change the `role` value:

```javascript
user: {
  id: '1',
  username: 'admin',
  email: 'admin@smartid.edu',
  role: 'ADMIN', // Change to: ADMIN | PROFESSOR | STUDENT
},
```

4. Save the file
5. The app will hot-reload automatically

### Role Differences:
- **ADMIN**: Full access to all features
- **PROFESSOR**: Can manage sessions and view reports
- **STUDENT**: Can view attendance and authenticate

---

## 📱 Mobile Testing

### Desktop Browser
1. Open DevTools (F12)
2. Click device toolbar icon (Ctrl+Shift+M)
3. Select a mobile device
4. Test responsive layout

### Actual Mobile Device
1. Find your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Start dev server with: `npm run dev -- --host`
3. Visit: `http://YOUR_IP:5173` on mobile

---

## 🎨 Customization

### Change Primary Color
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: {
    DEFAULT: '#4f46e5', // Change this hex color
    // ...
  },
}
```

### Add New Translation
Edit `src/i18n/locales/en/common.json` and `ur/common.json`:
```json
{
  "yourKey": "Your Translation"
}
```

Use in components:
```javascript
const { t } = useTranslation();
<p>{t('yourKey')}</p>
```

### Add Mock Data
Edit `src/store/useAppStore.js`:
```javascript
courses: [
  { id: '4', name: 'New Course', code: 'CS401', professor: 'Dr. New' },
  // Add more...
],
```

---

## 🐛 Troubleshooting

### Webcam Not Working
- **Check permissions**: Browser must have camera access
- **HTTPS required**: In production, webcam needs HTTPS
- **Try different browser**: Chrome/Edge work best

### Dark Mode Not Working
- Clear localStorage: `localStorage.clear()` in console
- Refresh the page
- Check system theme settings

### Language Not Switching
- Clear localStorage
- Check browser console for errors
- Verify JSON files are valid

### Port Already in Use
```bash
# Kill process on port 5173
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5173 | xargs kill -9
```

---

## 📚 Learn More

- **React**: https://react.dev
- **Vite**: https://vitejs.dev
- **Tailwind CSS**: https://tailwindcss.com
- **React Router**: https://reactrouter.com
- **Zustand**: https://github.com/pmndrs/zustand
- **Recharts**: https://recharts.org

---

## 🎉 You're Ready!

The SmartID Frontend is now running. Explore all pages, test features, and customize as needed.

For detailed documentation, see `README_PROJECT.md`.

Happy coding! 🚀
