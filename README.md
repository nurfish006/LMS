# Woldia University E-Learning System (WDUELS)

A comprehensive web-based Learning Management System (LMS) designed for Woldia University to enhance education through digital innovation. This platform enables students to access course materials, submit assignments, and communicate with instructors anytime, anywhere.

## Features

### For Students
- View and enroll in courses by department
- Download course materials and lecture notes
- Submit assignments online
- Track assignment deadlines and grades
- Real-time messaging with instructors and peers
- View university news and announcements
- Manage personal profile

### For Teachers
- Create and manage courses
- Upload course materials (documents, videos, etc.)
- Create and manage assignments
- Grade student submissions
- View submitted assignments by course
- Communicate with students via messaging
- Publish course announcements

### For Administrators
- Manage user accounts (students, teachers, heads)
- Create, update, and delete user accounts
- Publish university-wide news and announcements
- View system statistics and analytics
- Manage departments and courses
- Monitor system activity

### For Department Heads
- Oversee departmental courses
- Manage course content within their department
- View departmental statistics
- Publish department-specific news

## Technology Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **State Management**: React Context API
- **Form Handling**: React Hook Form (recommended)

### Backend
- **Runtime**: Node.js
- **Framework**: Next.js API Routes
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

### Database
- **Database**: MongoDB
- **ODM**: Native MongoDB Node.js Driver

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js**: Version 18.x or higher
- **npm** or **yarn**: Latest version
- **MongoDB**: Version 5.x or higher (local installation or MongoDB Atlas account)
- **Git**: For version control

## Environment Setup

### 1. Clone the Repository

\`\`\`bash
git clone <repository-url>
cd woldia-university-els
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
# or
yarn install
\`\`\`

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory of the project and add the following environment variables:

\`\`\`env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/wduels
# For MongoDB Atlas, use:
# MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/wduels?retryWrites=true&w=majority

# JWT Secret (generate a random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

#### Generating a Secure JWT Secret

To generate a secure random JWT secret, run:

\`\`\`bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
\`\`\`

### 4. Set Up MongoDB

#### Option A: Local MongoDB Installation

1. Install MongoDB Community Edition from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start the MongoDB service:
   \`\`\`bash
   # macOS (with Homebrew)
   brew services start mongodb-community
   
   # Linux (systemd)
   sudo systemctl start mongod
   
   # Windows
   # MongoDB runs as a service after installation
   \`\`\`
3. Verify MongoDB is running:
   \`\`\`bash
   mongosh
   \`\`\`

#### Option B: MongoDB Atlas (Cloud)

1. Create a free account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Add your IP address to the IP whitelist (or use 0.0.0.0/0 for development)
4. Create a database user with read/write permissions
5. Get your connection string and update `MONGODB_URI` in `.env.local`

### 5. Initialize the Database

The application will automatically create the necessary collections on first run. However, you need to create an initial admin account.

#### Create Initial Admin User

Run the database initialization script:

\`\`\`bash
node scripts/init-admin.js
\`\`\`

Or manually create an admin user through MongoDB:

\`\`\`javascript
// Connect to MongoDB
mongosh "mongodb://localhost:27017/wduels"

// Create admin user
db.users.insertOne({
  name: "System Admin",
  email: "admin@woldia.edu.et",
  password: "$2a$10$X4qE.YqhpJJ7VX3g5F0Qce7KZQzQXJXxXxXxXxXxXxXxXxXxXx", // hashed "admin123"
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date()
})
\`\`\`

Default credentials:
- **Email**: admin@woldia.edu.et
- **Password**: admin123 (change immediately after first login)

### 6. Run the Development Server

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

### Users Collection
\`\`\`javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: "student", "teacher", "admin", "head"),
  department: String (optional),
  year: Number (for students),
  semester: Number (for students),
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

### Courses Collection
\`\`\`javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  code: String,
  department: String,
  teacherId: ObjectId (ref: users),
  teacherName: String,
  semester: Number,
  year: Number,
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

### Materials Collection
\`\`\`javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  courseId: ObjectId (ref: courses),
  courseName: String,
  fileUrl: String,
  fileType: String,
  uploadedBy: ObjectId (ref: users),
  uploadedByName: String,
  createdAt: Date
}
\`\`\`

### Assignments Collection
\`\`\`javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  courseId: ObjectId (ref: courses),
  courseName: String,
  dueDate: Date,
  totalMarks: Number,
  createdBy: ObjectId (ref: users),
  createdByName: String,
  createdAt: Date
}
\`\`\`

### Submissions Collection
\`\`\`javascript
{
  _id: ObjectId,
  assignmentId: ObjectId (ref: assignments),
  studentId: ObjectId (ref: users),
  studentName: String,
  fileUrl: String,
  submittedAt: Date,
  grade: Number (optional),
  feedback: String (optional),
  gradedBy: ObjectId (ref: users, optional),
  gradedAt: Date (optional)
}
\`\`\`

### Messages Collection
\`\`\`javascript
{
  _id: ObjectId,
  senderId: ObjectId (ref: users),
  senderName: String,
  senderRole: String,
  content: String,
  createdAt: Date
}
\`\`\`

### News Collection
\`\`\`javascript
{
  _id: ObjectId,
  title: String,
  content: String,
  publishedBy: ObjectId (ref: users),
  publishedByName: String,
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

## Project Structure

\`\`\`
woldia-university-els/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── student/
│   │   ├── courses/
│   │   ├── assignments/
│   │   ├── messages/
│   │   ├── news/
│   │   ├── profile/
│   │   └── page.tsx
│   ├── teacher/
│   │   ├── courses/
│   │   ├── materials/
│   │   ├── assignments/
│   │   ├── messages/
│   │   ├── news/
│   │   ├── profile/
│   │   └── page.tsx
│   ├── admin/
│   │   ├── users/
│   │   ├── news/
│   │   ├── messages/
│   │   └── page.tsx
│   ├── api/
│   │   ├── auth/
│   │   ├── courses/
│   │   ├── materials/
│   │   ├── assignments/
│   │   ├── submissions/
│   │   ├── messages/
│   │   ├── news/
│   │   └── users/
│   ├── about/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   ├── auth-provider.tsx
│   ├── student-nav.tsx
│   ├── teacher-nav.tsx
│   └── admin-nav.tsx
├── lib/
│   ├── mongodb.ts
│   ├── models.ts
│   ├── auth.ts
│   └── utils.ts
├── scripts/
│   └── init-admin.js
├── .env.local
├── package.json
├── next.config.mjs
├── tsconfig.json
└── README.md
\`\`\`

## API Routes

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Courses
- `GET /api/courses` - Get all courses (filtered by role/department)
- `POST /api/courses` - Create new course (teachers only)
- `DELETE /api/courses/[id]` - Delete course (teachers/admin only)

### Materials
- `GET /api/materials` - Get all materials (filtered by course)
- `POST /api/materials` - Upload material (teachers only)
- `DELETE /api/materials/[id]` - Delete material (teachers only)

### Assignments
- `GET /api/assignments` - Get all assignments (filtered by course)
- `POST /api/assignments` - Create assignment (teachers only)
- `DELETE /api/assignments/[id]` - Delete assignment (teachers only)

### Submissions
- `GET /api/submissions` - Get submissions (filtered by assignment/student)
- `POST /api/submissions` - Submit assignment (students only)
- `PUT /api/submissions/[id]/grade` - Grade submission (teachers only)

### Messages
- `GET /api/messages` - Get all messages
- `POST /api/messages` - Send message (all authenticated users)

### News
- `GET /api/news` - Get all news
- `POST /api/news` - Publish news (admin/head only)
- `PUT /api/news/[id]` - Update news (admin/head only)
- `DELETE /api/news/[id]` - Delete news (admin/head only)

### Users
- `GET /api/users` - Get all users (admin only)
- `POST /api/users` - Create user (admin only)
- `DELETE /api/users/[id]` - Delete user (admin only)

## User Roles & Permissions

| Feature | Student | Teacher | Head | Admin |
|---------|---------|---------|------|-------|
| View Courses | ✓ (own dept) | ✓ | ✓ | ✓ |
| Create Course | ✗ | ✓ | ✓ | ✗ |
| Upload Material | ✗ | ✓ | ✓ | ✗ |
| Submit Assignment | ✓ | ✗ | ✗ | ✗ |
| Grade Submission | ✗ | ✓ | ✓ | ✗ |
| Manage Users | ✗ | ✗ | ✗ | ✓ |
| Publish News | ✗ | ✗ | ✓ | ✓ |
| Send Messages | ✓ | ✓ | ✓ | ✓ |

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_APP_URL`
4. Deploy

### Deploy to Other Platforms

The application can be deployed to any platform that supports Next.js:
- **Netlify**: Use the Next.js build plugin
- **Railway**: Connect GitHub and deploy
- **AWS/DigitalOcean**: Use Docker or PM2

## Security Best Practices

1. **Never commit `.env.local`** to version control
2. **Use strong JWT secrets** in production
3. **Enable MongoDB authentication** in production
4. **Use HTTPS** for all production deployments
5. **Implement rate limiting** for API routes
6. **Regularly update dependencies** for security patches
7. **Validate and sanitize** all user inputs
8. **Use environment-specific** MongoDB databases

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongosh`
- Check your `MONGODB_URI` in `.env.local`
- Verify network access if using MongoDB Atlas

### Authentication Issues
- Clear browser cookies and localStorage
- Verify `JWT_SECRET` is set in `.env.local`
- Check if the user exists in the database

### Build Errors
- Delete `.next` folder and `node_modules`
- Run `npm install` again
- Clear npm cache: `npm cache clean --force`

## Contributing

This project was developed as a senior project for Woldia University Computer Science Department by:
- Haymanot Adane (WDU1201098)
- Muaz Umer (WDU1201536)
- Salih Mohammed (WDU1201721)
- Yisehak Mulugeta (WDU1202178)
- Yitayew Ahmed (WDU1202180)

## Support

For issues and questions:
- Check the documentation above
- Review error logs in the console
- Contact the ICT directorate at Woldia University

## License

Copyright © 2023 Woldia University. All rights reserved.
