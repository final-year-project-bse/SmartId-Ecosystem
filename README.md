# 🎓 SmartID Backend - Django REST API

Backend API for SmartID Facial Recognition Attendance System built with Django and Django REST Framework.

![Django](https://img.shields.io/badge/Django-5.0-green)
![DRF](https://img.shields.io/badge/DRF-3.14-red)
![Python](https://img.shields.io/badge/Python-3.11-blue)

## ✨ Features

- 🔐 JWT Authentication
- 👥 Role-based Access Control (Admin, Professor, Student)
- 📚 Course Management
- 📊 Attendance Tracking
- 👤 Facial Recognition Support
- 📱 RESTful API
- 📖 Auto-generated API Documentation
- 🗄️ SQLite/MySQL Database Support

## 🚀 Quick Start

### Windows

```bash
# Run setup script
setup.bat

# Create superuser
python manage.py createsuperuser

# Start server
python manage.py runserver
```

### Mac/Linux

```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Setup database
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run server
python manage.py runserver
```

## 📚 API Documentation

Once the server is running, visit:
- **Swagger UI**: http://127.0.0.1:8000/api/docs/
- **ReDoc**: http://127.0.0.1:8000/api/redoc/
- **Admin Panel**: http://127.0.0.1:8000/admin/

## 🔑 API Endpoints

### Authentication
```
POST /api/auth/users/login/          - Login
POST /api/auth/token/refresh/        - Refresh token
GET  /api/auth/users/me/             - Current user
```

### Users
```
GET    /api/auth/users/              - List users
POST   /api/auth/users/              - Create user
GET    /api/auth/users/{id}/         - Get user
PATCH  /api/auth/users/{id}/         - Update user
DELETE /api/auth/users/{id}/         - Delete user
```

### Courses
```
GET    /api/courses/                 - List courses
POST   /api/courses/                 - Create course
GET    /api/courses/{id}/            - Get course
PATCH  /api/courses/{id}/            - Update course
DELETE /api/courses/{id}/            - Delete course
```

### Attendance
```
GET    /api/attendance/sessions/     - List sessions
POST   /api/attendance/sessions/     - Create session
GET    /api/attendance/records/      - List records
POST   /api/attendance/records/      - Mark attendance
```

### Facial Recognition
```
POST   /api/authentication/faces/enroll/   - Enroll face
POST   /api/authentication/faces/verify/   - Verify face
GET    /api/authentication/logs/           - Authentication logs
```

## 🗄️ Database Configuration

### SQLite (Development - Default)
No configuration needed. Database file created automatically.

### MySQL (Production)
Update `.env`:
```env
DB_ENGINE=django.db.backends.mysql
DB_NAME=smartid_db
DB_USER=your_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=3306
```

## 📦 Project Structure

```
smartid-backend/
├── smartid/              # Main project
│   ├── settings.py       # Settings
│   ├── urls.py           # URL routing
│   └── wsgi.py           # WSGI config
├── accounts/             # User management
├── courses/              # Course management
├── attendance/           # Attendance tracking
├── authentication/       # Facial recognition
├── manage.py             # Django CLI
├── requirements.txt      # Dependencies
└── .env                  # Environment variables
```

## 🔐 Environment Variables

Copy `.env.example` to `.env` and configure:

```env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DB_ENGINE=django.db.backends.sqlite3
DB_NAME=db.sqlite3
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

## 🧪 Testing

```bash
# Run tests
python manage.py test

# Run with coverage
coverage run manage.py test
coverage report
```

## 📝 Creating Test Data

```bash
python manage.py shell
```

```python
from django.contrib.auth import get_user_model
User = get_user_model()

# Create admin
admin = User.objects.create_superuser(
    username='admin',
    email='admin@smartid.edu',
    password='admin123',
    role='ADMIN'
)

# Create professor
prof = User.objects.create_user(
    username='smith',
    email='smith@professor.edu',
    password='prof123',
    first_name='John',
    last_name='Smith',
    role='PROFESSOR'
)

# Create student
student = User.objects.create_user(
    username='ahmed',
    email='ahmed@student.edu',
    password='student123',
    first_name='Ahmed',
    last_name='Khan',
    role='STUDENT'
)
```

## 🚀 Deployment

### Collect Static Files
```bash
python manage.py collectstatic
```

### Production Checklist
- [ ] Set `DEBUG=False`
- [ ] Configure `ALLOWED_HOSTS`
- [ ] Use strong `SECRET_KEY`
- [ ] Setup MySQL database
- [ ] Configure email backend
- [ ] Setup HTTPS
- [ ] Configure CORS properly

## 🔧 Development

### Create New App
```bash
python manage.py startapp app_name
```

### Make Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### Create Superuser
```bash
python manage.py createsuperuser
```

## 📞 Support

For detailed setup instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md)

## 📄 License

MIT License - see LICENSE file

---

**Backend API ready for SmartID Attendance System!** 🎉
