# GitHub Upload Guide

## 📦 Essential Files to Upload

This guide lists all files that should be uploaded to your GitHub repository for AI Task Manager.

## ✅ Required Files

### Configuration Files
- `package.json` - Project dependencies and scripts
- `package-lock.json` - Locked dependency versions
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Vite build configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `drizzle.config.ts` - Database ORM configuration
- `components.json` - shadcn/ui component configuration
- `.gitignore` - Git ignore patterns

### Documentation
- `README.md` - Main project documentation
- `replit.md` - Project architecture and preferences
- `PRODUCT_SPEC.md` - Product specification
- `BETA_USER_GUIDE.md` - Beta user onboarding guide
- `design_guidelines.md` - Frontend design guidelines

### Source Code Directories

#### `/client` - Frontend Application
```
client/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── NotificationBanner.tsx
│   │   ├── SlackSetupWizard.tsx
│   │   └── ...
│   ├── pages/              # Route pages
│   │   ├── Dashboard.tsx  # Dashboard with team/personal view toggle (updated)
│   │   └── ...
│   ├── lib/                # Utilities and helpers
│   ├── hooks/              # Custom React hooks
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── index.html
└── public/                 # Static assets
```

#### `/server` - Backend Application
```
server/
├── index.ts               # Express server entry
├── routes.ts              # Legacy API routes
├── task-routes.ts         # Task CRUD with access control (updated)
├── demo-routes.ts         # Demo/signup routes
├── notification-routes.ts # Notification API
├── task-storage.ts        # Database operations (updated)
├── wellness-automation.ts # Slack per-user progress (updated)
├── replitAuth.ts          # Authentication (updated)
├── auth.ts               # Authentication logic
├── vite.ts               # Vite integration
└── ...
```

#### `/shared` - Shared Types
```
shared/
├── schema.ts             # Database schema & types (updated)
└── templates.ts          # Template definitions with collaboration mode (updated)
```

### Assets (Optional)
- `generated-icon.png` - App icon
- `attached_assets/` - User-uploaded assets

## ❌ Files to EXCLUDE (Already in .gitignore)

- `node_modules/` - Dependencies (installed via npm)
- `dist/` - Build output
- `.env*` - Environment variables (NEVER commit)
- `*.log` - Log files
- `.replit`, `replit.nix` - Replit-specific files
- Development screenshots (`*.png` except icon)
- Development reports (`DEVELOPMENT_REPORT_*.md`)

## 🔐 Environment Variables Setup

After uploading to GitHub, create a `.env.example` template:

```bash
# Database
DATABASE_URL=

# Authentication & Security
SESSION_SECRET=
ENCRYPTION_KEY=

# Stripe Integration
VITE_STRIPE_PUBLIC_KEY=
STRIPE_SECRET_KEY=
TESTING_STRIPE_SECRET_KEY=
TESTING_VITE_STRIPE_PUBLIC_KEY=

# Slack Integration (Optional)
SLACK_BOT_TOKEN=
SLACK_APP_TOKEN=
SLACK_SIGNING_SECRET=
SLACK_CLIENT_ID=
SLACK_CLIENT_SECRET=

# Analytics
VITE_GTM_CONTAINER_ID=
```

## 📋 Pre-Upload Checklist

- [ ] Remove all sensitive data from code
- [ ] Update `.gitignore` to exclude environment files
- [ ] Create `.env.example` with template variables
- [ ] Update README.md with latest features
- [ ] Verify all dependencies are in package.json
- [ ] Remove debug console.logs
- [ ] Test build locally: `npm run build`
- [ ] Ensure database schema is documented

## 🚀 Git Commands

```bash
# Initialize repository (if not already done)
git init

# Add all files (respecting .gitignore)
git add .

# Commit changes
git commit -m "feat: AI Task Manager with Team Collaboration Mode and access control"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/ai-task-manager.git

# Push to GitHub
git push -u origin main
```

## 📊 Repository Structure Preview

```
ai-task-manager/
├── .gitignore
├── README.md
├── package.json
├── tsconfig.json
├── vite.config.ts
├── drizzle.config.ts
├── client/
│   ├── src/
│   └── index.html
├── server/
│   └── *.ts
├── shared/
│   └── schema.ts
└── docs/
    ├── BETA_USER_GUIDE.md
    ├── PRODUCT_SPEC.md
    └── design_guidelines.md
```

## 🔄 Continuous Updates

When updating the repository:

1. Make changes locally
2. Test thoroughly
3. Commit with descriptive message:
   ```bash
   git commit -m "feat: add Team Collaboration Mode with access control"
   ```
4. Push to GitHub:
   ```bash
   git push origin main
   ```

## 📝 Commit Message Conventions

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation updates
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test additions/changes
- `chore:` - Maintenance tasks

---

**Ready to upload!** All files are configured for a clean, professional GitHub repository.
