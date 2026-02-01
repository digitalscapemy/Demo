# 🎓 LMS System - Learning Management Platform

<div align="center">
  <img src="https://img.shields.io/badge/Vue.js-3.4+-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white" alt="Vue.js">
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase">
  <img src="https://img.shields.io/badge/TailwindCSS-3.0+-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS">
</div>

## 📋 Overview

A modern, feature-rich Learning Management System built with Vue 3 and Node.js. This platform provides comprehensive tools for online education management, supporting multiple user roles with intuitive interfaces and robust functionality.

## ✨ Features

### 🔐 Authentication System
- User registration and login
- Forgot password functionality
- JWT-based secure authentication
- Role-based access control

### 👥 Multi-Role Support
- **Admin**: Full system management
- **Instructor**: Course creation and management
- **Student**: Course enrollment and learning

### 🎨 Modern UI/UX
- Clean, responsive design
- Built with TailwindCSS
- Smooth animations and transitions
- Mobile-friendly interface

### 📊 Admin Dashboard
- User management (CRUD operations)
- Role assignment
- System analytics
- User activity tracking

### 👤 User Profiles
- Personal profile management
- Avatar upload
- Bio and settings customization
- Progress tracking

## 🛠 Tech Stack

### Frontend
- **Vue 3** with Composition API
- **TypeScript** for type safety
- **Vite** for fast development
- **Vue Router 4** for navigation
- **Pinia** for state management
- **TailwindCSS** for styling
- **Axios** for API calls
- **Lucide Vue** for icons

### Backend
- **Node.js** with ES modules
- **Express.js** for API server
- **Supabase** for database
- **JWT** for authentication
- **bcryptjs** for password hashing

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/digitalscapemy/Demo.git
   cd Demo
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Environment Setup**
   
   Create a `.env` file in the `server` directory:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   JWT_SECRET=your_jwt_secret
   ```

5. **Database Setup**
   
   Run this SQL in your Supabase SQL Editor:
   ```sql
   CREATE TABLE users (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     name TEXT NOT NULL,
     email TEXT UNIQUE NOT NULL,
     password TEXT NOT NULL,
     role TEXT DEFAULT 'student',
     avatar TEXT,
     bio TEXT,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   
   CREATE INDEX idx_users_email ON users(email);
   ```

6. **Start the development servers**
   
   Terminal 1 - Backend:
   ```bash
   cd server
   npm run dev
   ```
   
   Terminal 2 - Frontend:
   ```bash
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## 📦 Build for Production

```bash
npm run build
```

The production files will be in the `dist` directory.

## 🎯 Default Credentials

An admin user is automatically created:
- **Email**: admin@lms.com
- **Password**: admin123

## 📁 Project Structure

```
Demo/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable components
│   ├── layouts/          # Layout components
│   ├── pages/            # Page components
│   │   ├── admin/        # Admin pages
│   │   └── auth/         # Authentication pages
│   ├── router/           # Vue Router configuration
│   ├── services/         # API services
│   ├── stores/           # Pinia stores
│   └── types/            # TypeScript types
├── server/               # Backend application
│   ├── index.js          # Server entry point
│   └── package.json      # Backend dependencies
└── dist/                 # Production build
```

## 🔧 Configuration

### Frontend Configuration
- `vite.config.ts` - Vite configuration
- `tailwind.config.js` - TailwindCSS configuration
- `tsconfig.json` - TypeScript configuration

### Backend Configuration
- `server/.env` - Environment variables
- `server/index.js` - Express server setup

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Vue.js team for the amazing framework
- Supabase for the excellent backend-as-a-service
- TailwindCSS for the utility-first CSS framework
- All contributors who help improve this project

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

<div align="center">
  Made with ❤️ by DigitalScape
</div>
