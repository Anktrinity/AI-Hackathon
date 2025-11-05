# Railway Migration Guide - AI Task Manager

**Migration Date:** November 5, 2025  
**From:** Replit (isolated instances)  
**To:** Railway (shared backend architecture)  
**Goal:** Enable true Team Collaboration Mode with shared database

---

## 🎯 Migration Overview

### What You're Building on Railway

```
┌─────────────────────────────────────────────────┐
│           SHARED ARCHITECTURE ON RAILWAY         │
├─────────────────────────────────────────────────┤
│                                                  │
│  Frontend (React + Vite)                        │
│  ↓ HTTPS API calls                              │
│  Backend API (Express + TypeScript)             │
│  ↓ PostgreSQL queries                           │
│  PostgreSQL Database (Railway Addon)            │
│                                                  │
│  ALL USERS → Same Backend → Same Database       │
│                                                  │
└─────────────────────────────────────────────────┘
```

### Key Differences from Replit

| Aspect | Replit (Current) | Railway (Target) |
|--------|-----------------|------------------|
| Database | One per user instance | One shared database |
| Backend API | One per user instance | One shared API service |
| Team Collaboration | Impossible | Fully functional |
| Deployment | Auto-restarts per instance | Single production deployment |
| Cost | Per-instance compute | Shared compute resources |

---

## 📋 Pre-Migration Checklist

### 1. Gather Information from Replit

```bash
# 1. List all environment variables
# In Replit shell, run:
env | grep -E "(DATABASE_URL|SLACK|STRIPE|SESSION)" > replit_env_backup.txt

# 2. Export database schema
npx drizzle-kit introspect

# 3. Document current npm packages
npm list --depth=0 > npm_packages.txt
```

### 2. Save Important Data

```bash
# If you have any tasks you want to preserve, export them:
# In Replit shell:
psql $DATABASE_URL -c "COPY tasks TO STDOUT CSV HEADER" > tasks_export.csv
psql $DATABASE_URL -c "COPY app_users TO STDOUT CSV HEADER" > users_export.csv
```

### 3. Download Full Codebase

In Replit:
1. Click "..." menu → "Download as zip"
2. Extract locally for backup
3. OR push to GitHub first (recommended)

---

## 🚀 Railway Setup (Step-by-Step)

### Step 1: Create Railway Account

1. Go to https://railway.app
2. Sign up with GitHub account
3. Verify email if required

### Step 2: Create New Project

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. **OPTION A:** Connect existing GitHub repo
   - Authorize Railway to access your GitHub
   - Select your repository
4. **OPTION B:** Start empty and push code later
   - Select "Empty Project"
   - Note the project name

### Step 3: Add PostgreSQL Database

1. In your Railway project dashboard
2. Click "+ New Service"
3. Select "Database" → "PostgreSQL"
4. Railway automatically provisions database
5. Database will appear in your project with name like `postgres-production`
6. Click on the database service
7. Go to "Variables" tab
8. Copy the `DATABASE_URL` (you'll need this)

### Step 4: Configure Backend Service

1. Click "+ New Service" again
2. Select "GitHub Repo" (if not already connected)
3. Configure service settings:

```yaml
# railway.json (create this in project root)
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "numReplicas": 1,
    "startCommand": "npm run start",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

4. Set environment variables in Railway dashboard:

```env
# Database (auto-configured by Railway)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Session
SESSION_SECRET=<generate-new-random-string-32-chars>
NODE_ENV=production

# Slack (copy from Replit)
SLACK_BOT_TOKEN=<your-slack-bot-token>
SLACK_APP_TOKEN=<your-slack-app-token>
SLACK_SIGNING_SECRET=<your-slack-signing-secret>

# Stripe (copy from Replit)
STRIPE_SECRET_KEY=<your-stripe-secret>
VITE_STRIPE_PUBLIC_KEY=<your-stripe-public>

# Encryption
ENCRYPTION_KEY=<generate-new-random-string-32-chars>

# Frontend URL (will update after frontend deployed)
FRONTEND_URL=https://your-frontend.railway.app
```

### Step 5: Update package.json for Production

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "dev": "tsx watch server/index.ts",
    "build": "vite build && tsc -p tsconfig.server.json",
    "start": "NODE_ENV=production node dist/index.js",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  }
}
```

### Step 6: Deploy Backend

1. Commit changes to GitHub:
```bash
git add railway.json package.json
git commit -m "Configure for Railway deployment"
git push origin main
```

2. Railway auto-deploys on push
3. Wait for build to complete (check logs)
4. Click on backend service → "Settings" → "Generate Domain"
5. Copy the backend URL (e.g., `https://your-backend.railway.app`)

### Step 7: Configure Frontend Service

1. Click "+ New Service" in Railway
2. Select same GitHub repo
3. Configure build settings:

**Root Directory:** `client` (if frontend is in subdirectory)  
**OR** keep as root if using monorepo structure

**Build Command:**
```bash
npm run build
```

**Start Command:**
```bash
npx serve -s dist -l $PORT
```

4. Add to `package.json`:
```json
{
  "scripts": {
    "build:frontend": "vite build",
    "preview": "vite preview"
  }
}
```

5. Set frontend environment variables:

```env
VITE_API_URL=https://your-backend.railway.app
VITE_STRIPE_PUBLIC_KEY=<your-stripe-public-key>
```

### Step 8: Update Frontend API Calls

**Current Code (Replit):**
```typescript
// client/lib/queryClient.ts
const API_BASE = ''; // Assumes same-origin
```

**Updated Code (Railway):**
```typescript
// client/lib/queryClient.ts
const API_BASE = import.meta.env.VITE_API_URL || '';
```

**Update all API calls:**
```typescript
// Before
fetch('/api/tasks')

// After
fetch(`${API_BASE}/api/tasks`)
```

### Step 9: Enable CORS on Backend

**Add to `server/index.ts`:**

```typescript
import cors from 'cors';

const app = express();

// Add CORS middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
```

**Install CORS:**
```bash
npm install cors
npm install --save-dev @types/cors
```

### Step 10: Run Database Migrations

1. In Railway dashboard, click on backend service
2. Go to "Settings" → "Service Variables"
3. Copy the `DATABASE_URL`
4. In your local terminal:

```bash
# Set DATABASE_URL locally
export DATABASE_URL="<railway-database-url>"

# Push schema to Railway database
npm run db:push
```

### Step 11: Deploy Frontend

1. Commit frontend changes:
```bash
git add client/lib/queryClient.ts
git commit -m "Update API base URL for Railway"
git push origin main
```

2. Railway auto-deploys
3. Generate domain for frontend service
4. Copy frontend URL

### Step 12: Update Backend CORS

1. Go to backend service in Railway
2. Update environment variable:
```env
FRONTEND_URL=https://your-frontend.railway.app
```

3. Backend will auto-redeploy

---

## 🗄️ Database Schema Updates for Team Collaboration

### Required Schema Changes

Create a new migration file: `server/migrations/add_workspace_support.ts`

```typescript
import { pgTable, varchar, timestamp, boolean, text } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// 1. Add workspaces table
export const workspaces = pgTable('workspaces', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  name: varchar('name').notNull(),
  slug: varchar('slug').unique().notNull(),
  ownerId: varchar('owner_id').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  settings: text('settings'), // JSON string for workspace settings
});

// 2. Add workspace_members table
export const workspaceMembers = pgTable('workspace_members', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: varchar('workspace_id').notNull(),
  userId: varchar('user_id').notNull(),
  email: varchar('email').notNull(),
  role: varchar('role').notNull(), // 'owner', 'admin', 'member'
  joinedAt: timestamp('joined_at').defaultNow(),
});

// 3. Update tasks table - add workspace_id
// Add this column to existing tasks table
ALTER TABLE tasks ADD COLUMN workspace_id VARCHAR;
ALTER TABLE tasks ADD CONSTRAINT fk_workspace 
  FOREIGN KEY (workspace_id) REFERENCES workspaces(id);
```

**Update `shared/schema.ts`:**

```typescript
export const workspaces = pgTable('workspaces', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  name: varchar('name').notNull(),
  slug: varchar('slug').unique().notNull(),
  ownerId: varchar('owner_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  settings: text('settings'),
});

export const workspaceMembers = pgTable('workspace_members', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: varchar('workspace_id').notNull().references(() => workspaces.id),
  userId: varchar('user_id').notNull(),
  email: varchar('email').notNull(),
  role: varchar('role', { enum: ['owner', 'admin', 'member'] }).notNull(),
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
});

// Update tasks table
export const tasks = pgTable('tasks', {
  // ... existing fields ...
  workspaceId: varchar('workspace_id').references(() => workspaces.id),
  // ... rest of fields ...
});
```

---

## 🔧 Code Updates for Shared Backend

### 1. Update Task Routes for Multi-Tenancy

**File: `server/task-routes.ts`**

```typescript
// Add workspace context to all queries
router.get('/api/tasks', async (req, res) => {
  const userId = req.user?.id;
  const workspaceId = req.query.workspaceId as string;

  if (!workspaceId) {
    return res.status(400).json({ error: 'Workspace ID required' });
  }

  // Verify user is member of workspace
  const membership = await db
    .select()
    .from(workspaceMembers)
    .where(
      and(
        eq(workspaceMembers.workspaceId, workspaceId),
        eq(workspaceMembers.userId, userId)
      )
    )
    .limit(1);

  if (membership.length === 0) {
    return res.status(403).json({ error: 'Not authorized for this workspace' });
  }

  // Get tasks for workspace
  const workspaceTasks = await db
    .select()
    .from(tasks)
    .where(eq(tasks.workspaceId, workspaceId))
    .orderBy(desc(tasks.createdAt));

  res.json(workspaceTasks);
});
```

### 2. Add Workspace Management Routes

**Create: `server/workspace-routes.ts`**

```typescript
import { Router } from 'express';
import { db } from './db';
import { workspaces, workspaceMembers } from '../shared/schema';
import { eq } from 'drizzle-orm';

const router = Router();

// Create workspace
router.post('/api/workspaces', async (req, res) => {
  const { name, slug } = req.body;
  const userId = req.user?.id;
  const userEmail = req.user?.email;

  const workspace = await db.insert(workspaces).values({
    name,
    slug,
    ownerId: userId,
  }).returning();

  // Add creator as owner
  await db.insert(workspaceMembers).values({
    workspaceId: workspace[0].id,
    userId,
    email: userEmail,
    role: 'owner',
  });

  res.json(workspace[0]);
});

// Get user's workspaces
router.get('/api/workspaces', async (req, res) => {
  const userId = req.user?.id;

  const userWorkspaces = await db
    .select({
      workspace: workspaces,
      membership: workspaceMembers,
    })
    .from(workspaceMembers)
    .innerJoin(workspaces, eq(workspaceMembers.workspaceId, workspaces.id))
    .where(eq(workspaceMembers.userId, userId));

  res.json(userWorkspaces);
});

// Invite member to workspace
router.post('/api/workspaces/:workspaceId/invite', async (req, res) => {
  const { workspaceId } = req.params;
  const { email, role } = req.body;
  const userId = req.user?.id;

  // Check if user is owner or admin
  const membership = await db
    .select()
    .from(workspaceMembers)
    .where(
      and(
        eq(workspaceMembers.workspaceId, workspaceId),
        eq(workspaceMembers.userId, userId)
      )
    );

  if (membership[0]?.role !== 'owner' && membership[0]?.role !== 'admin') {
    return res.status(403).json({ error: 'Not authorized' });
  }

  // Add new member
  await db.insert(workspaceMembers).values({
    workspaceId,
    userId: '', // Will be filled when user accepts invite
    email,
    role: role || 'member',
  });

  res.json({ success: true });
});

export default router;
```

### 3. Update Frontend for Workspace Selection

**Create: `client/src/contexts/WorkspaceContext.tsx`**

```typescript
import { createContext, useContext, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

interface Workspace {
  id: string;
  name: string;
  slug: string;
  role: string;
}

interface WorkspaceContextType {
  currentWorkspace: Workspace | null;
  setCurrentWorkspace: (workspace: Workspace) => void;
  workspaces: Workspace[];
}

const WorkspaceContext = createContext<WorkspaceContextType | null>(null);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);

  const { data: workspaces = [] } = useQuery<Workspace[]>({
    queryKey: ['/api/workspaces'],
  });

  useEffect(() => {
    if (workspaces.length > 0 && !currentWorkspace) {
      setCurrentWorkspace(workspaces[0]);
    }
  }, [workspaces]);

  return (
    <WorkspaceContext.Provider value={{ currentWorkspace, setCurrentWorkspace, workspaces }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) throw new Error('useWorkspace must be used within WorkspaceProvider');
  return context;
}
```

### 4. Add Workspace Selector to UI

**Update: `client/src/App.tsx`**

```typescript
import { WorkspaceProvider } from './contexts/WorkspaceContext';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WorkspaceProvider>
        {/* existing routes */}
      </WorkspaceProvider>
    </QueryClientProvider>
  );
}
```

**Add selector to header:**

```typescript
// client/src/components/WorkspaceSelector.tsx
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function WorkspaceSelector() {
  const { currentWorkspace, workspaces, setCurrentWorkspace } = useWorkspace();

  return (
    <Select
      value={currentWorkspace?.id}
      onValueChange={(id) => {
        const workspace = workspaces.find(w => w.id === id);
        if (workspace) setCurrentWorkspace(workspace);
      }}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select workspace" />
      </SelectTrigger>
      <SelectContent>
        {workspaces.map(workspace => (
          <SelectItem key={workspace.id} value={workspace.id}>
            {workspace.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
```

---

## 🔐 Authentication Changes

### Railway Doesn't Have Replit OIDC

You need to replace Replit authentication with a different solution:

### **Option 1: Email Magic Links (Recommended for MVP)**

```bash
npm install nodemailer jsonwebtoken
```

**Create: `server/magic-link-auth.ts`**

```typescript
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

export async function sendMagicLink(email: string) {
  const token = jwt.sign({ email }, process.env.SESSION_SECRET!, {
    expiresIn: '15m'
  });

  const magicLink = `${process.env.FRONTEND_URL}/auth/verify?token=${token}`;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Sign in to AI Task Manager',
    html: `
      <h2>Welcome back!</h2>
      <p>Click the link below to sign in:</p>
      <a href="${magicLink}">Sign In</a>
      <p>This link expires in 15 minutes.</p>
    `,
  });
}
```

### **Option 2: Auth0 (Production Ready)**

```bash
npm install express-openid-connect
```

Setup at https://auth0.com and follow their Express quickstart.

### **Option 3: Clerk (Easiest)**

```bash
npm install @clerk/clerk-sdk-node @clerk/clerk-react
```

Setup at https://clerk.com - provides ready-made UI components.

---

## 📤 Deploy Instructions

### Using GitHub (Recommended)

```bash
# 1. Create GitHub repo
git init
git add .
git commit -m "Initial commit for Railway"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ai-task-manager.git
git push -u origin main

# 2. Connect Railway to GitHub
# - In Railway dashboard
# - Click "New Project" → "Deploy from GitHub"
# - Select your repository
# - Railway auto-deploys on every push
```

### Using Railway CLI

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Initialize project
railway init

# 4. Link to project
railway link

# 5. Deploy
railway up
```

---

## 🧪 Testing After Migration

### 1. Backend Health Check

```bash
curl https://your-backend.railway.app/health
```

Should return:
```json
{"status": "ok", "database": "connected"}
```

### 2. Frontend Load

Visit: `https://your-frontend.railway.app`

Should show login page or dashboard.

### 3. Database Connection

```bash
# Connect to Railway database
railway connect postgres

# Check tables
\dt

# Check data
SELECT COUNT(*) FROM tasks;
```

### 4. End-to-End Test

1. Create workspace
2. Invite team member
3. Create task in workspace
4. Verify other member can see task
5. Reassign task
6. Delete task

---

## 💾 Data Migration from Replit

### Export from Replit

```bash
# Connect to Replit database
psql $DATABASE_URL

# Export tables
\copy app_users TO 'app_users.csv' CSV HEADER;
\copy tasks TO 'tasks.csv' CSV HEADER;
\copy slack_users TO 'slack_users.csv' CSV HEADER;
```

### Import to Railway

```bash
# Connect to Railway database
railway connect postgres

# Import tables
\copy app_users FROM 'app_users.csv' CSV HEADER;
\copy tasks FROM 'tasks.csv' CSV HEADER;
\copy slack_users FROM 'slack_users.csv' CSV HEADER;
```

**Important:** Update task records to add `workspace_id`:

```sql
-- Create Wellness Awards workspace
INSERT INTO workspaces (name, slug, owner_id)
VALUES ('Wellness Awards 2025', 'wellness-awards-2025', '<treefanevents-user-id>')
RETURNING id;

-- Update all wellness tasks to belong to this workspace
UPDATE tasks
SET workspace_id = '<workspace-id-from-above>'
WHERE template_id = 'wellness-awards';
```

---

## 🎯 Post-Migration Tasks

### 1. Add Missing Features

```bash
# Tasks to implement after migration:
- [ ] Task edit modal on Tasks page
- [ ] Delete buttons on Tasks page
- [ ] Reassign task functionality
- [ ] Workspace member management UI
- [ ] Invite team members flow
- [ ] Role-based permissions
```

### 2. Fix Data Quality

```sql
-- Clean up assignee names
UPDATE tasks
SET assignee_name = NULL
WHERE assignee_name = 'Anca Platon Trifan'
  AND assignee_email != 'anca@example.com';
```

### 3. Set Up Monitoring

Railway provides built-in monitoring:
- Click on service → "Metrics"
- Set up alerts for errors
- Monitor response times

### 4. Configure Custom Domain (Optional)

1. In Railway service → "Settings" → "Domains"
2. Click "Add Domain"
3. Enter your domain (e.g., `aitaskmanager.pro`)
4. Update DNS records as shown
5. Wait for SSL certificate provisioning

---

## 💰 Railway Pricing Estimate

### Free Tier
- $5 free credit monthly
- Good for testing/development
- Limited hours

### Paid Plans
- **Hobby Plan**: $5/month + usage
  - Suitable for small teams
  - Includes PostgreSQL
  - Estimated: $10-20/month for your use case

- **Pro Plan**: $20/month + usage
  - Better for production
  - Priority support
  - Estimated: $30-50/month

**Compare to Replit:** Likely 50-70% cost reduction for team collaboration.

---

## 🆘 Troubleshooting

### Build Fails on Railway

```bash
# Check build logs in Railway dashboard
# Common issues:

# 1. Missing dependencies
npm install

# 2. TypeScript errors
npx tsc --noEmit

# 3. Environment variables missing
# Add in Railway dashboard → Service → Variables
```

### Database Connection Issues

```env
# Ensure DATABASE_URL format is correct
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
```

### CORS Errors

```typescript
// server/index.ts
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-frontend.railway.app'
  ],
  credentials: true
}));
```

### Authentication Not Working

```typescript
// Check session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    domain: process.env.NODE_ENV === 'production' ? '.railway.app' : undefined
  }
}));
```

---

## 📞 Support Resources

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Railway Status: https://status.railway.app

---

## ✅ Final Checklist

Before going live:

- [ ] Backend deployed and healthy
- [ ] Frontend deployed and loading
- [ ] Database connected and migrated
- [ ] Authentication working
- [ ] Environment variables set
- [ ] CORS configured
- [ ] Workspace system functional
- [ ] Team members can collaborate
- [ ] Slack integration working
- [ ] Custom domain configured (optional)
- [ ] Monitoring set up
- [ ] Data backup plan in place

---

**Migration Complete!** 🎉

You now have a true shared backend where all team members can collaborate on the same workspace.

Next steps: Implement Option B features (edit, reassign, bulk operations) on the new platform.
