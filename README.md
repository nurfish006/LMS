# Bahir Dar University LMS

A comprehensive Learning Management System built with Next.js 15, React 19, and MongoDB.

## Features

- **Multi-role Authentication**: Student, Teacher, Admin, and Department Head roles
- **Course Management**: Create, manage, and enroll in courses
- **Materials & Assignments**: Upload materials and submit assignments
- **Messaging System**: Direct messaging between users
- **News & Announcements**: Admin-published news and updates
- **File Upload**: Cloud-based file storage with Vercel Blob
- **Dark/Light Mode**: Theme toggle support

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS v4
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Vercel Blob
- **Icons**: Lucide React

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

\`\`\`env
# MongoDB Connection
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority

# JWT Secret (generate a secure random string)
JWT_SECRET=your-super-secure-jwt-secret-key-here

# Vercel Blob (for file uploads)
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxx
\`\`\`

## Getting Environment Variables

### 1. MongoDB URI

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster (free tier available)
3. Click **Connect** → **Connect your application**
4. Copy the connection string
5. Replace `<username>`, `<password>`, and `<database>` with your credentials

### 2. JWT Secret

Generate a secure random string using one of these methods:

\`\`\`bash
# Using OpenSSL
openssl rand -hex 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
\`\`\`

### 3. Vercel Blob Token

**Option A: Via Vercel Dashboard (Recommended for Production)**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project or create a new one
3. Navigate to **Storage** tab
4. Click **Create Database** → Select **Blob**
5. Follow the setup wizard
6. The `BLOB_READ_WRITE_TOKEN` will be automatically added to your project's environment variables

**Option B: Via Vercel CLI**

\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Create Blob store
vercel blob create my-lms-storage

# Pull environment variables
vercel env pull .env.local
\`\`\`

## Installation

### Local Development

\`\`\`bash
# Clone the repository
git clone https://github.com/nurfish006/LMS.git
cd LMS

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Run the development server
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com/new)
3. Import your repository
4. Add environment variables in the Vercel dashboard:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `BLOB_READ_WRITE_TOKEN` (auto-added if you create Blob storage)
5. Click **Deploy**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/nurfish006/LMS)

## Default User Roles

After registration, users are assigned the **student** role by default. To create admin or teacher accounts:

1. Register a new user
2. Connect to your MongoDB database
3. Update the user's role:

\`\`\`javascript
// In MongoDB Shell or Compass
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
\`\`\`

Available roles: `student`, `teacher`, `admin`, `department_head`

## Project Structure

\`\`\`
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── admin/
│   │   ├── messages/
│   │   ├── news/
│   │   └── users/
│   ├── api/
│   │   ├── auth/
│   │   ├── courses/
│   │   ├── materials/
│   │   ├── messages/
│   │   ├── news/
│   │   ├── submissions/
│   │   ├── upload/
│   │   └── users/
│   ├── student/
│   │   ├── assignments/
│   │   ├── courses/
│   │   ├── messages/
│   │   ├── news/
│   │   └── profile/
│   └── teacher/
│       ├── assignments/
│       ├── courses/
│       ├── materials/
│       ├── messages/
│       └── news/
├── components/
│   ├── ui/
│   ├── admin-nav.tsx
│   ├── auth-provider.tsx
│   ├── file-upload.tsx
│   ├── student-nav.tsx
│   ├── teacher-nav.tsx
│   └── theme-toggle.tsx
├── lib/
│   ├── auth.ts
│   ├── models.ts
│   └── mongodb.ts
└── public/
\`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Courses
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create course (teacher/admin)

### Materials
- `GET /api/materials` - Get materials
- `POST /api/materials` - Upload material (teacher)

### Assignments
- `GET /api/assignments` - Get assignments
- `POST /api/assignments` - Create assignment (teacher)

### Submissions
- `GET /api/submissions` - Get submissions
- `POST /api/submissions` - Submit assignment (student)
- `POST /api/submissions/[id]/grade` - Grade submission (teacher)

### Messages
- `GET /api/messages` - Get messages/conversations
- `POST /api/messages` - Send message

### News
- `GET /api/news` - Get news articles
- `POST /api/news` - Create news (admin)
- `DELETE /api/news/[id]` - Delete news (admin)

### Users
- `GET /api/users` - Get users (admin)
- `DELETE /api/users/[id]` - Delete user (admin)

### File Upload
- `POST /api/upload` - Upload file to Vercel Blob
- `DELETE /api/upload` - Delete file from Vercel Blob

## License

MIT License - feel free to use this project for educational purposes.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
