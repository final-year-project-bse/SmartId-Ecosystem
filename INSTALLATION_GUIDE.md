# 📦 SmartID Frontend - Installation Guide

## Current Status

The project has been created with all source files, but dependencies need to be installed.

## Installation Steps

### Step 1: Open Terminal in Project Directory
```bash
cd smartid-frontend
```

### Step 2: Install Dependencies
```bash
npm install
```

**Note:** This will install all required packages (~200MB). It may take 3-5 minutes depending on your internet connection.

### Step 3: Wait for Installation to Complete
You should see output like:
```
added 500+ packages in 3m
```

### Step 4: Start Development Server
```bash
npm run dev
```

### Step 5: Open Browser
Visit: **http://localhost:5173** (or the port shown in terminal)

---

## If Installation Fails

### Option 1: Use Legacy Peer Deps
```bash
npm install --legacy-peer-deps
```

### Option 2: Clear Cache and Retry
```bash
npm cache clean --force
rmdir /s /q node_modules
del package-lock.json
npm install
```

### Option 3: Use Yarn Instead
```bash
npm install -g yarn
yarn install
yarn dev
```

---

## Verify Installation

After installation completes, check that these folders exist:
- `node_modules/` (should contain 500+ packages)
- `node_modules/react-router-dom/`
- `node_modules/tailwindcss/`
- `node_modules/recharts/`

---

## Expected Package Sizes

- **node_modules**: ~200-300 MB
- **Total packages**: 500-600 packages
- **Installation time**: 2-5 minutes

---

## What Gets Installed

### Production Dependencies (10):
1. react & react-dom - UI library
2. react-router-dom - Routing
3. lucide-react - Icons
4. recharts - Charts
5. zustand - State management
6. i18next & react-i18next - Internationalization
7. react-webcam - Camera access
8. date-fns - Date formatting

### Development Dependencies (12):
1. vite - Build tool
2. tailwindcss - CSS framework
3. postcss & autoprefixer - CSS processing
4. @vitejs/plugin-react - React plugin
5. eslint & plugins - Code linting
6. TypeScript types - Type definitions

---

## After Successful Installation

You should be able to run:
```bash
npm run dev
```

And see:
```
ROLLDOWN-VITE v7.2.2  ready in 744 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

Then open your browser to **http://localhost:5173** and you'll see the SmartID Dashboard!

---

## Quick Commands Reference

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

---

## Troubleshooting

### "Cannot find module 'react-router-dom'"
**Solution:** Dependencies not installed. Run `npm install`

### "Port 5173 is in use"
**Solution:** Vite will automatically use next available port (5174, 5175, etc.)

### "Failed to load PostCSS config"
**Solution:** Make sure tailwindcss is installed: `npm install -D tailwindcss`

### Webcam not working
**Solution:** 
- Allow camera permissions in browser
- Use HTTPS in production (localhost works in dev)

---

## System Requirements

- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher
- **Disk Space**: 500 MB free
- **RAM**: 4 GB minimum
- **Browser**: Chrome, Firefox, Edge, or Safari (latest versions)

---

## Next Steps After Installation

1. ✅ Run `npm run dev`
2. ✅ Open http://localhost:5173
3. ✅ Test theme toggle (moon/sun icon)
4. ✅ Test language switch (globe icon)
5. ✅ Try webcam features (Enroll/Authenticate pages)
6. ✅ Explore all pages from sidebar
7. ✅ Read README_PROJECT.md for full documentation

---

**Current Action Required:** Please run `npm install` in the smartid-frontend directory to install all dependencies, then run `npm run dev` to start the application.
