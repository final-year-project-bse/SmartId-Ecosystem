# 🎓 SmartID Frontend - Facial Recognition Attendance System

A modern, responsive React application for managing attendance using facial recognition, fingerprint, RFID, and QR code authentication methods.

![React](https://img.shields.io/badge/React-19.2.0-blue)
![Vite](https://img.shields.io/badge/Vite-7.2.2-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-cyan)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 🎭 Three Role-Based Portals

#### 👨‍💼 Admin Portal
- Enroll students and professors with biometric data
- Generate secure login credentials
- Manage user accounts and access control
- Configure attendance methods (Face, Fingerprint, RFID, QR)
- View system-wide reports and analytics
- Manage student enrollments

#### 👨‍🏫 Professor Portal
- Real-time class attendance monitoring
- Track who is present, late, or absent
- View arrival times and on-time status
- Start/stop class sessions
- Generate course-specific reports
- Monitor student attendance patterns

#### 👨‍🎓 Student Portal
- View personal attendance records
- Track overall attendance percentage
- See arrival times (on-time/late)
- Course-wise attendance breakdown
- Attendance trends and visualizations
- Authenticate for class attendance

### 🔐 Authentication & Enrollment
- Complete enrollment system with biometric capture
- Auto-generated User IDs and secure passwords
- Email-based login authentication
- Role-based access control
- Enable/disable user accounts

### 🎨 Modern UI/UX
- Dark mode with auto system detection
- Responsive design (mobile, tablet, desktop)
- Bilingual support (English & Urdu)
- Smooth animations and transitions
- Accessible components (WCAG compliant)

### 📊 Attendance Tracking
- Multiple authentication methods
- Real-time attendance monitoring
- Arrival status tracking (on-time/late/absent)
- Attendance visualization with charts
- Export reports to CSV

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 9+
- Modern web browser
- Webcam (for biometric features)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/smartid-frontend.git

# Navigate to project directory
cd smartid-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit: **http://localhost:5173**

## 📋 Default Test Accounts

### Admin Account
```
Email: admin@smartid.edu
Password: admin123
```

### Professor Account
```
Email: smith@professor.edu
Password: prof123
```

### Student Account
```
Email: ahmed@student.edu
Password: student123
```

## 🎯 Project Structure

```
smartid-frontend/
├── src/
│   ├── components/
│   │   ├── attendance/      # Attendance charts and tables
│   │   ├── layout/          # Layout components (Sidebar, Topbar)
│   │   └── ui/              # Reusable UI components
│   ├── pages/
│   │   ├── admin/           # Admin portal pages
│   │   ├── professor/       # Professor portal pages
│   │   ├── student/         # Student portal pages
│   │   ├── Login.jsx        # Login page
│   │   ├── SignUp.jsx       # Sign up page
│   │   └── ...              # Other pages
│   ├── store/
│   │   └── useAppStore.js   # Zustand state management
│   ├── services/
│   │   └── mockApi.js       # Mock API functions
│   ├── i18n/                # Internationalization
│   ├── utils/               # Utility functions
│   └── styles/              # Global styles
├── public/                  # Static assets
└── docs/                    # Documentation files
```

## 🔧 Technologies Used

### Core
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Navigation and routing
- **Zustand** - State management

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Recharts** - Data visualization

### Features
- **i18next** - Internationalization (EN/UR)
- **react-webcam** - Camera access for biometric capture
- **date-fns** - Date formatting and manipulation

## 📖 Additional Documentation

- [Portal Access Guide](PORTAL_ACCESS_GUIDE.md) - Detailed guide for each role's portal
- [Contributing Guidelines](CONTRIBUTING.md) - How to contribute to the project
- [License](LICENSE) - MIT License details

## 🎨 Features Overview

### Admin Features
- ✅ Enroll students and professors
- ✅ Generate secure credentials
- ✅ Manage user accounts
- ✅ Configure attendance methods
- ✅ View all user credentials
- ✅ Enable/disable user access
- ✅ System-wide reports

### Professor Features
- ✅ Real-time class monitoring
- ✅ Track present/late/absent students
- ✅ View arrival times
- ✅ Start/stop sessions
- ✅ Course-specific reports
- ✅ Student attendance patterns

### Student Features
- ✅ View attendance percentage
- ✅ Track personal records
- ✅ See arrival times
- ✅ Course-wise breakdown
- ✅ Attendance visualization
- ✅ Authenticate for classes

## 🔐 Attendance Methods

The system supports multiple authentication methods:

1. **Face Recognition** 👤 - Contactless, webcam-based
2. **Fingerprint** 👆 - Biometric scanner
3. **RFID Card** 💳 - Card scanning
4. **QR Code** 📱 - Mobile scanning

Admins can enable/disable methods as needed.

## 🌐 Internationalization

The application supports:
- **English (EN)** - Default language
- **Urdu (UR)** - RTL support

Switch languages using the globe icon in the topbar.

## 🎨 Theme Support

- **Light Mode** - Clean, bright interface
- **Dark Mode** - Easy on the eyes
- **Auto Detection** - Follows system preference
- **Manual Toggle** - Switch anytime

## 📱 Responsive Design

Fully responsive across all devices:
- **Desktop** - Full sidebar with detailed views
- **Tablet** - Optimized layout
- **Mobile** - Hamburger menu, stacked cards

## 🔒 Security Features

- Role-based access control
- Secure password generation
- Account enable/disable
- Biometric data encryption (future)
- Session management

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm install -g netlify-cli
netlify deploy
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - Initial work

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first approach
- Vite for the blazing fast build tool
- All contributors and supporters

## 📧 Contact

For questions or support, please contact:
- Email: your.email@example.com
- GitHub: [@yourusername](https://github.com/yourusername)

## 🗺️ Roadmap

- [ ] Backend API integration
- [ ] Real-time notifications
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Parent portal
- [ ] Geofencing for on-campus detection
- [ ] AI-powered attendance predictions
- [ ] LMS integration

---

**Made with ❤️ for educational institutions**
