# Deployment Guide

This guide covers deploying AI Task Manager to production environments.

## 🚀 Deployment Options

### Option 1: Replit (Recommended)

The application is optimized for Replit deployment with built-in support for:
- Automatic environment configuration
- Database migrations
- SSL/TLS setup
- Custom domain support

#### Prerequisites
- Replit account
- PostgreSQL database (Neon recommended)
- Slack app credentials
- Stripe account (optional)

#### Steps

1. **Fork the Replit Project**
   - Import from GitHub or fork existing Replit
   - Replit will auto-detect the Node.js environment

2. **Configure Environment Secrets**
   
   In Replit Secrets panel, add:
   ```
   DATABASE_URL=postgresql://user:password@host/database
   SESSION_SECRET=your-random-secret-key
   ENCRYPTION_KEY=your-32-character-encryption-key
   
   SLACK_BOT_TOKEN=xoxb-your-bot-token
   SLACK_APP_TOKEN=xapp-your-app-token
   SLACK_SIGNING_SECRET=your-signing-secret
   
   VITE_STRIPE_PUBLIC_KEY=pk_live_your-key
   STRIPE_SECRET_KEY=sk_live_your-key
   ```

3. **Initialize Database**
   ```bash
   npm run db:push
   ```

4. **Start Application**
   - Click "Run" in Replit
   - Application runs on port 5000
   - Replit provides automatic HTTPS

5. **Custom Domain (Optional)**
   - Add custom domain in Replit settings
   - Point DNS A record to Replit IP
   - SSL certificate auto-configured

### Option 2: VPS/Cloud Server

Deploy to any Linux server with Node.js support.

#### Prerequisites
- Ubuntu 22.04 or similar
- Node.js 18+
- PostgreSQL 14+
- Nginx (for reverse proxy)
- SSL certificate (Let's Encrypt)

#### Steps

1. **Server Setup**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js 18
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Install PostgreSQL
   sudo apt install postgresql postgresql-contrib
   
   # Install PM2 for process management
   sudo npm install -g pm2
   ```

2. **Clone Repository**
   ```bash
   git clone https://github.com/yourusername/ai-task-manager.git
   cd ai-task-manager
   npm install
   ```

3. **Configure Environment**
   ```bash
   cp .env.example .env
   nano .env
   ```
   
   Set all required environment variables.

4. **Build Application**
   ```bash
   npm run build
   ```

5. **Start with PM2**
   ```bash
   pm2 start dist/index.js --name ai-task-manager
   pm2 save
   pm2 startup
   ```

6. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

7. **SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

### Option 3: Docker

#### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

#### docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - SESSION_SECRET=${SESSION_SECRET}
      - ENCRYPTION_KEY=${ENCRYPTION_KEY}
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:14-alpine
    environment:
      - POSTGRES_DB=aitaskmanager
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

#### Deploy
```bash
docker-compose up -d
```

## 🔧 Environment Variables

### Required
```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/database

# Security
SESSION_SECRET=your-random-32-character-secret
ENCRYPTION_KEY=your-random-32-character-key

# Authentication (Replit OIDC)
# These are auto-configured on Replit
```

### Optional
```bash
# Slack Integration
SLACK_BOT_TOKEN=xoxb-your-token
SLACK_APP_TOKEN=xapp-your-token
SLACK_SIGNING_SECRET=your-secret
SLACK_CLIENT_ID=your-client-id
SLACK_CLIENT_SECRET=your-client-secret

# Stripe Payments
VITE_STRIPE_PUBLIC_KEY=pk_live_your-key
STRIPE_SECRET_KEY=sk_live_your-key

# Analytics
VITE_GTM_CONTAINER_ID=GTM-XXXXXX

# Object Storage (for file uploads)
DEFAULT_OBJECT_STORAGE_BUCKET_ID=your-bucket-id
PUBLIC_OBJECT_SEARCH_PATHS=/public
PRIVATE_OBJECT_DIR=/.private
```

## 🗄️ Database Setup

### Neon Database (Recommended for Replit)

1. Create account at [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string
4. Add to `DATABASE_URL` environment variable

### PostgreSQL on VPS

```bash
# Create database
sudo -u postgres psql
CREATE DATABASE aitaskmanager;
CREATE USER taskuser WITH PASSWORD 'securepassword';
GRANT ALL PRIVILEGES ON DATABASE aitaskmanager TO taskuser;
\q

# Connection string
DATABASE_URL=postgresql://taskuser:securepassword@localhost:5432/aitaskmanager
```

### Run Migrations
```bash
npm run db:push
```

## 🔒 Security Checklist

- [ ] Strong `SESSION_SECRET` (32+ random characters)
- [ ] Strong `ENCRYPTION_KEY` (32+ random characters)
- [ ] HTTPS/TLS enabled
- [ ] Database credentials secured
- [ ] Environment variables not committed to Git
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] SQL injection protection (parameterized queries)
- [ ] Input validation on all endpoints

## 📊 Monitoring

### Health Check
```bash
curl https://yourdomain.com/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "AI Task Manager",
  "timestamp": "2025-11-05T12:00:00.000Z"
}
```

### PM2 Monitoring
```bash
pm2 status
pm2 logs ai-task-manager
pm2 monit
```

### Database Monitoring
```sql
-- Check active connections
SELECT count(*) FROM pg_stat_activity;

-- Check database size
SELECT pg_size_pretty(pg_database_size('aitaskmanager'));

-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## 🔄 Updates & Maintenance

### Update Application
```bash
git pull origin main
npm install
npm run build
pm2 restart ai-task-manager
```

### Database Backups
```bash
# Backup
pg_dump -U taskuser aitaskmanager > backup-$(date +%Y%m%d).sql

# Restore
psql -U taskuser aitaskmanager < backup-20251105.sql
```

### Log Rotation
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

## 🚨 Troubleshooting

### Application Won't Start
1. Check logs: `pm2 logs`
2. Verify environment variables
3. Test database connection
4. Check port availability: `sudo lsof -i :5000`

### Database Connection Errors
1. Verify `DATABASE_URL` format
2. Check database is running
3. Verify network connectivity
4. Check firewall rules

### Slack Integration Issues
1. Verify all Slack tokens are set
2. Check bot permissions in Slack app
3. Verify webhook URLs are correct
4. Test with `/tasks status` command

## 📈 Performance Optimization

### Database Indexes
```sql
-- Add indexes for common queries
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_template_id ON tasks(template_id);
CREATE INDEX idx_tasks_assignee_email ON tasks(assignee_email);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);
```

### Caching
- React Query handles frontend caching
- Consider Redis for session storage in high-traffic scenarios

### CDN
- Serve static assets through CDN
- Cache API responses where appropriate

## 🎯 Production Checklist

- [ ] All environment variables configured
- [ ] Database initialized and migrated
- [ ] HTTPS/SSL certificate installed
- [ ] Domain DNS configured
- [ ] Health check endpoint working
- [ ] Monitoring and logging set up
- [ ] Backup strategy implemented
- [ ] Security headers configured
- [ ] Error tracking enabled
- [ ] Performance monitoring active

## 📞 Support

For deployment issues:
1. Check logs first
2. Review this guide
3. Check GitHub issues
4. Contact support team

---

**Note**: This application is designed to run as a shared instance for Team Collaboration Mode. All authorized team members should access the same deployment URL, not separate instances.
