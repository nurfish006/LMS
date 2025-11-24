# Woldia University E-Learning System (WDUELS)

## Project Overview
This is a comprehensive web-based Learning Management System (LMS) for Woldia University that enables students to access course materials, submit assignments, and communicate with instructors. The platform supports multiple user roles: students, teachers, department heads, and administrators.

## Recent Changes
**November 24, 2025**
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
- `/components` - Reusable React components and UI primitives
- `/lib` - Utility functions, database connection, models, auth
- `/public` - Static assets (images, icons)
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

## Deployment Configuration
Configured for autoscale deployment suitable for the stateless Next.js application. MongoDB connection required for full functionality.

## User Preferences
- None documented yet

## Notes
- TypeScript build errors are currently ignored (ignoreBuildErrors: true)
- Images are unoptimized for faster development
- Using Turbopack (Next.js 16 default)
- The application binds to 0.0.0.0:5000 to work with Replit's proxy system
