# 🛠️ Task Management – MERN Stack Application

A full-featured task management web application built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js) and **Tailwind CSS**. Users can register as **User** or **Admin** with role-based access control and comprehensive task management capabilities.


**🌐 [Live Demo](https://task-management-2-imev.onrender.com/)** 

**📂 [Source Code](https://github.com/Jitugandhare/Task-management)**


## 📋 Table of Contents
- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Installation Guide](#-installation-guide)
- [Usage](#-usage)
- [Folder Structure](#-folder-structure)
- [API Endpoints](#-api-endpoints)
- [Security Features](#-security-features)
- [Screenshots](#-screenshots)
- [Future Improvements](#-future-improvements)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

## 🧭 Project Overview

The Task Management application supports two distinct user roles with different capabilities:

- **Users** can view assigned tasks and update their completion status
- **Admins** can create, assign, and manage tasks with priority levels and deadlines (requires 5-digit PIN for registration)

## 🚀 Key Features

### 👥 User Features
- 🔐 **Authentication:** Secure sign up, login, and logout functionality
- 📝 **Task View:** View all personally assigned tasks
- 📌 **Status Updates:** Mark tasks as `Pending`, `In Progress`, or `Completed`
- 👤 **Profile Management:** Update personal information and preferences

### 🛠️ Admin Features
- 📝 **Task Management:** Create, edit, and delete tasks
- 👥 **Task Assignment:** Assign tasks to specific users
- ⏰ **Priority & Deadlines:** Set task priorities and due dates
- 🔄 **Status Management:** Update status for any task in the system
- 👤 **User Management:** View all registered users and their task assignments
- 🛡️ **Secure Registration:** Admin account creation requires a 5-digit PIN

## 🧑‍💻 Tech Stack

| Category | Technology | Description |
|----------|------------|-------------|
| **Frontend** | React.js | User interface and component management |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **Routing** | React Router | Client-side routing |
| **Backend** | Node.js, Express.js | Server-side runtime and web framework |
| **Database** | MongoDB | NoSQL database with Mongoose ODM |
| **Authentication** | JWT | JSON Web Token for secure authentication |
| **Storage** | localStorage, sessionStorage | Client-side data persistence |
| **Security** | bcryptjs | Password hashing and encryption |

## 🛠️ Installation Guide

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/Jitugandhare/Task-Management.git
cd Task-Management
```

### 2. 🔧 Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `/backend` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
ADMIN_PIN=98935
NODE_ENV=development
```

Start the backend server:
```bash
npm run dev
```

The backend server will run on `http://localhost:8000`

### 3. 🎨 Frontend Setup
```bash
cd frontend
npm install
npm start
```

The frontend application will run on `http://localhost:5173`

## 📖 Usage

### For Users:
1. Register with your email and password
2. Login to access your task dashboard
3. View assigned tasks with their priorities and deadlines
4. Update task status as you progress

### For Admins:
1. Register using the 5-digit PIN (default: 98935)
2. Login to access the admin dashboard
3. Create new tasks and assign them to users
4. Set priorities (Low, Medium, High) and deadlines
5. Monitor and update task statuses across the system

## 📁 Folder Structure

```
Task-Management/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── taskController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── adminAuth.js
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── tasks.js
│   │   └── users.js
│   ├── config/
│   │   └── database.js
│   ├── .env
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js
│   │   │   ├── TaskCard.js
│   │   │   └── UserList.js
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   └── AdminPanel.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── utils/
│   │   │   └── auth.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── README.md
└── package.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Tasks
- `GET /api/tasks` - Get user's tasks
- `POST /api/tasks` - Create new task (Admin only)
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task (Admin only)

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get specific user

## 🛡️ Security Features

- **Password Encryption:** All passwords are hashed using bcryptjs
- **JWT Authentication:** Secure token-based authentication system
- **Role-Based Access Control:** Separate permissions for Users and Admins
- **Admin PIN Verification:** Additional security layer for admin registration
- **Input Validation:** Server-side validation for all user inputs
- **CORS Protection:** Cross-Origin Resource Sharing configuration

## 📸 Screenshots

### 👤 Login Page
*Secure login interface for both users and admins*

### 🗂️ Task Dashboard
*Comprehensive task management interface*

## 📌 Future Improvements

- [ ] **Notifications:** Real-time task reminders and deadline alerts
- [ ] **Advanced Filtering:** Filter tasks by priority, deadline, or status
- [ ] **Search Functionality:** Search tasks by title or description
- [ ] **Task Comments:** Add comments and collaboration features
- [ ] **File Attachments:** Support for task-related file uploads
- [ ] **Calendar Integration:** Visual calendar view for task deadlines
- [ ] **Email Notifications:** Automated email alerts for task updates
- [ ] **Task Categories:** Organize tasks into different categories
- [ ] **Progress Tracking:** Visual progress indicators and analytics
- [ ] **Mobile App:** React Native mobile application

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow ESLint configuration
- Write clear commit messages
- Add tests for new features
- Update documentation as needed

## 📃 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Author

**Jitu Gandhare**

- GitHub: [@Jitugandhare](https://github.com/Jitugandhare)
- Email: jitugandhare@gmail.com

---

### 🌟 Show Your Support

If you found this project helpful, please give it a ⭐ on GitHub!

---

*Made with ❤️ and lots of ☕ by Jitu Gandhare*
