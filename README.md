# 📄 TrackFolio - Full-Stack MERN Resume Management Platform

A comprehensive, production-ready resume management and job application tracking system built with **MongoDB, Express.js, React, and Node.js**. Features intelligent resume parsing with **Google Gemini AI**, JWT authentication, file uploads (PDF/DOCX), and a powerful dashboard for tracking job applications.

## ✨ Key Features

### 🔐 Authentication & Security

- JWT-based authentication with secure token management
- Password hashing with bcryptjs (10 salt rounds)
- Protected routes and API endpoints
- CORS configuration with dynamic origins
- Input validation and error handling

### 📄 Resume Management

- **Multi-format support**: Upload PDF and DOCX files
- **AI-powered parsing**: Extract name, email, phone, location, skills, and experience using Google Gemini
- **Version control**: Maintain multiple resume versions
- **Resume generation**: Create PDF resumes from parsed data
- **File optimization**: Automatic file size and type validation

### 💼 Job Application Tracking

- Track job applications with detailed status management
- Status workflow: Applied → Shortlisted → Interview → Offer/Rejected
- Associate resumes with applications
- Add notes and track portal details
- Dashboard analytics and statistics

### 📊 Dashboard & Analytics

- User statistics and metrics
- Job application overview
- Resume management interface
- Quick access to key information

## 📁 Project Structure

```
TrackFolio/
├── backend/                  # Express.js + MongoDB backend
│   ├── config/
│   │   └── db.js             # MongoDB connection setup
│   ├── controllers/          # Business logic
│   │   ├── authController.js # User registration & login
│   │   ├── resumeController.js # Resume upload, parsing & generation
│   │   ├── applicationController.js # Job application CRUD
│   │   └── dashboardController.js # Dashboard metrics
│   ├── middleware/
│   │   ├── authMiddleware.js # JWT verification
│   │   └── uploadMiddleware.js # File upload handling
│   ├── models/
│   │   ├── User.js           # User schema with validation
│   │   ├── Resume.js         # Resume schema with AI parsing
│   │   └── JobApplication.js # Application tracking schema
│   ├── routes/
│   │   ├── auth.js           # Authentication endpoints
│   │   ├── resumes.js        # Resume management endpoints
│   │   ├── applications.js   # Job application endpoints
│   │   └── dashboard.js      # Dashboard endpoints
│   ├── uploads/              # Uploaded files storage
│   ├── index.js              # Express server entry point
│   ├── ai.cjs                # Gemini AI utility functions
│   ├── .env                  # Backend environment variables
│   └── package.json
│
├── frontend/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── ResumeCard.jsx
│   │   │   ├── ApplicationCard.jsx
│   │   │   ├── ApplicationFormModal.jsx
│   │   │   ├── UploadResumeModal.jsx
│   │   │   ├── ResumePDFTemplate.jsx
│   │   │   ├── ResumeDetailsPanel.jsx
│   │   │   ├── FloatingResolverButton.jsx
│   │   │   └── StatCard.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Global auth state management
│   │   ├── hooks/
│   │   │   └── useAuth.js      # Custom auth hook
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── NewDashboardPage.jsx
│   │   │   └── ApplicationsPage.jsx
│   │   ├── utils/
│   │   │   └── api.js          # Axios API client with interceptors
│   │   ├── App.jsx             # Main app with routing
│   │   ├── main.jsx            # React entry point with providers
│   │   ├── index.css           # Global styles
│   │   └── App.css
│   ├── public/                 # Static assets
│   ├── .env                    # Frontend environment variables
│   ├── package.json
│   ├── vite.config.js          # Vite configuration
│   └── eslint.config.js        # ESLint configuration
│
├── back/ & front/              # Legacy versions (deprecated)
├── .gitignore                  # Git ignore rules
└── README.md                   # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** v16 or higher
- **MongoDB** (local instance or MongoDB Atlas cloud)
- **npm** or **yarn**
- **Google Gemini API Key** (for resume parsing with AI)

### 1. Clone or Extract Project

```bash
# Navigate to project directory
cd TrackFolio
```

### 2. Install Dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd frontend
npm install
```

### 3. Configure Environment Variables

#### Backend (`backend/.env`)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/TrackFolio
# OR for local MongoDB: mongodb://localhost:27017/TrackFolio

# Authentication
JWT_SECRET=your_super_secret_jwt_key_change_in_production_min_32_chars
JWT_EXPIRY=7d

# CORS Configuration
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# AI Integration (Google Gemini)
GEMINI_API_KEY=your_google_gemini_api_key
```

**⚠️ Important Security Notes:**

- Never commit `.env` files to version control
- Change `JWT_SECRET` to a random 32+ character string in production
- Get `GEMINI_API_KEY` from [Google AI Studio](https://aistudio.google.com/app/apikey)
- For MongoDB Atlas: [Create cluster and get connection string](https://www.mongodb.com/cloud/atlas)

#### Frontend (`frontend/.env`)

```env
# API Configuration
VITE_API_URL=http://localhost:5000
```

### 4. Start MongoDB

**Option A: Local MongoDB**

```bash
mongod
```

**Option B: MongoDB Atlas (Cloud)**

- No setup needed, just use connection string in `MONGO_URI`

### 5. Run the Application

**Terminal 1 - Start Backend**

```bash
cd backend
npm run dev
```

Backend server starts on **http://localhost:5000**

**Terminal 2 - Start Frontend**

```bash
cd frontend
npm run dev
```

Frontend starts on **http://localhost:5173**

### 6. Access the Application

Open http://localhost:5173 in your browser

---

## 🔐 Authentication & Authorization Flow

### User Registration
1. User completes registration form with required fields
2. Backend validates all inputs (email format, password strength)
3. Password is hashed with bcryptjs (10 salt rounds)
4. User document created in MongoDB
5. JWT token generated and returned
6. Token stored in localStorage, user redirected to dashboard

### User Login
1. User submits email and password
2. Backend validates credentials
3. Password verified using bcryptjs compare
4. JWT token generated with 7-day expiry
5. Token automatically included in all subsequent requests

### Protected Resources
- All API routes require valid JWT token
- Token passed in `Authorization: Bearer <token>` header
- Invalid/expired tokens trigger automatic logout
- User redirected to login page

---

## 📡 API Endpoints

### 🔒 Authentication Endpoints

#### `POST /api/auth/register`
Register a new user account

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "college": "MIT",
  "branch": "Computer Science",
  "graduationYear": 2024
}
```

**Success (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### `POST /api/auth/login`
Authenticate user and get JWT token

**Request:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Success (200):**
```json
{
  "success": true,
  "message": "Logged in successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

### 📄 Resume Management Endpoints

#### `POST /api/resumes/upload`
Upload and parse a resume file (PDF or DOCX)

**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: multipart/form-data
```

**Form Data:**
- `file`: Resume file (PDF or DOCX)
- `label`: Resume label/title (e.g., "SDE Position", "Internship")

**Success (201):**
```json
{
  "success": true,
  "message": "Resume uploaded and parsed successfully",
  "resume": {
    "_id": "507f1f77bcf86cd799439012",
    "label": "SDE Position",
    "fileName": "resume.pdf",
    "fileType": "pdf",
    "fileSize": 245678,
    "version": 1,
    "uploadedAt": "2024-04-22T10:30:00Z",
    "parsedDetails": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1-555-0123",
      "location": "San Francisco, CA",
      "skills": ["JavaScript", "React", "Node.js", "MongoDB"],
      "experience": "3 years in full-stack development"
    }
  }
}
```

#### `GET /api/resumes`
Get all resumes for the logged-in user

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Success (200):**
```json
{
  "success": true,
  "resumes": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "label": "SDE Position",
      "fileName": "resume.pdf",
      "fileType": "pdf",
      "fileSize": 245678,
      "version": 1,
      "isActive": true,
      "uploadedAt": "2024-04-22T10:30:00Z"
    }
  ]
}
```

#### `GET /api/resumes/:id` | `PUT /api/resumes/:id` | `DELETE /api/resumes/:id`
Get, update, or delete a specific resume

#### `POST /api/resumes/:id/generate-pdf`
Generate a formatted PDF from resume data

---

### 💼 Job Application Endpoints

#### `POST /api/applications`
Create a new job application entry

**Request:**
```json
{
  "companyName": "Google",
  "jobRole": "Senior Software Engineer",
  "appliedDate": "2024-04-20",
  "portalUsed": "LinkedIn",
  "status": "Applied",
  "resumeId": "507f1f77bcf86cd799439012"
}
```

**Success (201):**
```json
{
  "success": true,
  "message": "Application created successfully",
  "application": {
    "_id": "507f1f77bcf86cd799439013",
    "companyName": "Google",
    "jobRole": "Senior Software Engineer",
    "status": "Applied",
    "appliedDate": "2024-04-20"
  }
}
```

#### `GET /api/applications`
Get all job applications with optional filtering

#### `PUT /api/applications/:id`
Update application status and notes

#### `DELETE /api/applications/:id`
Delete an application

---

### 📊 Dashboard Endpoints

#### `GET /api/dashboard`
Get user dashboard statistics and metrics

**Success (200):**
```json
{
  "success": true,
  "stats": {
    "totalApplications": 15,
    "applicationsApplied": 10,
    "applicationsShortlisted": 3,
    "applicationsInterview": 1,
    "totalResumes": 3
  }
}
```

---

## 🏗️ Frontend Architecture

### State Management
- **AuthContext**: Global authentication state management
- Uses Context API with localStorage persistence
- Auto-restores user session on page reload

### Custom Hooks
- **useAuth()**: Access auth state and functions anywhere

### Key Components
- **ProtectedRoute**: Authentication-required route wrapper
- **Navbar & Sidebar**: Navigation interface
- **ResumeCard**: Resume file management
- **ApplicationCard**: Job application tracking
- **ResumePDFTemplate**: PDF rendering with @react-pdf/renderer
- **UploadResumeModal**: Resume upload interface
- **FloatingResolverButton**: AI-powered resume assistant

### API Client
- Axios with JWT token injection
- Automatic 401 error handling
- Base URL from `VITE_API_URL`

---

## 📦 Core Dependencies

### Backend
- **express**: REST API framework
- **mongoose**: MongoDB ODM
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication
- **@google/genai**: Google Gemini AI integration
- **multer**: File upload handling
- **pdf-parse**: PDF text extraction
- **mammoth**: DOCX text extraction
- **html-to-docx**: Document generation
- **cors**: Cross-Origin Resource Sharing

### Frontend
- **react**: UI library
- **react-router-dom**: Client-side routing
- **axios**: HTTP client
- **@react-pdf/renderer**: PDF generation
- **framer-motion**: Animations
- **lucide-react**: Icon library
- **vite**: Build tool

---

## 🎯 Workflow: User Journey

1. **Register** → Provide name, email, password
2. **Login** → Authenticate and get JWT token
3. **Upload Resume** → PDF/DOCX → AI parses content
4. **Track Applications** → Add job applications with status
5. **View Dashboard** → Statistics and application overview
6. **Generate Resume** → Create formatted PDF version

---

## 🧪 Testing the Application

### 1. Test in Browser
- Open http://localhost:5173
- Register a new account
- Upload a resume (PDF or DOCX)
- Create job applications
- Track status updates

### 2. Using cURL (Backend Testing)

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","college":"Test","branch":"CS","graduationYear":2024}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

## 🔧 Available Scripts

### Backend
```bash
npm run dev      # Start with auto-reload (node --watch)
npm start        # Production mode
```

### Frontend
```bash
npm run dev      # Vite dev server
npm run build    # Production build
npm run preview  # Preview build
npm run lint     # ESLint check
```

---

## 🚀 Deployment Guide

### Backend Deployment (Render, Railway, Heroku)

1. Set environment variables:
   - `MONGO_URI`: MongoDB Atlas connection string
   - `JWT_SECRET`: Strong random 32+ character string
   - `GEMINI_API_KEY`: Google Gemini API key
   - `CORS_ORIGINS`: Include your frontend URL
   - `NODE_ENV`: Set to production

2. Deploy from GitHub or upload

3. Verify endpoints are accessible

### Frontend Deployment (Vercel, Netlify)

1. Update `VITE_API_URL` to your backend URL
2. Run `npm run build`
3. Deploy the `dist` folder
4. Configure environment variables in platform

---

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Verify `MONGO_URI` is correct
- Check MongoDB service is running (local) or Atlas is accessible
- Ensure IP is whitelisted in MongoDB Atlas

### GEMINI_API_KEY Errors
- Get key from [Google AI Studio](https://aistudio.google.com/app/apikey)
- Ensure key is valid and not expired
- Check API quota limits

### Resume Upload Fails
- Verify file is PDF or DOCX (check `fileType`)
- Check file size limits
- Ensure `uploads/` directory exists and is writable
- Verify Multer configuration in uploadMiddleware.js

### Frontend Not Connecting to Backend
- Check `VITE_API_URL` matches running backend
- Verify CORS is configured correctly
- Check browser console for network errors

### JWT Token Expired
- Login again to get new token
- Token expiry set in `JWT_EXPIRY` (default 7 days)
- Clear localStorage if experiencing persistent issues

---

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Please submit a Pull Request with improvements.

---

**✅ Ready to go!** Start both servers and begin managing your resume and job applications. Good luck! 🚀
