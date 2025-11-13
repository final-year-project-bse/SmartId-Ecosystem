# SmartID Frontend - Complete React Application

A modern, responsive frontend for the SmartID Ecosystem with facial recognition attendance system.

## 🚀 Features

- **Modern UI**: Built with React + Vite + Tailwind CSS
- **Dark Mode**: Auto-detect system theme with manual toggle
- **Internationalization**: English & Urdu support
- **Responsive Design**: Mobile-first, works on all devices
- **Mock Data**: In-memory state management with Zustand
- **Attendance Visualization**: Charts and tables with Recharts
- **Webcam Integration**: Face capture for enrollment and authentication
- **Role-Based Views**: ADMIN, PROFESSOR, STUDENT roles

## 📦 Installation

```bash
cd smartid-frontend
npm install
```

## 🏃 Run Development Server

```bash
npm run dev
```

Visit: http://localhost:5173

## 🎨 Color Scheme

- **Primary**: #4f46e5 (Indigo)
- **Light Mode**: White backgrounds, slate text
- **Dark Mode**: Slate backgrounds, light text
- **Accents**: Green (success), Red (danger), Yellow (warning)

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── AppLayout.jsx       # Main layout wrapper
│   │   ├── Sidebar.jsx         # Navigation sidebar
│   │   └── Topbar.jsx          # Top navigation bar
│   ├── ui/
│   │   ├── Button.jsx          # Reusable button
│   │   ├── Card.jsx            # Card container
│   │   ├── Input.jsx           # Form input
│   │   ├── Select.jsx          # Dropdown select
│   │   ├── Badge.jsx           # Status badge
│   │   ├── Table.jsx           # Data table
│   │   └── NavLink.jsx         # Navigation link
│   ├── attendance/
│   │   ├── AttendanceChart.jsx # Bar chart visualization
│   │   └── AttendanceByDate.jsx# Date-wise table
│   └── ThemeProvider.jsx       # Theme context
├── pages/
│   ├── Dashboard.jsx           # Overview with stats
│   ├── Enroll.jsx              # User enrollment with webcam
│   ├── Authenticate.jsx        # Face authentication
│   ├── Sessions.jsx            # Manage class sessions
│   ├── Today.jsx               # Today's attendance
│   ├── Reports.jsx             # Attendance reports with filters
│   ├── Notifications.jsx       # System notifications
│   ├── Settings.jsx            # User settings
│   └── NotFound.jsx            # 404 page
├── store/
│   └── useAppStore.js          # Zustand state management
├── services/
│   └── mockApi.js              # Mock API functions
├── utils/
│   └── attendance.js           # Attendance aggregation helpers
├── i18n/
│   ├── config.js               # i18next configuration
│   └── locales/
│       ├── en/common.json      # English translations
│       └── ur/common.json      # Urdu translations
├── styles/
│   └── theme.css               # Global styles + Tailwind
├── App.jsx                     # Main app with routing
└── main.jsx                    # Entry point
```

## 🎭 Pages Overview

### Dashboard
- Summary cards (courses, sessions, students, avg attendance)
- Attendance chart
- Recent notifications

### Enroll
- Webcam capture interface
- User information form (username, email, ID, role)
- Consent checkbox
- Mock enrollment submission

### Authenticate
- Webcam capture for face recognition
- Authentication result display
- Confidence score and user details

### Sessions (Professor)
- List of all courses
- Start/Stop session buttons
- Active session indicators

### Today
- Today's attendance chart
- Date-wise attendance table

### Reports
- Filters: Course, Date Range
- Attendance chart and table
- Export to CSV functionality

### Notifications
- List of system notifications
- Mark as read functionality

### Settings
- Theme toggle (Light/Dark)
- Language switch (EN/UR)
- Profile information
- Role testing instructions

## 🔧 How to Change Mock Role

To test different user roles, edit `src/store/useAppStore.js`:

```javascript
user: {
  id: '1',
  username: 'admin',
  email: 'admin@smartid.edu',
  role: 'ADMIN', // Change to: ADMIN | PROFESSOR | STUDENT
},
```

### Role Capabilities:
- **ADMIN**: Full access to all features
- **PROFESSOR**: Manage sessions, view reports
- **STUDENT**: View attendance, authenticate

## 🌐 Internationalization

Switch language using the globe icon in the topbar. Translations are stored in:
- `src/i18n/locales/en/common.json`
- `src/i18n/locales/ur/common.json`

## 🎨 Theming

The app auto-detects system theme preference. Users can manually toggle between light and dark modes using the moon/sun icon in the topbar.

Theme variables are defined in `src/styles/theme.css`.

## 📊 Mock Data

All data is stored in Zustand store (`src/store/useAppStore.js`):
- Users
- Courses
- Enrollments
- Sessions
- Attendance records
- Notifications

## 🔌 Future Backend Integration

Mock API functions are in `src/services/mockApi.js`. Replace these with actual API calls when backend is ready.

## ♿ Accessibility

- Focus rings on interactive elements
- ARIA labels on buttons
- Semantic HTML
- Keyboard navigation support
- Color contrast compliance

## 📱 Responsive Design

- Mobile: Collapsible sidebar with overlay
- Tablet: Optimized grid layouts
- Desktop: Full sidebar always visible

## 🛠️ Technologies

- **React 18**: UI library
- **Vite**: Build tool
- **Tailwind CSS**: Styling
- **React Router**: Navigation
- **Zustand**: State management
- **i18next**: Internationalization
- **Recharts**: Data visualization
- **react-webcam**: Camera access
- **lucide-react**: Icons
- **date-fns**: Date formatting

## 📝 Notes

- No backend integration yet - all data is mock
- Webcam requires HTTPS in production
- CSV export works client-side only
- Theme preference persists in localStorage
- Language preference persists in localStorage

## 🚀 Build for Production

```bash
npm run build
```

Output will be in `dist/` directory.

## 📄 License

This project is part of the SmartID Ecosystem.
