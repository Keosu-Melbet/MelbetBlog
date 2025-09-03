# BlogCMS - Modern Blog Platform

## Overview

BlogCMS is a modern blog platform with a full-stack architecture featuring a React frontend with shadcn/ui components and an Express.js backend. The application provides both public blog viewing and an admin dashboard for content management. It includes features like image upload, post creation/editing, and publishing workflows with a sleek dark-themed UI inspired by Melbet's design aesthetic.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite for build tooling
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom dark theme and CSS variables
- **Routing**: Wouter for client-side routing (lightweight React router)
- **State Management**: TanStack Query (React Query) for server state management
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Server Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for schema management and queries
- **Database Provider**: Neon serverless PostgreSQL
- **File Storage**: Local file system for image uploads with multer middleware
- **API Design**: RESTful API with JSON responses
- **Session Management**: Configured for PostgreSQL session storage

### Database Schema
- **Users Table**: Basic user authentication with username/password
- **Posts Table**: Blog posts with title, content, image URL, publication status, and timestamps
- **Schema Management**: Drizzle Kit for migrations and schema generation

### Authentication & Authorization
- Session-based authentication setup (implementation in progress)
- Admin-only routes for post management
- Public routes for blog viewing

### File Upload System
- **Image Processing**: Multer for handling multipart/form-data uploads
- **Storage Location**: `/client/uploads` directory
- **Validation**: Image file type validation with 5MB size limit
- **Serving**: Express static middleware for uploaded images

### Development Environment
- **Hot Reload**: Vite HMR for frontend development
- **Development Server**: Integrated Express server with Vite middleware
- **Build Process**: Separate build commands for client and server
- **Database Management**: Drizzle push commands for schema updates

### Key Design Patterns
- **Separation of Concerns**: Clear separation between client, server, and shared code
- **Type Safety**: Full TypeScript implementation across the stack
- **Component-Based Architecture**: Modular React components with shadcn/ui
- **Repository Pattern**: Database operations abstracted through storage interfaces
- **Error Handling**: Centralized error handling with user-friendly toast notifications

## External Dependencies

### Database & Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting with WebSocket support
- **Drizzle ORM**: TypeScript ORM with PostgreSQL dialect

### UI & Styling
- **Radix UI**: Unstyled, accessible UI primitives for all interactive components
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Lucide React**: Icon library for consistent iconography
- **Google Fonts**: Inter font family for typography

### Development & Build Tools
- **Vite**: Frontend build tool with React plugin
- **ESBuild**: Fast bundling for server-side code
- **TSX**: TypeScript execution for development server
- **PostCSS**: CSS processing with Autoprefixer

### Runtime & Utilities
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form state management with validation
- **Zod**: Schema validation for form data and API payloads
- **Date-fns**: Date manipulation and formatting
- **Class Variance Authority**: Utility for managing component variants
- **Wouter**: Lightweight routing solution

### Replit Integration
- **Runtime Error Overlay**: Development error handling
- **Cartographer Plugin**: Replit-specific development tools