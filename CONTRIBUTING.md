# Contributing to AI Task Manager

Thank you for your interest in contributing to AI Task Manager! This document provides guidelines and instructions for contributing to the project.

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- PostgreSQL database
- Replit account (for authentication integration)
- Git for version control

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/yourusername/ai-task-manager.git
   cd ai-task-manager
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   
   Copy `.env.example` to `.env` and configure:
   ```bash
   # Database
   DATABASE_URL=your_postgresql_connection_string
   
   # Authentication & Security
   SESSION_SECRET=your_session_secret
   ENCRYPTION_KEY=your_encryption_key
   
   # Slack Integration (optional for local dev)
   SLACK_BOT_TOKEN=your_slack_bot_token
   SLACK_APP_TOKEN=your_slack_app_token
   SLACK_SIGNING_SECRET=your_slack_signing_secret
   
   # Stripe (optional for local dev)
   VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ```

4. **Initialize Database**
   ```bash
   npm run db:push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5000`

## 📋 Code Guidelines

### TypeScript

- **Strict Mode**: All code must pass TypeScript strict mode checks
- **Type Safety**: Avoid using `any` types; prefer explicit type definitions
- **Interfaces**: Define interfaces for all data structures in `shared/schema.ts`

### React Components

- **Functional Components**: Use functional components with hooks
- **TypeScript**: All components must have proper type definitions
- **shadcn/ui**: Use existing shadcn/ui components wherever possible
- **Data Test IDs**: Add `data-testid` attributes to all interactive elements

### Backend API

- **RESTful Design**: Follow REST principles for all API endpoints
- **Validation**: Validate all request bodies using Zod schemas
- **Error Handling**: Return proper HTTP status codes and error messages
- **Authentication**: Use the `authenticateUser` middleware for protected routes

### Database

- **Drizzle ORM**: Use Drizzle ORM for all database operations
- **Migrations**: Use `npm run db:push` to sync schema changes
- **Type Safety**: Leverage Drizzle's type inference for query results

### Code Style

- **Formatting**: Code is automatically formatted (follow existing patterns)
- **Imports**: Use path aliases (`@/`, `@shared/`)
- **Comments**: Add comments for complex logic, avoid obvious comments
- **Naming**: Use descriptive variable and function names

## 🔧 Development Workflow

### Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - Individual feature branches
- `bugfix/*` - Bug fix branches

### Making Changes

1. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Write clean, readable code
   - Follow the code guidelines above
   - Add comments where necessary

3. **Test Your Changes**
   - Ensure all existing functionality still works
   - Test in both authenticated and demo modes
   - Verify responsive design on multiple screen sizes

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

   Use conventional commit messages:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting, etc.)
   - `refactor:` - Code refactoring
   - `test:` - Adding or updating tests
   - `chore:` - Maintenance tasks

5. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Provide a clear description of your changes
   - Reference any related issues
   - Include screenshots for UI changes

## 🐛 Bug Reports

When reporting bugs, please include:

- **Description**: Clear description of the issue
- **Steps to Reproduce**: Detailed steps to reproduce the bug
- **Expected Behavior**: What you expected to happen
- **Actual Behavior**: What actually happened
- **Environment**: Browser, OS, Node version
- **Screenshots**: If applicable

## 💡 Feature Requests

When suggesting features, please include:

- **Use Case**: Why is this feature needed?
- **Proposed Solution**: How should it work?
- **Alternatives**: Any alternative solutions you've considered
- **Additional Context**: Any other relevant information

## 🔐 Security

If you discover a security vulnerability, please email security@aitaskmanager.pro instead of creating a public issue.

## 📚 Project Structure

```
ai-task-manager/
├── client/              # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom React hooks
│   │   └── lib/         # Utility functions
├── server/              # Backend Express application
│   ├── index.ts         # Server entry point
│   ├── task-routes.ts   # Task management routes
│   ├── replitAuth.ts    # Authentication middleware
│   └── slack/           # Slack integration
├── shared/              # Shared code between frontend and backend
│   ├── schema.ts        # Database schema and types
│   └── templates.ts     # Task templates
└── README.md
```

## 🧪 Testing

- Manual testing is currently the primary method
- Test both authenticated and demo modes
- Verify Slack integration functionality
- Check responsive design on mobile and desktop

## 📝 Documentation

- Update README.md for user-facing changes
- Update replit.md for architectural changes
- Add JSDoc comments for complex functions
- Keep CONTRIBUTING.md up to date

## ✅ Pull Request Checklist

Before submitting a PR, ensure:

- [ ] Code follows project guidelines
- [ ] TypeScript compiles without errors
- [ ] All features work in both auth and demo modes
- [ ] UI is responsive and accessible
- [ ] No console errors or warnings
- [ ] Commit messages follow conventional commits
- [ ] PR description clearly explains changes

## 🤝 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow

## 📞 Getting Help

- Check existing issues and documentation
- Ask questions in pull request comments
- Review the README.md and replit.md files

Thank you for contributing to AI Task Manager! 🎉
