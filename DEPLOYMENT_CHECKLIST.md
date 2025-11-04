# Railway Deployment Checklist

Use this checklist to ensure a smooth, error-free migration from Replit to Railway.

---

## 📦 PRE-DEPLOYMENT

### Repository Preparation
- [ ] Code pushed to GitHub repository
- [ ] `railway.json` added to repository root
- [ ] `nixpacks.toml` added to repository root
- [ ] `.env.example` created with all variables documented
- [ ] `.gitignore` updated (excludes .env, node_modules, dist)
- [ ] All changes committed and pushed to main branch

### Credentials Gathered
- [ ] Slack Client ID
- [ ] Slack Client Secret
- [ ] Stripe Secret Key
- [ ] Stripe Publishable Key
- [ ] Stripe Webhook Secret (will update after Railway deployment)
- [ ] Current database connection string (if migrating data)
- [ ] Session secret generated (64-char random string)
- [ ] JWT secret generated (64-char random string)

### Account Setup
- [ ] Railway account created at https://railway.app
- [ ] GitHub connected to Railway
- [ ] Payment method added to Railway (for usage beyond free tier)

---

## 🚀 RAILWAY SETUP

### Project Creation
- [ ] New Railway project created
- [ ] GitHub repository connected
- [ ] Repository selected: `Anktrinity/AI-Production-Assistant_v2`
- [ ] Initial build triggered

### Database Setup
- [ ] PostgreSQL database added to Railway project
- [ ] Database credentials auto-generated
- [ ] `DATABASE_URL` environment variable verified

### Environment Variables
- [ ] `NODE_ENV=production` set
- [ ] `DATABASE_URL=${{Postgres.DATABASE_URL}}` set (or Neon URL)
- [ ] `SESSION_SECRET` set (64-char random)
- [ ] `JWT_SECRET` set (64-char random)
- [ ] `SLACK_CLIENT_ID` set
- [ ] `SLACK_CLIENT_SECRET` set
- [ ] `SLACK_REDIRECT_URI` set to Railway domain
- [ ] `STRIPE_SECRET_KEY` set
- [ ] `STRIPE_PUBLISHABLE_KEY` set
- [ ] `STRIPE_WEBHOOK_SECRET` set (temporary, will update)
- [ ] `FRONTEND_URL` set to Railway domain
- [ ] `BACKEND_URL` set to Railway domain

### Domain Configuration
- [ ] Public Railway domain generated
- [ ] Railway domain URL copied: `https://____________.up.railway.app`
- [ ] Custom domain configured (optional)
- [ ] DNS records updated (if using custom domain)

---

## 🗄️ DATABASE MIGRATION

### Option A: Migrate to Railway PostgreSQL
- [ ] Export data from current database (Neon/Replit)
- [ ] Save backup file locally
- [ ] Import data to Railway PostgreSQL
- [ ] Verify all tables migrated
- [ ] Verify all data migrated
- [ ] Run `npm run db:push` to sync schema
- [ ] Test database queries

### Option B: Keep Current Database (Neon)
- [ ] Update `DATABASE_URL` to use Neon connection string
- [ ] Verify connection works from Railway
- [ ] Test database queries

---

## 🔗 EXTERNAL SERVICE UPDATES

### Slack OAuth Configuration
- [ ] Go to https://api.slack.com/apps
- [ ] Select your Slack app
- [ ] Navigate to "OAuth & Permissions"
- [ ] Add Railway redirect URI: `https://your-app.up.railway.app/auth/slack/callback`
- [ ] Save changes
- [ ] Verify `SLACK_REDIRECT_URI` in Railway matches

### Stripe Webhook Configuration
- [ ] Go to https://dashboard.stripe.com/webhooks
- [ ] Create new webhook or update existing
- [ ] Set endpoint URL: `https://your-app.up.railway.app/api/webhooks/stripe`
- [ ] Select events to listen for (all relevant events)
- [ ] Copy NEW webhook signing secret
- [ ] Update `STRIPE_WEBHOOK_SECRET` in Railway
- [ ] Test webhook delivery

---

## 🚀 DEPLOYMENT

### Initial Deployment
- [ ] Trigger deployment in Railway (or wait for auto-deploy)
- [ ] Monitor build logs for errors
- [ ] Verify `npm ci` completes successfully
- [ ] Verify `npm run build` completes successfully
- [ ] Verify `vite build` succeeds
- [ ] Verify `esbuild` bundles server successfully
- [ ] Verify server starts without errors
- [ ] Check deployment status: "Active"

### Build Verification
- [ ] No TypeScript errors in build logs
- [ ] No missing module errors
- [ ] Frontend bundle created in `dist/`
- [ ] Backend bundle created in `dist/index.js`
- [ ] Build time < 5 minutes
- [ ] Deployment succeeds on first try (or debug and retry)

---

## ✅ TESTING

### Basic Functionality
- [ ] App loads at Railway URL
- [ ] Homepage renders correctly
- [ ] No console errors in browser
- [ ] All CSS/styling loads correctly
- [ ] All images/assets load correctly
- [ ] API responds to health check (if implemented)

### Authentication
- [ ] "Login with Slack" button works
- [ ] Slack OAuth flow completes
- [ ] User redirected back to app after login
- [ ] User session persists after refresh
- [ ] Logout works correctly
- [ ] JWT tokens generated and validated

### Database Operations
- [ ] Users can be created
- [ ] Users can be queried
- [ ] Tasks can be created/updated/deleted
- [ ] Notifications work
- [ ] Team data loads correctly
- [ ] All CRUD operations work

### Stripe Integration
- [ ] Test payment flow works
- [ ] Stripe webhook receives events
- [ ] Webhook signature verification passes
- [ ] Payment data saved to database
- [ ] Invoice generation works (if applicable)

### Real-Time Features
- [ ] WebSocket connections establish
- [ ] Real-time updates work
- [ ] Notifications appear in real-time
- [ ] Multi-user collaboration works

### Team & Sandbox Modes
- [ ] Team collaboration mode accessible
- [ ] Template-based access control works
- [ ] Individual sandbox mode works
- [ ] User switching between modes works

---

## 🔧 PERFORMANCE & MONITORING

### Performance Checks
- [ ] Page load time < 2 seconds
- [ ] API response time < 500ms
- [ ] Database query time < 100ms
- [ ] WebSocket latency < 100ms
- [ ] No memory leaks after 1 hour runtime

### Monitoring Setup
- [ ] Railway metrics dashboard reviewed
- [ ] CPU usage < 50% at idle
- [ ] Memory usage < 256MB at idle
- [ ] No error spikes in logs
- [ ] Uptime 100% for first hour

### Logging
- [ ] Application logs visible in Railway
- [ ] Error logs captured
- [ ] Database connection logs present
- [ ] No unexpected errors or warnings

---

## 🔒 SECURITY

### Environment Security
- [ ] No secrets in git repository
- [ ] `.env` file in `.gitignore`
- [ ] All secrets in Railway environment variables
- [ ] Production secrets different from development
- [ ] Database credentials secured

### HTTPS & CORS
- [ ] App accessible via HTTPS only
- [ ] CORS configured correctly
- [ ] `FRONTEND_URL` and `BACKEND_URL` use HTTPS
- [ ] No mixed content warnings

### Session Security
- [ ] Sessions use secure cookies in production
- [ ] `SESSION_SECRET` is cryptographically random
- [ ] Session store connected to PostgreSQL
- [ ] Sessions expire after inactivity

---

## 💰 COST VERIFICATION

### Railway Usage
- [ ] Current usage reviewed in Railway dashboard
- [ ] Estimated monthly cost calculated
- [ ] Cost < $15/month (cheaper than Replit)
- [ ] Billing alerts configured (optional)
- [ ] Usage spike alerts set (optional)

### Database Costs
- [ ] Railway PostgreSQL usage reviewed
- [ ] Database size < 1GB (free tier)
- [ ] OR Neon database plan reviewed
- [ ] Total database cost < $5/month

---

## 🎯 POST-DEPLOYMENT

### User Communication
- [ ] Team notified of new URL
- [ ] Users instructed to update bookmarks
- [ ] Migration announcement sent (if public app)
- [ ] Documentation updated with new URL

### Replit Cleanup
- [ ] Verify Railway version working perfectly
- [ ] Run parallel for 24-48 hours (optional safety measure)
- [ ] Stop Replit deployment
- [ ] Export any remaining Replit data
- [ ] Cancel Replit subscription
- [ ] Confirm cost savings

### Documentation
- [ ] Update README.md with Railway deployment info
- [ ] Document environment variables in `.env.example`
- [ ] Update any API documentation with new URLs
- [ ] Create runbook for common issues

### Backup & Recovery
- [ ] Database backup created and stored
- [ ] Backup schedule configured (daily recommended)
- [ ] Recovery procedure documented
- [ ] Test restore from backup

---

## 🚨 ROLLBACK PLAN

If something goes wrong:

### Emergency Rollback to Replit
- [ ] Keep Replit deployment running for 48 hours
- [ ] If critical issue on Railway:
  - [ ] Switch DNS/traffic back to Replit
  - [ ] Investigate Railway issue
  - [ ] Fix and redeploy
  - [ ] Re-migrate when stable

### Partial Issues
- [ ] Identify specific failing feature
- [ ] Check environment variables for that feature
- [ ] Review logs for specific errors
- [ ] Fix configuration
- [ ] Redeploy
- [ ] Retest

---

## ✅ MIGRATION COMPLETE

### Final Verification
- [ ] All checklist items above completed
- [ ] App running smoothly on Railway for 24+ hours
- [ ] No critical errors in logs
- [ ] User feedback positive
- [ ] Performance meets expectations
- [ ] Costs lower than Replit
- [ ] Team comfortable with new platform

### Success Metrics
- [ ] Uptime: 99.9%+
- [ ] Response time: < 500ms average
- [ ] Zero data loss
- [ ] Cost reduction: 50%+
- [ ] Deployment time: < 5 minutes
- [ ] Zero user-facing issues

---

## 📞 SUPPORT RESOURCES

If you encounter issues:

1. **Railway Documentation**: https://docs.railway.app
2. **Railway Discord**: https://discord.gg/railway
3. **Railway Status**: https://status.railway.app
4. **GitHub Issues**: Check error messages and search Railway GitHub issues
5. **Community**: Railway Discord #help channel

---

## 🎉 CONGRATULATIONS!

If all items are checked, your migration is complete! You've successfully:

✅ Migrated from Replit to Railway
✅ Reduced hosting costs by 50%+
✅ Maintained all functionality
✅ Improved deployment workflow
✅ Set up continuous deployment from GitHub

**Welcome to Railway!** 🚀
