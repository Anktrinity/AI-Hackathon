# Changelog

All notable changes to AI Task Manager will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-11-05

### Added
- **Dashboard Delete Functionality**: Delete buttons with confirmation dialogs on Recent Tasks section
  - Trash icon buttons on all task cards for quick deletion access
  - AlertDialog confirmation prevents accidental task deletions
  - Proper cache invalidation for /api/tasks and /api/status
  - Consistent delete UX matching Tasks page functionality
  - Data-testid attributes for automated testing

### Changed
- **Slack Notifications Refactored**: Now progress-based instead of creation-based
  - Removed notifications on task creation
  - Only sends Slack messages on status changes (in_progress, completed, blocked)
  - Displays status transitions (e.g., "pending → in_progress") for clarity
  - Enhanced wellness task detection by templateId and authorized email list

### Fixed
- **Assignment Field Resolution**: Extended Task interface with proper assignee fields
  - Added assigneeEmail, assigneeUserId, assigneeSlackId fields
  - Fixed UI rendering issues on task cards
  - Improved type safety throughout application

## [1.9.0] - 2024-11-04

### Added
- **Team Collaboration Mode**: Complete shared workspace functionality
  - One app instance, one database for entire authorized team
  - Template-based authorization system
  - Per-user activity tracking (creator, assignee, completer)
  - Dashboard view toggle (Team View vs My Tasks)
  
- **Template-Based Access Control**
  - Comprehensive permissions preventing unauthorized template access
  - Access enforcement on all CRUD endpoints (GET/POST/PUT/DELETE)
  - 403 Forbidden responses for unauthorized attempts

### Changed
- **Database Schema**: Added assigneeUserId and assigneeEmail fields to tasks table
- **Slack Progress Reports**: Group tasks by user, show individual contributor stats

## [1.8.0] - 2024-10-15

### Added
- **In-App Notification System**
  - Complete notification infrastructure with database schema
  - API endpoints for creating and managing notifications
  - Frontend notification banner component
  - JWT-based user-scoped notifications
  - Bulk notification API for admin users

- **Beta User Engagement**
  - Automated notification campaigns for beta users
  - Feature announcement notifications
  - Reminder notifications

### Changed
- **Encryption Infrastructure**: Secure Slack credential storage with AES-256
- **Custom Domain**: Production deployment at aitaskmanager.pro with SSL/TLS

## [1.7.0] - 2024-09-30

### Fixed
- **Key Insights Analytics**: Fixed calculations to use actual completion timestamps
  - Accurate task duration metrics instead of using current time
  - Precise analytics tracking with auto-timestamp on completion

- **Admin Access**: Resolved login redirect for authenticated admins
  - Properly routes to admin panel instead of demo page

### Changed
- **Analytics UX**: Redesigned Key Insights with improved formatting
  - Bullet-pointed format for better readability
  - Red highlighting for critical items (overdue, bottlenecks, alerts)

- **Status Order Standardization**: Unified across all UI components
  - Consistent order: pending → in_progress → overdue → completed

- **Template Task Ordering**: Fixed chronological sequencing to oldest-first

## [1.6.0] - 2024-08-15

### Added
- **Optimized Smart Templates**: All 6 templates redesigned
  - AI-powered workflows with ChatGPT, MidJourney, NotebookLM
  - Realistic timeframes (15-90 days)
  - Modern productivity patterns

### Changed
- **Enhanced Analytics**: Reduced to 8 key insights for better UX
  - Streamlined dashboard layout
  - Focus on actionable metrics

## [1.5.0] - 2024-07-20

### Added
- **Smart Templates System**
  - 6 professionally crafted templates
  - Pre-defined task structures with priorities
  - One-click task creation
  - Dedicated template pages at /template/:id

- **Template Categories**
  - 30-Day #fit4events Challenge
  - Side Hustle Launch
  - Marketing Campaign Planner
  - Learn a New Skill
  - Creative Project (AI-Driven)
  - Micro Event / Mini Retreat

## [1.4.0] - 2024-06-10

### Added
- **Slack Integration**
  - OAuth-based workspace connection
  - Slash commands (/tasks, /new, /help, /assistant)
  - Real-time task status updates
  - Daily standup and weekly report automation

- **WebSocket Support**: Real-time dashboard updates

### Changed
- **Dashboard UI**: Improved real-time task metrics and visualization

## [1.3.0] - 2024-05-05

### Added
- **Analytics & CRM System**
  - Google Analytics integration (PII-compliant)
  - Internal CRM tracking
  - Conversion funnel analysis
  - Demo user journey tracking
  - A/B testing capabilities

- **8 Key Insights Dashboard**
  - Task duration analysis
  - Timeline forecasts
  - Priority analysis
  - Risk alerts
  - Productivity trends
  - Bottleneck identification
  - Recommendations
  - Slack interaction stats

## [1.2.0] - 2024-04-01

### Added
- **Stripe Integration**: Payment processing for premium features
- **User Tiers**: Free, Basic, and Premium subscription levels

### Changed
- **Authentication**: Enhanced session management with PostgreSQL storage

## [1.1.0] - 2024-03-01

### Added
- **Demo Mode**: Try features without signing up
  - JWT-based authentication
  - Full feature access
  - Isolated demo workspaces

- **Replit OIDC Authentication**
  - Seamless Replit user login
  - Session-based authentication
  - Secure cookie management

## [1.0.0] - 2024-02-01

### Added
- **Initial Release**: AI Task Manager MVP
- **Core Features**
  - Task creation and management
  - Priority and category organization
  - Due date tracking
  - Basic dashboard with task overview
  - PostgreSQL database with Drizzle ORM
  - React frontend with TypeScript
  - Express backend with REST API
  - Modern UI with shadcn/ui components
  - Tailwind CSS styling

---

## Legend

- **Added**: New features
- **Changed**: Changes to existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security improvements

## Versioning

This project uses [Semantic Versioning](https://semver.org/):
- **MAJOR** version for incompatible API changes
- **MINOR** version for new functionality in a backward compatible manner
- **PATCH** version for backward compatible bug fixes
