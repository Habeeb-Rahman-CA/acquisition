# Warp Development Guide - Acquisition Project

## Project Overview
This is the **Acquisition** project - a Node.js/Express.js application with modern tooling and database integration.

### Tech Stack
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js v5.1.0
- **Database**: Neon Database with Drizzle ORM
- **Authentication**: JWT + bcrypt
- **Validation**: Zod
- **Logging**: Winston + Morgan
- **Security**: Helmet, CORS
- **Code Quality**: ESLint + Prettier

## Quick Start Commands

### Development
```bash
# Start development server with hot reload
npm run dev

# View database in Drizzle Studio
npm run db:studio
```

### Database Operations
```bash
# Generate database migrations
npm run db:generate

# Run database migrations
npm run db:migrate

# Open Drizzle Studio (database GUI)
npm run db:studio
```

### Code Quality
```bash
# Lint code
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format

# Check if code is formatted correctly
npm run format:check
```

## Project Structure

```
acquisition/
├── src/
│   ├── app.js              # Express app configuration
│   ├── index.js            # Entry point
│   ├── server.js           # Server startup
│   ├── config/             # Configuration files
│   ├── controller/         # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/             # Database models/schemas
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   ├── utils/              # Utility functions
│   └── validation/         # Zod validation schemas
├── package.json
├── drizzle.config.js       # Database configuration
└── eslint.config.js        # ESLint configuration
```

## Path Imports
This project uses custom import paths for cleaner imports:

```javascript
import userController from '#controller/userController.js';
import authMiddleware from '#middleware/auth.js';
import userModel from '#models/user.js';
import userRoutes from '#routes/user.js';
import userService from '#services/userService.js';
import { hashPassword } from '#utils/crypto.js';
import { userSchema } from '#validation/userSchema.js';
```

## Environment Setup

Create a `.env` file with the following variables:
```env
PORT=3000
DATABASE_URL=your_neon_database_url
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

## Development Workflow

### 1. Starting Development
```bash
npm run dev
```
This starts the server with `--watch` flag for automatic restarts on file changes.

### 2. Database Changes
When making database schema changes:
```bash
# 1. Update your schema files in src/models/
# 2. Generate migration
npm run db:generate

# 3. Apply migration
npm run db:migrate
```

### 3. Code Quality Checks
Before committing:
```bash
npm run lint:fix
npm run format
```

## Useful Warp Features

### Terminal Shortcuts
- `Ctrl + Shift + T` - New terminal tab
- `Ctrl + Shift + D` - Split terminal
- `Ctrl + Shift + W` - Close current tab

### AI Assistant Commands
- Ask Warp AI about debugging: "Why is my Express server not starting?"
- Get help with database queries: "How do I write a Drizzle query for..."
- Code reviews: "Review this API endpoint for security issues"

### Git Integration
```bash
# Quick status check
git status

# Stage and commit changes
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin main
```

## Common Issues & Solutions

### Database Connection Issues
```bash
# Check if DATABASE_URL is set
echo $env:DATABASE_URL  # PowerShell
echo $DATABASE_URL      # Bash/WSL

# Test database connection
npm run db:studio
```

### Port Already in Use
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### ESLint/Prettier Conflicts
```bash
# Fix all linting and formatting issues
npm run lint:fix && npm run format
```

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Code linted and formatted
- [ ] Tests passing (add tests!)
- [ ] Security headers configured (Helmet)
- [ ] CORS configured properly
- [ ] Logging configured for production

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Neon Database Documentation](https://neon.tech/docs)
- [Zod Validation Documentation](https://zod.dev/)

---

*Happy coding with Warp! 🚀*