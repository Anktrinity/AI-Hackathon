# Railway Migration Guide - AI Production Assistant v2

Complete step-by-step guide to migrate your full-stack TypeScript application from Replit to Railway without breaking anything.

---

## 📋 Pre-Migration Checklist

Before starting, ensure you have:
- [ ] Railway account created (https://railway.app)
- [ ] GitHub account with repository access
- [ ] All current environment variables from Replit
- [ ] Database backup (if needed)
- [ ] Stripe credentials
- [ ] Slack OAuth credentials

---

## 🎯 Cost Comparison

**Replit**: ~$20-50/month for Hacker/Pro plans
**Railway**:
- $5/month Developer plan + usage-based pricing
- First $5 credit free each month
- Estimated: $5-15/month for your app size

---

## 📦 PHASE 1: Prepare Your Repository

### Step 1.1: Push Code to GitHub (if not already done)

If your code is only on Replit:

```bash
# In Replit Shell
git init
git add .
git commit -m "Initial commit - migrating to Railway"
git branch -M main
git remote add origin https://github.com/Anktrinity/AI-Production-Assistant_v2.git
git push -u origin main
```

### Step 1.2: Add Railway Configuration Files

Add these files to your repository root (ALREADY CREATED FOR YOU):

1. **`railway.json`** ✅ Created
2. **`nixpacks.toml`** ✅ Created
3. **`.env.example`** ✅ Created

### Step 1.3: Update .gitignore

Ensure your `.gitignore` includes:

```gitignore
# Environment
.env
.env.local
.env.production

# Dependencies
node_modules/

# Build outputs
dist/
build/

# Database
*.db
*.sqlite

# Logs
logs/
*.log

# IDE
.vscode/
.idea/

# Replit specific
.replit
.config/
.upm/
```

### Step 1.4: Commit and Push Configuration Files

```bash
git add railway.json nixpacks.toml .env.example .gitignore
git commit -m "Add Railway configuration files"
git push origin main
```

---

## 🚀 PHASE 2: Set Up Railway Project

### Step 2.1: Create New Railway Project

1. Go to https://railway.app
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authenticate with GitHub
5. Select repository: `Anktrinity/AI-Production-Assistant_v2`
6. Railway will automatically detect it's a Node.js app

### Step 2.2: Add PostgreSQL Database

1. In your Railway project dashboard, click **"+ New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway will automatically:
   - Create a PostgreSQL instance
   - Generate connection credentials
   - Add `DATABASE_URL` environment variable to your app

**IMPORTANT**: Railway automatically connects your app to the database via `DATABASE_URL`.

### Step 2.3: Configure Environment Variables

Click on your app service → **"Variables"** tab → Add these variables:

#### Required Variables:

```bash
# DATABASE (Auto-set by Railway when you add PostgreSQL)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# NODE ENVIRONMENT
NODE_ENV=production

# SESSION & AUTH (Generate secure random strings)
SESSION_SECRET=<generate-64-char-random-string>
JWT_SECRET=<generate-64-char-random-string>

# SLACK OAUTH
SLACK_CLIENT_ID=<your-slack-client-id>
SLACK_CLIENT_SECRET=<your-slack-client-secret>
SLACK_REDIRECT_URI=https://${{RAILWAY_PUBLIC_DOMAIN}}/auth/slack/callback

# STRIPE
STRIPE_SECRET_KEY=<your-stripe-secret-key>
STRIPE_PUBLISHABLE_KEY=<your-stripe-publishable-key>
STRIPE_WEBHOOK_SECRET=<your-stripe-webhook-secret>

# APP URLS
FRONTEND_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}
BACKEND_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}
```

#### How to Generate Secure Secrets:

```bash
# In your terminal, run these commands:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the outputs for `SESSION_SECRET` and `JWT_SECRET`.

### Step 2.4: Update Slack OAuth Redirect URIs

1. Go to https://api.slack.com/apps
2. Select your Slack app
3. Go to **"OAuth & Permissions"**
4. Update **"Redirect URLs"** to include:
   ```
   https://your-railway-app.up.railway.app/auth/slack/callback
   ```
   (Replace with your actual Railway domain - found in Railway dashboard under "Settings" → "Domains")

### Step 2.5: Update Stripe Webhook Endpoint

1. Go to https://dashboard.stripe.com/webhooks
2. Update your webhook endpoint URL to:
   ```
   https://your-railway-app.up.railway.app/api/webhooks/stripe
   ```
3. Copy the new **Webhook Signing Secret** and update `STRIPE_WEBHOOK_SECRET` in Railway

---

## 🗄️ PHASE 3: Database Migration

### Option A: Migrate from Neon to Railway PostgreSQL (RECOMMENDED)

#### Step 3.1: Export Data from Neon

```bash
# In your local terminal (not Replit)
# Install PostgreSQL client if not installed
pg_dump "postgresql://user:password@ep-xxx.region.aws.neon.tech/database?sslmode=require" > backup.sql
```

#### Step 3.2: Import to Railway PostgreSQL

1. In Railway, click on **PostgreSQL service** → **"Data"** tab → **"Query"**
2. Or use the connection string from Railway:

```bash
# Get DATABASE_URL from Railway variables
psql "postgresql://user:password@host.railway.internal:5432/railway" < backup.sql
```

#### Step 3.3: Run Drizzle Migrations

Railway will automatically run your build, but to manually push schema:

```bash
# This will be done automatically on deploy via your build script
npm run db:push
```

### Option B: Keep Using Neon Database (EASIER - NO MIGRATION)

If you want to avoid database migration:

1. **Keep** your current Neon database
2. In Railway environment variables, use your **Neon connection string**:
   ```
   DATABASE_URL=postgresql://user:password@ep-xxx.region.aws.neon.tech/database?sslmode=require
   ```
3. Skip the data export/import steps
4. Your app will connect to Neon from Railway

**Pros**: No data migration, zero downtime
**Cons**: Still paying for Neon separately (~$19/month for paid tier)

**RECOMMENDATION**: For maximum cost savings, migrate to Railway PostgreSQL. For fastest migration with zero risk, keep Neon.

---

## ⚙️ PHASE 4: Verify Build Configuration

### Step 4.1: Check package.json Scripts

Your current scripts are perfect for Railway:

```json
{
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "start": "NODE_ENV=production node dist/index.js",
    "check": "tsc",
    "db:push": "drizzle-kit push"
  }
}
```

✅ Railway will run `npm run build` (builds frontend + backend)
✅ Railway will run `npm run start` (starts production server)

### Step 4.2: Verify Server Port Configuration

Ensure your `server/index.ts` uses Railway's dynamic PORT:

```typescript
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**IMPORTANT**: Railway sets `PORT` dynamically. Your code should read from `process.env.PORT`.

### Step 4.3: Update Database Connection

In your `drizzle.config.ts` or database connection file:

```typescript
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// This works for both Neon and Railway PostgreSQL
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);
```

✅ This code works for both Neon and Railway PostgreSQL without changes.

---

## 🚀 PHASE 5: Deploy to Railway

### Step 5.1: Trigger First Deployment

Railway automatically deploys when you:
- Connect the GitHub repository
- Push new commits

Or manually:
1. Go to Railway dashboard
2. Click **"Deploy"** button
3. Watch the build logs

### Step 5.2: Monitor Build Logs

Click on your deployment → **"Deployments"** tab → Select latest deployment → **"View Logs"**

Watch for:
- ✅ `npm ci` completes
- ✅ `npm run build` completes
- ✅ `vite build` succeeds
- ✅ `esbuild` bundles server
- ✅ Server starts on Railway's PORT
- ❌ Any errors (see troubleshooting below)

### Step 5.3: Generate Public Domain

1. Click on your app service
2. Go to **"Settings"** tab
3. Under **"Domains"**, click **"Generate Domain"**
4. Railway will create: `https://your-app-name.up.railway.app`

Or add a custom domain:
1. Click **"Custom Domain"**
2. Enter your domain
3. Add CNAME record to your DNS

---

## ✅ PHASE 6: Testing & Validation

### Step 6.1: Basic Health Check

Visit your Railway URL:
```
https://your-app-name.up.railway.app
```

✅ Should see your React frontend load

### Step 6.2: Test Database Connection

```bash
# In Railway dashboard, open "Query" for PostgreSQL
SELECT * FROM app_users LIMIT 5;
```

✅ Should see your users table

### Step 6.3: Test Authentication

1. Try logging in with Slack
2. Verify session persistence
3. Check JWT token generation

### Step 6.4: Test Stripe Integration

1. Create a test payment
2. Verify webhook receives events
3. Check database updates

### Step 6.5: Test WebSocket Connections

If your app uses WebSockets:
1. Open browser DevTools → Network → WS
2. Verify WebSocket connection establishes
3. Test real-time updates

---

## 🔧 PHASE 7: Optimization

### Step 7.1: Set Up Health Checks

Railway automatically health-checks your app. Optionally add a health endpoint:

```typescript
// In server/index.ts
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});
```

Update `railway.json`:
```json
{
  "deploy": {
    "healthcheckPath": "/health"
  }
}
```

### Step 7.2: Configure Auto-Scaling (Optional)

Railway automatically scales. To configure:
1. Go to **"Settings"** → **"Deploy"**
2. Set **"Instances"**: 1-3 (auto-scales on load)

### Step 7.3: Set Up Monitoring

Railway provides built-in metrics:
1. Go to **"Metrics"** tab
2. Monitor: CPU, Memory, Network
3. Set up alerts for high resource usage

---

## 🚨 Troubleshooting

### Issue 1: Build Fails with "Module not found"

**Cause**: Missing dependencies

**Fix**:
```bash
# Make sure all deps are in package.json dependencies (not devDependencies)
# For production builds, move build tools to dependencies:
npm install --save-prod esbuild tsx typescript
git commit -am "Move build tools to dependencies"
git push
```

### Issue 2: Server Doesn't Start - "Address already in use"

**Cause**: Not using Railway's PORT variable

**Fix**: In `server/index.ts`:
```typescript
const PORT = parseInt(process.env.PORT || '5000');
```

### Issue 3: Database Connection Errors

**Cause**: Wrong connection string

**Fix**:
1. Check Railway PostgreSQL variables
2. Ensure `DATABASE_URL` is set
3. Verify Neon/Railway connection string format
4. Check for SSL requirements (Neon needs `?sslmode=require`)

### Issue 4: Slack OAuth Fails

**Cause**: Wrong redirect URI

**Fix**:
1. Update Slack app redirect URI to Railway domain
2. Update `SLACK_REDIRECT_URI` in Railway variables
3. Clear browser cookies and retry

### Issue 5: Stripe Webhooks Not Working

**Cause**: Wrong endpoint or signing secret

**Fix**:
1. Update Stripe webhook URL to Railway domain
2. Get NEW webhook signing secret from Stripe dashboard
3. Update `STRIPE_WEBHOOK_SECRET` in Railway

### Issue 6: Frontend Shows "API Error" or CORS Issues

**Cause**: Wrong FRONTEND_URL/BACKEND_URL

**Fix**: Update Railway variables:
```bash
FRONTEND_URL=https://your-actual-domain.up.railway.app
BACKEND_URL=https://your-actual-domain.up.railway.app
```

### Issue 7: 502 Bad Gateway

**Cause**: Server not starting or crashing

**Fix**:
1. Check logs: Deployment → View Logs
2. Look for JavaScript errors
3. Verify all environment variables are set
4. Check database connection

---

## 📊 Cost Monitoring

### Railway Pricing Breakdown

**Developer Plan**: $5/month includes:
- $5 usage credit
- Priority support

**Usage Costs**:
- **CPU**: ~$0.000463/vCPU/minute
- **Memory**: ~$0.000231/GB/minute
- **Network**: Free egress up to 100GB

**Your Estimated Monthly Cost**:
- Small app (1 service + PostgreSQL): **$5-10/month**
- Medium traffic: **$10-15/month**
- High traffic: **$20-30/month**

Still MUCH cheaper than Replit's $20-50/month!

### Monitor Your Usage

1. Railway dashboard → **"Usage"** tab
2. View real-time costs
3. Set up billing alerts

---

## 🎯 Post-Migration Checklist

After successful migration:

- [ ] All features working on Railway
- [ ] Database migrated and verified
- [ ] Slack OAuth working
- [ ] Stripe payments working
- [ ] WebSockets connecting
- [ ] Environment variables secured
- [ ] Custom domain configured (optional)
- [ ] Monitoring set up
- [ ] Old Replit deployment stopped (cancel subscription)
- [ ] Team notified of new URL
- [ ] Documentation updated

---

## 🔄 Continuous Deployment

Railway automatically deploys when you push to GitHub:

```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push origin main

# Railway automatically:
# 1. Detects push
# 2. Runs build
# 3. Deploys new version
# 4. Zero-downtime rollout
```

---

## 📚 Additional Resources

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Railway Status: https://status.railway.app

---

## ⚡ Quick Migration Summary

**Fastest Path** (30 minutes):

1. Create Railway project from GitHub repo
2. Add PostgreSQL database
3. Copy all environment variables from Replit to Railway
4. Update Slack redirect URI
5. Update Stripe webhook URL
6. Deploy and test

**Safest Path** (2 hours):

1. Keep Neon database (no migration)
2. Set up Railway with all configs
3. Deploy to Railway
4. Test thoroughly in parallel with Replit
5. Switch DNS/traffic when confident
6. Decommission Replit

---

## 🎉 Success Criteria

Your migration is complete when:

✅ App loads at Railway URL
✅ Users can log in with Slack
✅ Database queries work
✅ Payments process via Stripe
✅ WebSockets connect
✅ All features match Replit version
✅ No console errors
✅ Response times < 500ms
✅ Cost reduced by 50%+

**Congratulations! You've successfully migrated to Railway!** 🚀
