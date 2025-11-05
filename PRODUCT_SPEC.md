# AI Task Manager - Product Requirements Document

**Version:** 1.0  
**Last Updated:** October 1, 2025  
**Status:** Beta Launch Ready

---

## Executive Summary

AI Task Manager is a standalone SaaS platform designed specifically for hackathon event management and team collaboration. The platform combines intelligent task management with deep Slack integration, enabling teams to manage projects seamlessly within their existing Slack workflow. The system supports both authenticated users (via Replit OIDC) and demo users with a comprehensive sandbox mode for enterprise Slack workspaces.

### Key Differentiators
- **Individual Sandbox Mode**: Isolated user experiences within 900+ person Slack workspaces
- **Dual Authentication**: Replit OIDC for owners/admins + JWT-based demo access for prospects
- **Built-in CRM Analytics**: Track demo user behavior and conversion funnels
- **Zero-Setup Demo**: Instant access without registration for prospect evaluation
- **Custom Domain Ready**: Configured for aitaskmanager.pro deployment

---

## Product Overview

### Vision
Empower hackathon teams and event organizers with AI-powered task management that lives where teams already communicate - in Slack.

### Target Market
- Hackathon organizers and participants
- Developer communities running time-sensitive projects
- Teams seeking lightweight project management in Slack
- Event coordinators managing complex multi-team initiatives

### Core Value Proposition
1. **Instant Slack Integration**: Connect your workspace in under 2 minutes
2. **AI-Powered Assistance**: Intelligent task suggestions and priority recommendations
3. **Individual Sandboxes**: Perfect for large organizations testing the platform
4. **Real-time Collaboration**: Task updates sync instantly across web and Slack
5. **Zero Learning Curve**: Familiar Slack commands for task management

---

## Core Features

### 1. Task Management System

#### Task Properties
- **Basic Fields**: Title, description, status, priority, due date
- **Assignment**: Assignee tracking with Slack user integration
- **Categorization**: Customizable categories per user
- **AI Flags**: AI-suggested tasks, AI-generated priority scores
- **Dependencies**: Linked tasks and prerequisite tracking (schema defined)

#### Task Operations
- **Create**: Web UI form + Slack `/new` command
- **Read**: Dashboard views, filtered lists, Slack `/tasks` command
- **Update**: Inline editing, status changes, reassignment
- **Delete**: Soft delete with archive capability
- **Bulk Actions**: Multi-select operations on web UI

#### Filtering & Views
- Status filters (todo, in-progress, completed, archived)
- Priority sorting (low, medium, high, urgent)
- Category-based grouping
- Date range filtering (overdue, today, this week)
- Assignee-specific views

#### Real-time Updates
- Optimistic UI updates with automatic rollback on failure
- TanStack Query cache invalidation for multi-query consistency
- WebSocket foundation for future real-time collaboration

### 2. Slack Integration

#### Setup Flow
**5-Step Wizard Process:**
1. **Welcome**: Introduction to Slack app capabilities
2. **App Manifest**: Auto-generated manifest URL with copy functionality
3. **OAuth Configuration**: Client ID and Client Secret input with validation
4. **Redirect Setup**: Callback URL configuration
5. **Connection Test**: Verify credentials before first OAuth

#### Security Features
- **Encrypted Storage**: AES-256-GCM encryption for Slack credentials (requires `ENCRYPTION_KEY`)
- **OAuth 2.0 Flow**: Secure workspace authorization
- **Scope Management**: Minimal required permissions (commands, chat, users)
- **Token Rotation**: Automatic refresh token handling

#### Available Slack Commands
```
/tasks           View task overview
/new             Create new task
/overdue         Show overdue items
/assistant       AI help & analysis
/help            Command documentation
```

#### Sandbox Mode
**Individual User Isolation:**
- Designed for 900-person Slack workspaces
- Each Slack user gets isolated task environment
- Sandbox tokens (JWT) with `slackUserId` identification
- Zero cross-contamination between users
- Perfect for enterprise-wide beta testing

**Token Generation:**
```javascript
createSandboxToken(slackUserId, userName, userEmail, tier)
```

### 3. Authentication & Access Control

#### Replit OIDC (Primary)
- **Purpose**: Owner/admin access to full platform
- **Implementation**: Passport.js + openid-client
- **Session Storage**: PostgreSQL via connect-pg-simple
- **Cookie Security**: `httpOnly`, `secure`, `sameSite: 'lax'`
- **Features**: Google SSO integration, automatic profile sync

#### Demo JWT Tokens (Secondary)
- **Purpose**: Prospect evaluation without registration
- **Token Types**: 
  - Regular demo tokens (database-backed signups)
  - Sandbox tokens (Slack user isolation)
- **Security**: HS256 signing with `DEMO_TOKEN_SECRET`
- **Expiry**: Configurable TTL (default 7 days)
- **Storage**: localStorage with automatic cleanup

#### Authentication Priority
1. Check Replit session (highest priority)
2. Validate demo token (fallback)
3. Auto-cleanup demo token if Replit session found
4. Redirect to login if neither exists

#### Access Tiers
- **Beta**: Full feature access (Replit users/admins)
- **Premium**: Subscription-based full access (planned)
- **Basic**: Limited features (50 task limit)
- **Free**: Demo mode with restrictions

### 4. Admin Dashboard & Analytics

#### Admin Panel Features
**Access Control:**
- Replit authentication required
- Demo users explicitly blocked
- Session-based authorization

**CRM Analytics:**
- Total demo signups tracking
- Active user counts (24h, 7d, 30d)
- Conversion funnel visualization
- Page visit tracking across all routes
- User activity logging (pageviews, interactions)
- Anonymous visitor analytics
- Demo vs authenticated user segmentation

**Activity Tracking:**
```typescript
interface CRMActivity {
  userId: string | null;        // null for anonymous
  activityType: string;          // 'pageview', 'signup', 'task_create'
  metadata: Record<string, any>; // Flexible event data
  ipAddress: string | null;
  userAgent: string | null;
}
```

**Key Metrics:**
- Demo signup conversion rates
- Task creation velocity
- Slack connection success rates
- Feature adoption by tier
- Geographic distribution (via IP)

### 5. Billing & Monetization

#### Stripe Integration
- **Checkout Flow**: Pre-built payment modal
- **Subscription Plans**: Tiered pricing (Basic, Premium)
- **Webhook Handlers**: Subscription lifecycle events
- **Entitlement System**: Database-backed tier enforcement

#### Tier Gating
- Component-level access control (`<RequireTier tier="premium">`)
- Route-level protection (middleware checks)
- Feature flags per tier
- Upgrade prompts at limit boundaries

**Implementation Status:** 
- Frontend components: ✅ Complete
- Backend routes: ✅ Defined
- Stripe webhooks: ⚠️ Requires testing
- Entitlement enforcement: ⚠️ Partial

### 6. User Interface

#### Design System
- **Framework**: shadcn/ui + Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **Icons**: Lucide React (general) + React Icons (logos)
- **Theme**: Dark mode support with system preference detection
- **Responsive**: Mobile-first responsive design

#### Key Pages
1. **Dashboard** (`/dashboard`): Overview, quick actions, Slack setup
2. **Tasks** (`/tasks`): Full task management interface
3. **Admin** (`/admin`): Analytics and CRM dashboard
4. **Billing** (`/billing`): Subscription management (planned)

#### Component Architecture
- Reusable form components with react-hook-form
- Optimistic UI updates for instant feedback
- Loading states and skeleton screens
- Error boundaries and graceful degradation
- Accessibility-compliant (ARIA attributes)

---

## User Personas & Flows

### Persona 1: Hackathon Organizer (Admin)
**Profile:** Sarah, runs 3 hackathons per year with 100-500 participants each

**User Journey:**
1. Signs in with Replit account → Instant beta tier access
2. Opens Slack Setup Wizard from dashboard
3. Creates Slack app using auto-generated manifest
4. Adds Client ID and Secret through wizard
5. Clicks "Add to Slack" → OAuth authorization
6. Returns to dashboard → Connected status
7. Invites team to use `/tasks` in Slack
8. Monitors task progress from web dashboard
9. Views analytics in admin panel

**Key Features Used:**
- Slack integration for team communication
- Admin dashboard for oversight
- Task filtering by assignee
- Real-time status updates

### Persona 2: Demo User (Prospect)
**Profile:** Mike, evaluating tools for his development team

**User Journey:**
1. Lands on homepage → Clicks "Try Demo"
2. Enters email → Receives instant demo token
3. Redirected to dashboard with pre-configured tasks
4. Explores task creation and management
5. Sees tier limits prompt → Considers upgrade
6. CRM tracks all actions for sales follow-up

**Key Features Used:**
- Zero-friction demo access
- Sample tasks for exploration
- Clear upgrade paths
- No credit card required

### Persona 3: Slack Workspace Member (Sandbox)
**Profile:** Emma, team member in 900-person Slack org

**User Journey:**
1. Clicks dashboard link shared by admin
2. Authenticates via Slack user info
3. Gets isolated sandbox environment
4. Creates tasks in personal space
5. Tests Slack commands without affecting others
6. Provides feedback to decision-makers

**Key Features Used:**
- Individual sandbox isolation
- Slack command testing
- Personal task environment
- Zero cross-user interference

---

## Technical Architecture

### Frontend Stack
```
React 18+ with TypeScript
├── Routing: wouter (lightweight SPA routing)
├── State: TanStack Query v5 (server state)
├── Forms: react-hook-form + zod validation
├── UI: shadcn/ui + Radix UI + Tailwind CSS
├── Build: Vite (fast HMR, optimized production)
└── Auth: Custom useAuth hook with dual token support
```

### Backend Stack
```
Node.js + Express + TypeScript
├── Database: PostgreSQL (Neon serverless)
├── ORM: Drizzle ORM with type-safe schema
├── Session: express-session + connect-pg-simple
├── Auth: Passport.js (OIDC strategy)
├── Security: Helmet, CORS, input validation
└── Encryption: crypto (AES-256-GCM for secrets)
```

### Database Schema

#### Core Tables
```typescript
// Tasks
tasks {
  id: serial (PK)
  title: text
  description: text
  status: varchar
  priority: varchar
  dueDate: timestamp
  assignee: varchar
  category: varchar
  aiGenerated: boolean
  aiPriority: integer
  dependencies: integer[] // Future: task IDs
}

// Users & Sessions
sessions {
  sid: varchar (PK)
  sess: json
  expire: timestamp
}

// Slack Integration
teams {
  id: serial (PK)
  teamId: varchar (Slack team ID)
  accessToken: text (encrypted)
  botUserId: varchar
  scope: varchar
}

slackUsers {
  id: serial (PK)
  slackUserId: varchar
  teamId: integer (FK → teams)
  email: varchar
  displayName: varchar
}

// CRM & Analytics
demoSignups {
  id: serial (PK)
  email: varchar (unique)
  name: varchar
  tier: varchar
  lastActive: timestamp
  convertedToReplit: boolean
}

crmActivities {
  id: serial (PK)
  userId: varchar (nullable)
  activityType: varchar
  metadata: jsonb
  ipAddress: varchar
  userAgent: text
  timestamp: timestamp
}

dailySummaries {
  id: serial (PK)
  date: date (unique)
  totalTasks: integer
  completedTasks: integer
  activeUsers: integer
  newSignups: integer
}
```

### API Routes

#### Public Endpoints
```
POST   /api/demo/signup           Create demo account
GET    /api/demo/verify-token     Validate demo token
POST   /api/demo/sandbox-token    Generate Slack sandbox token
```

#### Authenticated Endpoints
```
GET    /api/auth/user            Get current user info
POST   /api/auth/logout          End session

GET    /api/tasks                List all tasks
POST   /api/tasks                Create new task
PATCH  /api/tasks/:id            Update task
DELETE /api/tasks/:id            Delete task
GET    /api/status               Task statistics

GET    /api/slack/status         Check Slack connection
GET    /api/slack/manifest       Generate app manifest
POST   /api/slack/setup-credentials  Save OAuth credentials
GET    /api/slack/install        Initiate OAuth flow
GET    /api/slack/oauth/callback Handle OAuth redirect
```

#### Admin Endpoints (Replit Auth Required)
```
GET    /api/crm/summary          Analytics dashboard data
GET    /api/crm/activities       Recent user activities
POST   /api/crm/track            Log user activity
```

### Security Architecture

#### Implemented Protections
1. **SQL Injection**: Drizzle ORM with parameterized queries
2. **XSS Prevention**: React auto-escaping + CSP headers
3. **Session Security**: httpOnly cookies, secure flag, SameSite=Lax
4. **Open Redirect**: Validation requiring paths start with `/`
5. **Credential Encryption**: AES-256-GCM for Slack tokens
6. **Input Validation**: Zod schemas on all API inputs
7. **Rate Limiting**: Per-route throttling (planned)

#### Security Gaps (Requires Attention)
1. **CSRF Protection**: Cookie-based auth needs CSRF tokens or SameSite=Strict
2. **Secret Management**: Remove fallback secrets, enforce env vars at boot
3. **Token Secrets**: Ensure strong DEMO_TOKEN_SECRET (no 'fallback-secret')
4. **Key Rotation**: Implement ENCRYPTION_KEY rotation strategy
5. **Demo Token Expiry**: Implement and enforce TTL limits

#### Environment Secrets
**Required:**
- `DATABASE_URL` - PostgreSQL connection
- `SESSION_SECRET` - Express session signing
- `ENCRYPTION_KEY` - Slack credential encryption (32+ chars)
- `DEMO_TOKEN_SECRET` - JWT demo token signing

**Optional (Slack):**
- `SLACK_CLIENT_ID` - OAuth client ID (wizard input alternative)
- `SLACK_CLIENT_SECRET` - OAuth secret (wizard input alternative)
- `SLACK_SIGNING_SECRET` - Request verification

**Optional (Stripe):**
- `STRIPE_SECRET_KEY` - Payment processing
- `VITE_STRIPE_PUBLIC_KEY` - Client-side Stripe

---

## Integration Details

### Replit OIDC Authentication

**Configuration:**
```javascript
const strategy = new Strategy({
  issuer: process.env.ISSUER_URL,
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  redirect_uri: `${baseUrl}/api/auth/callback`,
  scope: 'openid profile email'
});
```

**User Claims:**
- `sub`: Unique user identifier
- `email`: User email address
- `first_name`: Given name
- `last_name`: Family name

**Session Flow:**
1. User clicks "Login with Replit"
2. Redirects to Replit OAuth
3. User authorizes
4. Callback receives code
5. Exchange for ID token
6. Verify and decode claims
7. Create session in PostgreSQL
8. Set httpOnly session cookie
9. Redirect to dashboard

### Slack OAuth Integration

**App Manifest Generation:**
```yaml
display_information:
  name: AI Task Manager
  description: AI-powered task management for hackathons
  
features:
  bot_user:
    display_name: AI Task Manager
    
  slash_commands:
    - command: /tasks
      description: View your tasks
    - command: /new
      description: Create a new task
    
oauth_config:
  redirect_urls:
    - https://aitaskmanager.pro/api/slack/oauth/callback
  scopes:
    bot:
      - commands
      - chat:write
      - users:read
```

**OAuth Flow:**
1. User clicks "Add to Slack" (after wizard setup)
2. GET `/api/slack/install` → Generates Slack OAuth URL
3. User authorizes in Slack
4. Slack redirects to `/api/slack/oauth/callback?code=...`
5. Exchange code for access token
6. Encrypt and store token in database
7. Link to user/team records
8. Redirect to dashboard with success message

**Command Handling:**
- Slash commands POST to configured Request URL
- Verify request signature using signing secret
- Parse command and parameters
- Execute task operations
- Respond with formatted Slack message

### Stripe Payment Processing

**Checkout Flow:**
1. User clicks "Upgrade to Premium"
2. Opens PaymentModal component
3. Selects plan (Monthly/Annual)
4. Click "Subscribe" → POST `/api/billing/create-checkout`
5. Backend creates Stripe Checkout Session
6. Redirect to Stripe hosted page
7. User completes payment
8. Stripe webhook → `/api/billing/webhook`
9. Update user tier in database
10. Redirect to success page

**Webhook Events:**
- `checkout.session.completed` - Activate subscription
- `invoice.payment_succeeded` - Renew subscription
- `customer.subscription.deleted` - Downgrade tier

---

## Analytics & Tracking

### CRM Activity Logging

**Tracked Events:**
```typescript
// Automatic page tracking
- 'pageview' on all routes
- Captures: page, referrer, timestamp

// User actions
- 'signup' → Demo user registration
- 'login' → Replit authentication
- 'task_create' → New task added
- 'task_complete' → Task marked done
- 'slack_connect' → Workspace linked
- 'upgrade_click' → Pricing page visit
```

**Implementation:**
```typescript
// Frontend tracking
import { trackActivity } from '@/lib/analytics';

trackActivity('task_create', {
  taskId: task.id,
  priority: task.priority,
  hasDeadline: !!task.dueDate
});

// Backend recording
POST /api/crm/track
{
  activityType: 'task_create',
  metadata: { taskId, priority, hasDeadline },
  userId: req.user?.id || null
}
```

### Conversion Funnel

**Stages:**
1. **Landing** → Homepage visit (anonymous tracking)
2. **Signup** → Demo account creation
3. **Activation** → First task created
4. **Engagement** → 3+ tasks or Slack connected
5. **Conversion** → Stripe checkout completed
6. **Retention** → Active 7+ days post-conversion

**Metrics:**
- Signup → Activation: Target 70%+
- Activation → Engagement: Target 50%+
- Engagement → Conversion: Target 15%+

---

## Deployment & Infrastructure

### Custom Domain: aitaskmanager.pro
- **DNS Configuration**: A record to Replit deployment IP
- **SSL/TLS**: Automatic certificate via Replit
- **Environment**: Production environment variables
- **CDN**: Replit edge caching for static assets

### Environment Configuration

**Development:**
```bash
DATABASE_URL=postgresql://localhost:5432/dev
SESSION_SECRET=dev-secret-change-in-prod
DEMO_TOKEN_SECRET=dev-demo-secret
ENCRYPTION_KEY=dev-encryption-key-min-32-chars
```

**Production (aitaskmanager.pro):**
```bash
DATABASE_URL=<Neon production URL>
SESSION_SECRET=<Cryptographically secure random>
DEMO_TOKEN_SECRET=<Cryptographically secure random>
ENCRYPTION_KEY=<Cryptographically secure 32+ chars>
SLACK_SIGNING_SECRET=<From Slack app settings>
STRIPE_SECRET_KEY=<From Stripe dashboard>
STRIPE_WEBHOOK_SECRET=<From Stripe webhook config>
```

### Database Hosting
- **Provider**: Neon (Serverless PostgreSQL)
- **Connection**: @neondatabase/serverless driver
- **Pooling**: Built-in connection pooling
- **Backups**: Automatic daily snapshots
- **Scaling**: Auto-scale based on usage

### Monitoring & Observability
- **Application Logs**: Winston/Pino structured logging
- **Error Tracking**: Sentry integration (planned)
- **Performance**: Replit built-in metrics
- **Uptime**: External monitoring via UptimeRobot (planned)

---

## Known Limitations & Future Roadmap

### Current Limitations

1. **Task Dependencies**
   - Schema defined but UI/UX not implemented
   - No critical path visualization
   - No dependency validation

2. **Stripe Monetization**
   - Frontend components complete
   - Webhook handlers need end-to-end testing
   - Entitlement enforcement is partial

3. **Security Hardening**
   - CSRF protection incomplete
   - Fallback secrets still present (security risk)
   - Token rotation not automated

4. **Real-time Collaboration**
   - WebSocket infrastructure planned
   - Live task updates across users
   - Collaborative editing

5. **AI Features**
   - Task suggestions UI ready
   - AI model integration pending
   - Priority scoring algorithm needed

### Phase 2 Roadmap (Q4 2025)

**Enhanced AI Capabilities:**
- **AI-Powered Auto-Prioritization** ⭐ NEW
  - Google Gemini API integration (recommended: Flash-Lite at $0.02/1M tokens)
  - Automatic priority detection (low/medium/high/critical) based on urgency keywords
  - Keyword analysis: "ASAP", "urgent", "today", "critical", "emergency", etc.
  - Slack command integration for `/new` tasks
  - "Auto-detect with AI" option in web UI
  - Visual badges for AI-suggested priorities
  - Cost: <$2/month for typical usage, FREE tier available (1,500 requests/day)
  - Implementation time: 3-4 hours
  - Expected accuracy: 85%+ with <500ms response time
- OpenAI integration for intelligent task breakdown (alternative option)
- Natural language task creation
- Smart deadline predictions

**Multi-Platform Messaging Integration** ⭐ NEW
- **Discord Integration** (Phase 1A - Immediate)
  - FREE API with zero usage costs
  - Replit connector available for instant setup
  - Native slash commands (/tasks, /new, /overdue, /assistant)
  - Rich embed messages and button interactions
  - Server roles for permission management
  - Development time: 1-2 weeks (20-30 hours)
  - Monthly cost: $0 (uses existing hosting)
  - Perfect for: Gaming communities, developer hackathons
  
- **Rocket.Chat Integration** (Phase 1B - Immediate)
  - FREE API - 100% open source, self-hostable
  - Full REST + WebSocket API in free tier
  - Slash commands and rich message formatting
  - Self-host option = $0/month or Cloud Starter FREE (50 users)
  - Omnichannel bridge (can connect WhatsApp/Telegram without their APIs)
  - Development time: 1.5-2 weeks (25-40 hours)
  - Monthly cost: $0 (self-hosted) or $8/user (cloud)
  - Perfect for: Privacy-focused teams, open-source communities, cost-conscious orgs
  
- **Google Chat Integration** (Phase 2A - Strategic)
  - FREE API with Google Workspace subscription
  - Interactive cards and slash commands
  - Deep Google ecosystem integration (Drive, Calendar, Meet)
  - OAuth 2.0 with Google Cloud Console
  - Development time: 2-3 weeks (40-60 hours)
  - Monthly cost: $6-18/user (Workspace subscription, but free if already subscribed)
  - Perfect for: Organizations already using Google Workspace
  
- **Microsoft Teams Integration** (Phase 2B - Enterprise)
  - FREE API (no metering since Aug 2025)
  - Azure Bot Service with Bot Framework SDK
  - Adaptive Cards for rich task UI
  - Microsoft 365 SSO integration
  - Teams channels and 1-on-1 chat support
  - Development time: 2-3 weeks (40-60 hours)
  - Monthly cost: $10-50 (Azure App Service hosting)
  - Perfect for: Corporate hackathons, enterprise teams

**Advanced Slack Features:**
- Interactive task cards with buttons
- Scheduled task reminders
- Team @mentions and notifications
- Slash command autocomplete

**Collaboration Features:**
- Task comments and discussions
- File attachments to tasks
- Activity feed per task
- @mention notifications

**Analytics & Insights:**
- Team productivity dashboards
- Burndown charts
- Velocity tracking
- Time-to-completion analytics

**Enterprise Features:**
- SSO integration (Okta, Azure AD)
- Custom role-based access control
- Audit logs
- Data export (CSV, JSON)

### Phase 3 Roadmap (Q1 2026)

**Integrations:**
- GitHub issue sync
- Jira import/export
- Google Calendar integration
- Email notifications

**Mobile Experience:**
- React Native mobile app
- Push notifications
- Offline mode

**Advanced Task Management:**
- Gantt chart visualization
- Resource allocation
- Capacity planning
- Template library

---

## Success Metrics

### Product KPIs
- **User Acquisition**: 1,000 demo signups in first month
- **Activation Rate**: 60%+ create first task within 24h
- **Slack Adoption**: 30%+ connect Slack workspace
- **Conversion Rate**: 10%+ upgrade to paid tier
- **Retention**: 70%+ active after 30 days

### Technical KPIs
- **Uptime**: 99.9% availability
- **Response Time**: <200ms API latency p95
- **Error Rate**: <0.1% failed requests
- **Security**: Zero critical vulnerabilities

### Business KPIs
- **MRR Growth**: 20% month-over-month
- **CAC**: <$50 per paying customer
- **LTV**: >$500 per customer
- **Churn**: <5% monthly

---

## Appendix

### Tech Stack Summary
```
Frontend:
- React 18 + TypeScript
- Vite (build tool)
- TanStack Query v5 (data fetching)
- wouter (routing)
- shadcn/ui + Radix UI (components)
- Tailwind CSS (styling)
- react-hook-form + zod (forms)

Backend:
- Node.js + Express
- TypeScript
- Drizzle ORM
- PostgreSQL (Neon)
- Passport.js (auth)
- express-session

Integrations:
- Replit OIDC
- Slack OAuth + Bot
- Stripe Checkout
- Google Analytics (planned)

Infrastructure:
- Replit hosting
- Neon Database
- Custom domain: aitaskmanager.pro
```

### API Documentation
Full API documentation available at: `/docs/api` (Swagger UI planned)

### Support Resources
- **Documentation**: `/docs` (in development)
- **Status Page**: status.aitaskmanager.pro (planned)
- **Support Email**: support@aitaskmanager.pro
- **Community**: Slack workspace for beta testers

---

**Document Owner:** Platform Engineering Team  
**Review Cycle:** Quarterly  
**Last Reviewed:** October 1, 2025  
**Next Review:** January 1, 2026
