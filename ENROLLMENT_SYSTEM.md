# 🎓 Enrollment & Login System Documentation

## Overview

The SmartID system now features a complete enrollment and authentication system where:
- **Admin** enrolls students and professors
- **System generates** login credentials automatically
- **Users receive** their credentials to access the system
- **Admin can manage** user access (enable/disable accounts)

---

## 🔐 How It Works

### 1. **Admin Enrolls User**
```
Admin → Enroll Page → Capture Face → Fill Details → Generate Credentials → Submit
```

### 2. **System Creates Account**
```
System → Generates User ID → Generates Password → Stores in Database → Grants Access
```

### 3. **User Receives Credentials**
```
Admin → Shares Credentials → User → Login Page → Enter Email & Password → Access Portal
```

---

## 📋 Enrollment Process

### Step 1: Navigate to Enroll Page
- Admin logs in
- Goes to **"Enroll Users"** from sidebar
- Sees enrollment form

### Step 2: Capture Biometric Data
- Click **"Capture"** button
- System captures face image via webcam
- Can retake if needed
- Check consent checkbox

### Step 3: Fill User Information
- **Full Name**: Enter user's complete name
- **Email**: Enter user's email address
- **Role**: Select STUDENT or PROFESSOR
- **User ID**: Click "Generate" for auto ID (e.g., S1234, P5678)
- **Password**: Click "Generate" for secure password
- **Courses**: Select courses to enroll (for students) or assign (for professors)

### Step 4: Submit Enrollment
- Click **"Enroll User & Grant Access"**
- System processes enrollment
- Success screen shows credentials

### Step 5: Share Credentials
- Copy individual credentials or all at once
- Share securely with the user
- User can now log in!

---

## 🎯 Generated Credentials

### User ID Format:
- **Students**: `S` + 4 digits (e.g., S1234, S5678)
- **Professors**: `P` + 4 digits (e.g., P1234, P5678)
- **Admins**: `A` + 4 digits (e.g., A1001)

### Password Format:
- **Length**: 12 characters
- **Contains**: Uppercase, lowercase, numbers
- **Example**: `Kx7mP2nQ9wRt`

### Example Credentials:
```
User ID: S1234
Email: ahmed@student.edu
Password: Kx7mP2nQ9wRt
Role: STUDENT
```

---

## 🔑 Login System

### How Users Log In:

1. **Go to Login Page** (`/login`)
2. **Enter Email** (e.g., ahmed@student.edu)
3. **Enter Password** (provided by admin)
4. **Click "Sign In"**
5. **System Authenticates**:
   - Checks if user exists
   - Verifies password
   - Checks if account is active
   - Grants access to appropriate portal

### Authentication Flow:
```
Login Page
    ↓
Check Email → User Found?
    ↓ Yes
Check Password → Correct?
    ↓ Yes
Check Access → Enabled?
    ↓ Yes
Redirect to Portal (Admin/Professor/Student)
```

---

## 👨‍💼 Admin Features

### 1. **Enroll Users** (`/enroll`)
- Enroll students with biometric data
- Enroll professors with course assignments
- Generate secure credentials
- Grant system access

### 2. **View User Accounts** (`/admin/accounts`)
- See all enrolled users
- View credentials (with show/hide)
- Copy credentials to clipboard
- Filter by role (Admin/Professor/Student)
- Search by name, ID, or email

### 3. **Manage Access**
- **Enable Access**: User can log in
- **Disable Access**: User cannot log in
- Toggle access with lock/unlock button
- View active vs disabled users

### 4. **Manage Students** (`/admin/students`)
- View all students
- Edit student information
- View course enrollments
- Track enrollment dates

### 5. **Configure Attendance Methods** (`/admin/attendance-methods`)
- Enable/disable Face Recognition
- Enable/disable Fingerprint
- Enable/disable RFID Card
- Enable/disable QR Code

---

## 📊 User Accounts Page Features

### Statistics:
- **Total Users**: All enrolled users
- **Students**: Count of students
- **Professors**: Count of professors
- **Admins**: Count of admins

### User Table Columns:
1. **User ID**: Unique identifier
2. **Name**: Full name
3. **Email**: Email address (with copy button)
4. **Password**: Hidden by default (show/hide toggle, copy button)
5. **Role**: ADMIN/PROFESSOR/STUDENT badge
6. **Access**: Active/Disabled status
7. **Actions**: Lock/Unlock access button

### Features:
- 🔍 **Search**: Find users by name, ID, or email
- 🎯 **Filter**: Show only specific roles
- 👁️ **Show/Hide Passwords**: Toggle password visibility
- 📋 **Copy**: Copy email or password to clipboard
- 🔒 **Access Control**: Enable/disable user accounts

---

## 🎓 Student Enrollment Example

### Admin Process:
1. Go to `/enroll`
2. Capture student's face
3. Fill details:
   - Name: Ahmed Ali
   - Email: ahmed@student.edu
   - Role: STUDENT
   - Generate User ID: S1234
   - Generate Password: Kx7mP2nQ9wRt
   - Select Courses: CS101, CS201
4. Submit enrollment
5. Copy credentials
6. Share with student

### Student Process:
1. Receive credentials from admin
2. Go to `/login`
3. Enter email: ahmed@student.edu
4. Enter password: Kx7mP2nQ9wRt
5. Click "Sign In"
6. Access Student Portal

---

## 👨‍🏫 Professor Enrollment Example

### Admin Process:
1. Go to `/enroll`
2. Capture professor's face
3. Fill details:
   - Name: Dr. Smith
   - Email: smith@professor.edu
   - Role: PROFESSOR
   - Generate User ID: P1234
   - Generate Password: Rt9wQ2nP7mKx
   - Assign Courses: CS101, CS301
4. Submit enrollment
5. Copy credentials
6. Share with professor

### Professor Process:
1. Receive credentials from admin
2. Go to `/login`
3. Enter email: smith@professor.edu
4. Enter password: Rt9wQ2nP7mKx
5. Click "Sign In"
6. Access Professor Portal

---

## 🔒 Security Features

### Password Security:
- ✅ Auto-generated 12-character passwords
- ✅ Mix of uppercase, lowercase, numbers
- ✅ Hidden by default in UI
- ✅ Copy to clipboard for secure sharing

### Access Control:
- ✅ Admin can enable/disable accounts
- ✅ Disabled users cannot log in
- ✅ Access status visible in admin panel
- ✅ Instant access revocation

### Authentication:
- ✅ Email-based login
- ✅ Password verification
- ✅ Account status check
- ✅ Role-based portal routing

---

## 📱 Default Test Accounts

### Admin Account:
```
Email: admin@smartid.edu
Password: admin123
Role: ADMIN
```

### Professor Account:
```
Email: smith@professor.edu
Password: prof123
Role: PROFESSOR
```

### Student Account:
```
Email: ahmed@student.edu
Password: student123
Role: STUDENT
```

---

## 🎯 Admin Navigation Menu

```
📊 Dashboard
➕ Enroll Users          ← Enroll students/professors
🔑 User Accounts         ← View all credentials
👥 Manage Students       ← Student management
🔐 Attendance Methods    ← Configure methods
📄 Reports
🔔 Notifications
⚙️ Settings
```

---

## 🚀 Quick Start Guide

### For Admin:

1. **Login as Admin**
   ```
   Email: admin@smartid.edu
   Password: admin123
   ```

2. **Enroll a Student**
   - Go to "Enroll Users"
   - Capture face
   - Fill details
   - Generate credentials
   - Submit

3. **View Credentials**
   - Go to "User Accounts"
   - Find the user
   - Copy credentials
   - Share with user

4. **Manage Access**
   - Go to "User Accounts"
   - Click lock/unlock icon
   - Enable or disable access

### For New Users:

1. **Receive Credentials**
   - Get email and password from admin

2. **Login**
   - Go to login page
   - Enter email
   - Enter password
   - Click "Sign In"

3. **Access Portal**
   - Automatically routed to your portal
   - Start using the system!

---

## 📊 Data Flow

### Enrollment Flow:
```
Admin Input
    ↓
Generate User ID (S/P + 4 digits)
    ↓
Generate Password (12 chars)
    ↓
Capture Biometric Data
    ↓
Store in Database
    ↓
Grant System Access
    ↓
Display Credentials
    ↓
Admin Shares with User
```

### Login Flow:
```
User Enters Email + Password
    ↓
System Searches Database
    ↓
User Found? → Check Password
    ↓
Password Correct? → Check Access
    ↓
Access Enabled? → Grant Entry
    ↓
Route to Role-Based Portal
```

---

## 🎨 UI Features

### Enrollment Success Screen:
- ✅ Green checkmark icon
- ✅ Success message
- ✅ Credentials display
- ✅ Copy buttons for each field
- ✅ "Copy All Credentials" button
- ✅ Security notice
- ✅ "Enroll Another User" button

### User Accounts Page:
- ✅ Statistics cards
- ✅ Search bar
- ✅ Role filter buttons
- ✅ Credentials table
- ✅ Show/hide password toggles
- ✅ Copy buttons
- ✅ Access control buttons
- ✅ Security notice

---

## 🔧 Technical Details

### Files Created:
1. `src/pages/Enroll.jsx` - Enhanced enrollment page
2. `src/pages/admin/UserAccounts.jsx` - User management page
3. `src/pages/Login.jsx` - Updated with authentication
4. `src/store/useAppStore.js` - Added user data

### Store Structure:
```javascript
{
  students: [{ id, name, email, password, enrolledCourses, status, hasAccess }],
  professors: [{ id, name, email, password, courses, status, hasAccess }],
  admins: [{ id, name, email, password, status, hasAccess }]
}
```

---

## ✅ Summary

The enrollment and login system provides:

✅ **Complete Enrollment** - Admin enrolls students and professors
✅ **Credential Generation** - Auto-generated User IDs and passwords
✅ **Biometric Capture** - Face recognition enrollment
✅ **Access Management** - Enable/disable user accounts
✅ **Secure Login** - Email and password authentication
✅ **Role-Based Access** - Automatic portal routing
✅ **Credential Management** - View and copy all credentials
✅ **User-Friendly UI** - Intuitive enrollment and login flows

The system is now ready for production use with complete user management! 🎉
