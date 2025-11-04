# 🚀 Quick Start - Replit to Railway Migration

**TL;DR**: Get your app running on Railway in 30 minutes.

---

## Prerequisites

- Railway account: https://railway.app
- GitHub repo with your code
- Current environment variables from Replit

---

## 5-Step Migration

### 1️⃣ Push Code to GitHub (if not already)

```bash
git add .
git commit -m "Prepare for Railway migration"
git push origin main
```

Files to include in your repo:
- ✅ `railway.json` (already created)
- ✅ `nixpacks.toml` (already created)
- ✅ `.env.example` (already created)

### 2️⃣ Create Railway Project

1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Select: `Anktrinity/AI-Production-Assistant_v2`
4. Railway auto-deploys (will fail without env vars - that's ok)

### 3️⃣ Add PostgreSQL Database

1. In Railway project, click "+ New"
2. Select "Database" → "Add PostgreSQL"
3. Done! Railway auto-sets `DATABASE_URL`

### 4️⃣ Set Environment Variables

Click your app service → "Variables" → Add all:

```bash
# Copy these from Replit:
NODE_ENV=production
SESSION_SECRET=<64-char-random-string>
JWT_SECRET=<64-char-random-string>
SLACK_CLIENT_ID=<from-slack-dashboard>
SLACK_CLIENT_SECRET=<from-slack-dashboard>
STRIPE_SECRET_KEY=<from-stripe-dashboard>
STRIPE_PUBLISHABLE_KEY=<from-stripe-dashboard>
STRIPE_WEBHOOK_SECRET=<from-stripe-dashboard>

# Railway auto-generates these:
DATABASE_URL=${{Postgres.DATABASE_URL}}
SLACK_REDIRECT_URI=https://${{RAILWAY_PUBLIC_DOMAIN}}/auth/slack/callback
FRONTEND_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}
BACKEND_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}
```

**Generate secrets**:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 5️⃣ Update External Services

**Slack**:
1. Go to https://api.slack.com/apps → Your App
2. OAuth & Permissions → Add redirect URI:
   ```
   https://your-app.up.railway.app/auth/slack/callback
   ```

**Stripe**:
1. Go to https://dashboard.stripe.com/webhooks
2. Update endpoint:
   ```
   https://your-app.up.railway.app/api/webhooks/stripe
   ```
3. Copy NEW webhook secret → Update `STRIPE_WEBHOOK_SECRET` in Railway

---

## ✅ Test Your Deployment

1. Visit Railway URL: `https://your-app.up.railway.app`
2. Test login with Slack
3. Test a database operation
4. Test Stripe payment

---

## 🎯 Migration Options

### Option A: Keep Neon Database (Easiest - 10 min)

**Pros**: Zero downtime, no data migration
**Cons**: Still paying Neon separately

Just set `DATABASE_URL` to your Neon connection string instead of Railway PostgreSQL.

### Option B: Migrate to Railway PostgreSQL (Best for cost)

**Pros**: All-in-one Railway hosting, max cost savings
**Cons**: Requires data migration (30 min)

1. Export from Neon:
   ```bash
   pg_dump "your-neon-url" > backup.sql
   ```

2. Import to Railway:
   ```bash
   psql "railway-postgres-url" < backup.sql
   ```

---

## 🚨 Common Issues

### Build Fails
- Check logs: Deployment → View Logs
- Ensure all dependencies in `package.json`

### Can't Connect to Database
- Verify `DATABASE_URL` is set
- Check connection string format

### Slack Login Fails
- Update Slack redirect URI to Railway domain
- Verify `SLACK_CLIENT_ID` and `SLACK_CLIENT_SECRET`

### Stripe Webhooks Not Working
- Update Stripe webhook URL to Railway domain
- Update `STRIPE_WEBHOOK_SECRET` with NEW secret

---

## 💰 Cost Comparison

**Before (Replit)**: $20-50/month
**After (Railway)**: $5-15/month
**Savings**: 50-75%!

---

## 📚 Full Documentation

For detailed step-by-step guide: See `RAILWAY_MIGRATION_GUIDE.md`
For complete checklist: See `DEPLOYMENT_CHECKLIST.md`

---

## 🎉 Done!

Your app should now be running on Railway. Enjoy the cost savings! 🚀

Questions? Railway Discord: https://discord.gg/railway
