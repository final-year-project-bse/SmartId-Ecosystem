# 🚪 Portal Access Guide

## Overview
SmartID now has **separate portals** for each user role. When you log in, you'll be automatically redirected to your role-specific portal with customized features and navigation.

---

## 🎓 Student Portal
**Access URL**: `/student/dashboard`

### Login Credentials:
```
Role: Student (Green)
Email: ahmed@student.edu
Password: student123
```

### Available Features:
- ✅ **Dashboard**: View attendance summary and statistics
- ✅ **My Attendance**: View personal attendance records
- ✅ **Notifications**: Receive updates and alerts
- ✅ **Settings**: Manage profile and preferences

**Note**: Students cannot manually authenticate. Attendance is marked by professors or admins during class sessions.

### Theme Color: **Green** 🟢

---

## 👨‍🏫 Professor Portal
**Access URL**: `/professor/dashboard`

### Login Credentials:
```
Role: Teacher (Blue)
Email: smith@professor.edu
Password: prof123
```

### Available Features:
- ✅ **Dashboard**: Overview of courses and attendance
- ✅ **Sessions**: Start/stop attendance sessions
- ✅ **Today**: View today's attendance
- ✅ **Reports**: Generate attendance reports
- ✅ **Notifications**: Course and student updates
- ✅ **Settings**: Manage profile and preferences

### Theme Color: **Blue** 🔵

---

## 👨‍💼 Admin Portal
**Access URL**: `/admin/dashboard`

### Login Credentials:
```
Role: Admin (Red)
Email: admin@smartid.edu
Password: admin123
```

### Available Features:
- ✅ **Dashboard**: System-wide overview and analytics
- ✅ **User Accounts**: Manage all user accounts
- ✅ **Manage Students**: Student enrollment and records
- ✅ **Attendance Methods**: Configure attendance settings
- ✅ **Enroll Users**: Add new users to the system
- ✅ **Sessions**: Monitor all attendance sessions
- ✅ **Reports**: System-wide reports and analytics
- ✅ **Notifications**: System alerts and updates
- ✅ **Settings**: System configuration

### Theme Color: **Red** 🔴

---

## 🔐 Security Features

### Role-Based Access Control
- Each portal is protected by role-based authentication
- Users can only access features appropriate to their role
- Attempting to access another portal redirects to your own dashboard

### Login Process
1. **Select Role**: Choose Student, Teacher, or Admin
2. **Enter Credentials**: Email and password for that role
3. **Auto-Redirect**: Automatically sent to your portal
4. **Role Verification**: System validates your role matches the selected portal

---

## 🎨 Visual Differences

### Student Portal (Green Theme)
- Green accent colors throughout
- Student-focused navigation
- Simplified interface for attendance tracking
- Personal attendance history

### Professor Portal (Blue Theme)
- Blue accent colors throughout
- Course management tools
- Session control features
- Class-wide attendance reports

### Admin Portal (Red Theme)
- Red accent colors throughout
- Full system access
- User management tools
- System-wide analytics and controls

---

## 🚀 Quick Start

### Testing Different Portals:

1. **Logout** (if already logged in)
2. Go to **http://localhost:5173**
3. **Select a role** (Student/Teacher/Admin)
4. **Enter credentials** from above
5. **Explore** the role-specific features

### Switching Between Portals:
- Logout from current portal
- Login with different role credentials
- Each portal is completely separate

---

## 📱 Navigation Structure

### Student Portal Routes:
```
/student/dashboard
/student/today
/student/notifications
/student/settings
```

### Professor Portal Routes:
```
/professor/dashboard
/professor/sessions
/professor/today
/professor/reports
/professor/notifications
/professor/settings
```

### Admin Portal Routes:
```
/admin/dashboard
/admin/accounts
/admin/students
/admin/attendance-methods
/admin/enroll
/admin/sessions
/admin/reports
/admin/notifications
/admin/settings
```

---

## 🛡️ Access Restrictions

- **Students** cannot access professor or admin features
- **Students** cannot manually authenticate (attendance marked by professors/admins)
- **Professors** cannot access admin features
- **Professors** cannot access authentication page (only admins can authenticate users)
- **Admins** have full system access including user authentication
- Unauthorized access attempts redirect to appropriate portal

---

## 💡 Tips

1. **Remember Your Role**: Always select the correct role when logging in
2. **Bookmarks**: Bookmark your portal URL for quick access
3. **Role Indicator**: Check the sidebar for your current role
4. **Color Coding**: Use the theme color to identify which portal you're in

---

## 🐛 Troubleshooting

### Wrong Portal After Login?
- Make sure you selected the correct role before logging in
- Logout and try again with the right role selected

### Can't Access a Feature?
- Check if that feature is available for your role
- Refer to the "Available Features" section above

### Redirected to Different Portal?
- You may be trying to access a restricted area
- The system automatically redirects you to your authorized portal

---

## 📞 Support

For issues or questions:
- Check the role-specific features list
- Verify you're using the correct credentials
- Ensure you selected the right role at login

---

**Happy Learning with SmartID! 🎓**
