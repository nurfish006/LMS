# Woldia University E-Learning System (WDUELS)

## Project Overview
This is a comprehensive web-based Learning Management System (LMS) for Woldia University that enables students to access course materials, submit assignments, and communicate with instructors. The platform supports multiple user roles: students, teachers, department heads, and administrators.

## Recent Changes
**November 24, 2025 - Latest Session**
- Implemented secure file upload system with UUID-based tokens
- Added `uploads` collection to track file metadata
- Updated materials and submissions APIs to support file uploads
- Created secure download API with record-level authorization
- Updated frontend pages to properly handle file downloads
- Fixed messaging system to display user names correctly (firstName + lastName)
- Implemented Telegram-like messaging UI (sender on right, receiver on left)
- Added fallback handling for users without firstName/lastName in messaging
- Added backwards compatibility for legacy file URLs and paths
- Files stored outside web root for security (new uploads)

**November 24, 2025 - Initial Setup**
- Configured project for Replit environment
- Set up Next.js dev server on port 5000 with host 0.0.0.0
- Configured Next.js 16 to use Turbopack
- Set up environment variables (JWT_SECRET, NEXT_PUBLIC_APP_URL)
- Installed all npm dependencies
- Workflow configured for development server

## Technology Stack

### Frontend
- **Framework**: Next.js 15 (App Router) - upgraded to 16.0.3
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui with Radix UI primitives
- **Icons**: Lucide React
- **State Management**: React Context API
- **Form Handling**: React Hook Form with Zod validation

### Backend
- **Runtime**: Node.js
- **Framework**: Next.js API Routes
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

### Database
- **Database**: MongoDB (requires connection string)
- **ODM**: Native MongoDB Node.js Driver

## Project Architecture

### Key Features
1. **Student Portal**: View courses, download materials, submit assignments, messaging
2. **Teacher Portal**: Create courses, upload materials, manage assignments, grading
3. **Admin Dashboard**: User management, news publishing, system statistics
4. **Department Head**: Departmental oversight and management

### File Structure
- `/app` - Next.js app router pages and API routes
  - `/app/api/upload` - Secure file upload endpoint
  - `/app/api/download` - Secure file download endpoint with authorization
  - `/app/api/materials` - Course materials management
  - `/app/api/submissions` - Assignment submissions management
  - `/app/api/messages` - Messaging system
- `/components` - Reusable React components and UI primitives
- `/lib` - Utility functions, database connection, models, auth
- `/public` - Static assets (images, icons)
- `/uploads` - Secure file storage (outside web root, gitignored)
- `/scripts` - Database initialization scripts

## Environment Setup

### Required Environment Variables
- `MONGODB_URI` - MongoDB connection string (required, not yet configured)
- `JWT_SECRET` - Secret key for JWT token generation (configured)
- `NEXT_PUBLIC_APP_URL` - Public URL for the application (configured)

### Database Setup
The application requires a MongoDB database. Once connected, run the initialization script to create the admin user:
```bash
MONGODB_URI=<your-connection-string> node scripts/init-admin.js
```

Default admin credentials:
- Email: admin@woldia.edu.et
- Password: admin123

## Development

### Running the Application
The workflow is configured to run:
```bash
npm run dev
```
This starts the Next.js server on port 5000 at 0.0.0.0.

### Database Collections
- `users` - User accounts (students, teachers, admins, heads)
- `courses` - Course information
- `materials` - Course materials and files
- `assignments` - Assignment details
- `submissions` - Student assignment submissions
- `messages` - User messages
- `news` - University announcements
- `uploads` - File upload metadata and tokens (new secure system)

### File Upload System
The application uses a secure token-based file upload system:
- Files uploaded through `/api/upload` receive unique UUID tokens
- Upload metadata stored in `uploads` collection with expiration (24hrs)
- Tokens are one-time use and linked to database records
- Files stored in `/uploads` directory (outside web root)
- Downloads require record IDs (materialId/submissionId) for authorization
- Backwards compatible with legacy HTTP URLs and `/uploads/...` paths

**Security Features:**
- 50MB file size limit
- MIME type validation (PDF, Word, PowerPoint, ZIP, video, audio)
- File extension validation
- Role-based upload permissions
- Record-level download authorization
- UUID-based filenames prevent file enumeration
- Safe HTTP headers (Content-Type, Content-Disposition, nosniff)

## Deployment Configuration
Configured for autoscale deployment suitable for the stateless Next.js application. MongoDB connection required for full functionality.

## User Preferences
- None documented yet

## Notes
- TypeScript build errors are currently ignored (ignoreBuildErrors: true)
- Images are unoptimized for faster development
- Using Turbopack (Next.js 16 default)
- The application binds to 0.0.0.0:5000 to work with Replit's proxy system
- Admin user updated with firstName="Admin" and lastName="User"
- Messaging system displays sender names with fallback to email for users without firstName/lastName
- File uploads stored in `/uploads` directory (gitignored)
- Both new secure token system and legacy URL-based uploads supported simultaneously

## Known Limitations
- Course enrollment checking not implemented (all authenticated users can access all materials)
- For production use, consider:
  - Implementing course enrollment validation
  - Adding virus scanning for uploaded files
  - Setting up automated cleanup of expired upload tokens
  - Implementing file versioning for materials
  - Adding file preview functionality
