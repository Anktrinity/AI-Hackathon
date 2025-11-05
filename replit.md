# Overview

This is a full-stack web application built with React and Express that has evolved from a template marketplace into an AI Task Manager specifically designed for hackathon event management. The application features a modern UI built with shadcn/ui components, user authentication via Replit's OIDC system, and a comprehensive task management system integrated with Slack for team collaboration.

**Key Features:**
- **Team Collaboration Mode**: Shared workspace for authorized teams (like Wellness Awards 2025) with per-user activity tracking
- **Individual Sandbox Mode**: Isolated workspaces for most users with personal task management
- **Comprehensive Access Control**: Template-based permissions with collaboration mode support
- **Per-User Progress Tracking**: Slack automation showing individual contributions in team projects
- **Dashboard View Toggle**: Switch between team-wide and personal task views for collaboration projects
- **Slack Progress Notifications**: Status-change based notifications (not creation) with old→new status transitions
- **Unified Delete Functionality**: Task deletion available on both Tasks and Dashboard pages with confirmation dialogs

# Recent Changes (November 2025)

## Slack Notifications Refactored (Nov 5, 2025)
- **Removed creation notifications**: Slack messages no longer sent when tasks are created
- **Progress-only notifications**: Now only sends Slack messages on status changes (in_progress, completed, blocked)
- **Status transitions shown**: Messages display old→new status for clear progress tracking
- **Wellness task detection**: Enhanced logic identifies wellness tasks by templateId='wellness-awards' OR authorized email allowlist

## Dashboard Delete Functionality (Nov 5, 2025)
- **Delete buttons added**: Trash icon buttons on all task cards in Recent Tasks section
- **Confirmation dialogs**: AlertDialog with Cancel/Delete actions prevents accidental deletions
- **Cache invalidation**: Proper invalidation of /api/tasks and /api/status queries
- **Consistent UX**: Matches delete functionality on Tasks page

## Assignment Field Resolution (Nov 4, 2025)
- **Task interface extended**: Added assigneeEmail, assigneeUserId, assigneeSlackId fields
- **UI rendering fixed**: Task cards now properly display assignee information
- **Type safety improved**: Full type definitions prevent future rendering issues

# User Preferences

**Communication Style:** Simple, everyday language.

**Daily Reporting:** Provide ONE comprehensive technical project report at 8 PM each day, including:
- Major accomplishments and wins
- All errors encountered and how they were resolved
- Technical challenges and solutions
- Bugs fixed with severity ratings
- Code changes and files modified
- Lessons learned
- Metrics and impact assessment
- Root cause analysis for major issues
- Recommendations for next session
- Session statistics (time, LOC changed, systems improved)

**Report Format:** Markdown file named `DEVELOPMENT_REPORT_[DATE].md` with full technical details suitable for team reviews and documentation.

# System Architecture

## Frontend Architecture

The frontend is built using a modern React stack with TypeScript, featuring:

- **React with TypeScript**: Core UI framework using functional components and hooks
- **Wouter**: Lightweight client-side routing solution
- **Vite**: Build tool and development server providing fast hot reload
- **shadcn/ui Components**: Comprehensive UI component library built on Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens and theming
- **TanStack React Query**: Server state management and data fetching with caching
- **Stripe Integration**: Payment processing capabilities (legacy from template marketplace)

The application follows a component-based architecture with clear separation between pages, reusable UI components, and utility functions. The routing system supports both authenticated and guest modes.

## Backend Architecture

The backend is implemented as an Express.js server with TypeScript support:

- **Express.js**: Web application framework handling HTTP requests and middleware
- **TypeScript**: Type safety and better developer experience
- **Modular Route Structure**: Separate route handlers for authentication, tasks, and legacy endpoints
- **Session Management**: Express sessions with PostgreSQL storage for user authentication
- **Task Management System**: RESTful API endpoints for CRUD operations on tasks and projects

## Authentication System

User authentication is handled through Replit's OpenID Connect (OIDC) system:

- **Replit OIDC Integration**: Seamless authentication for Replit users
- **Passport.js**: Authentication middleware for handling OAuth flows
- **Session-based Authentication**: Secure session management with PostgreSQL storage
- **Guest Mode Support**: Optional guest access for demo purposes

## Data Storage Solutions

The application uses a PostgreSQL database with Drizzle ORM:

- **PostgreSQL with Neon**: Cloud-hosted PostgreSQL database for production
- **Drizzle ORM**: Type-safe database toolkit with schema definition and migrations
- **Schema Design**: Comprehensive schema supporting tasks, teams, Slack users, projects, and analytics
- **Database Connection**: Connection pooling via Neon's serverless driver

Key database entities include:
- **app_users**: Replit authenticated users with email, displayName, and optional Slack identity mapping
- **tasks**: Comprehensive task tracking with:
  - User attribution: creatorUserId, creatorEmail, completedByUserId, completedByEmail
  - Assignment tracking: assigneeUserId, assigneeEmail, assigneeSlackId, assigneeName
  - Template association: templateId for access control and collaboration mode
  - Priority, status, category, due dates, and dependencies
- **teams**: Slack workspace integration with bot tokens
- **slack_users**: Slack team member profiles
- **projects**: Event organization and timeline management
- **gap_analysis**: Project planning and requirements tracking
- **sessions**: Authentication session storage

## Team Collaboration Mode

The application supports two distinct operational modes:

### Individual Sandbox Mode (Default)
- Each user has an isolated workspace with their own tasks
- Tasks are scoped to the user via assigneeSlackId or signupId
- Full data isolation between users
- Suitable for most beta testers and individual users

### Team Collaboration Mode (Wellness Awards 2025)
- **Shared Workspace**: One Replit app instance with one database for the entire team
- **Authorized Team Members**: 
  - ari@eventmarketingauthority.com
  - treefanevents@gmail.com
  - ariadni@olympianmeeting.com
  - david@eventmarketingauthority.com
  - david@olympianmeeting.com
- **Per-User Activity Tracking**: 
  - Tasks capture creator (creatorUserId/creatorEmail) on creation
  - Tasks capture assignee (assigneeUserId/assigneeEmail) when assigned
  - Tasks capture completer (completedByUserId/completedByEmail) on completion
- **Access Control**: 
  - Template-based permissions using hasTemplateAccess() helper
  - Checks collaborationMode flag and authorizedEmails list
  - Applied to all CRUD endpoints (GET/POST/PUT/DELETE)
  - Returns 403 Forbidden for unauthorized access attempts
- **Dashboard View Toggle**:
  - **Team View**: Shows all tasks for the project (default)
  - **My Tasks View**: Filters to show only tasks created, assigned to, or completed by the current user
  - Uses strict exact matching (email, displayName, Slack ID) to prevent false positives
- **Slack Progress Reporting**:
  - Daily standup and weekly reports group tasks by completedByEmail
  - Shows per-user completion stats and individual contributor recognition
  - Graceful fallbacks for tasks without user attribution

## External Dependencies

### Third-party Services
- **Neon Database**: PostgreSQL hosting and serverless database connections
- **Replit Authentication**: OIDC provider for user authentication
- **Stripe**: Payment processing (legacy functionality)

### Key NPM Dependencies
- **Database**: `@neondatabase/serverless`, `drizzle-orm`, `drizzle-kit`
- **Authentication**: `passport`, `openid-client`, `express-session`
- **UI Framework**: `react`, `@radix-ui/*`, `tailwindcss`, `class-variance-authority`
- **Build Tools**: `vite`, `typescript`, `tsx`, `esbuild`
- **Development**: `@replit/vite-plugin-*` for Replit-specific tooling

### Planned Integrations
- **Slack Bot SDK**: `@slack/bolt` (referenced in dependencies for future Slack integration)
- **OpenAI**: AI-powered task generation and management capabilities
- **WebSocket**: Real-time updates for dashboard and task synchronization

The architecture supports both the legacy template marketplace functionality and the new AI Task Manager features, with clear separation between old and new endpoints to maintain backward compatibility while enabling new functionality.