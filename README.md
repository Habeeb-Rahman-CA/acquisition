# Acquisition - Dockerized Node.js Application with Neon Database

This application is configured to work with different database setups for development and production:
- **Development**: Uses Neon Local proxy for ephemeral database branches
- **Production**: Uses Neon Cloud database directly

## Architecture Overview

```
Development:
Your App ← Docker Network → Neon Local Proxy ← Internet → Neon Cloud

Production:
Your App ← Internet → Neon Cloud (Direct)
```

## Prerequisites

- Docker and Docker Compose installed
- Neon account and project set up at [console.neon.tech](https://console.neon.tech)
- Your Neon API key, Project ID, and Branch ID

## Getting Your Neon Credentials

1. Go to [Neon Console](https://console.neon.tech)
2. Select your project
3. **API Key**: Go to Account Settings → Developer Settings → API Keys
4. **Project ID**: Found in Project Settings → General
5. **Branch ID**: Go to Branches tab and copy the branch ID you want to use as parent

## Development Setup (with Neon Local)

### 1. Configure Environment Variables

Copy the development environment template:
```bash
cp .env.development .env.dev
```

Edit `.env.dev` and replace the placeholder values:
```bash
# Required: Replace these with your actual Neon credentials
NEON_API_KEY=your_actual_neon_api_key_here
NEON_PROJECT_ID=your_actual_project_id_here  
PARENT_BRANCH_ID=your_parent_branch_id_here

# Optional: Update your Arcjet key if needed
ARCJET_KEY=your_arcjet_key
```

### 2. Start Development Environment

Run the application with Neon Local:
```bash
docker-compose --env-file .env.dev -f docker-compose.dev.yml up -d
```

This will:
- Start Neon Local proxy container
- Create an ephemeral database branch (automatically deleted when stopped)
- Start your application container
- Enable hot-reload for development

### 3. Verify Setup

Check that everything is running:
```bash
docker-compose -f docker-compose.dev.yml ps
```

View logs:
```bash
docker-compose -f docker-compose.dev.yml logs -f
```

Your application will be available at: http://localhost:3000

### 4. Database Operations

Run database migrations:
```bash
docker-compose -f docker-compose.dev.yml exec app npm run db:migrate
```

Open Drizzle Studio:
```bash
docker-compose -f docker-compose.dev.yml exec app npm run db:studio
```

### 5. Stop Development Environment

```bash
docker-compose -f docker-compose.dev.yml down
```

Note: This will automatically delete the ephemeral database branch.

## Production Setup (with Neon Cloud)

### 1. Configure Environment Variables

Create production environment file:
```bash
cp .env.production .env.prod
```

Set your production environment variables (typically done in your deployment platform):
```bash
export DATABASE_URL="your_production_neon_cloud_url"
export ARCJET_KEY="your_production_arcjet_key"
```

### 2. Deploy to Production

Using Docker Compose:
```bash
docker-compose --env-file .env.prod -f docker-compose.prod.yml up -d
```

Or build and run manually:
```bash
# Build the image
docker build -t acquisition-app .

# Run in production mode
docker run -d \
  --name acquisition-prod \
  -p 3000:3000 \
  -e DATABASE_URL="your_production_neon_cloud_url" \
  -e ARCJET_KEY="your_arcjet_key" \
  -e NODE_ENV=production \
  acquisition-app
```

## Docker Commands Reference

### Development Commands
```bash
# Start development environment
docker-compose --env-file .env.dev -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f app

# Run database migrations
docker-compose -f docker-compose.dev.yml exec app npm run db:migrate

# Access application shell
docker-compose -f docker-compose.dev.yml exec app sh

# Rebuild and restart
docker-compose -f docker-compose.dev.yml up --build -d

# Stop development environment
docker-compose -f docker-compose.dev.yml down
```

### Production Commands
```bash
# Start production environment
docker-compose --env-file .env.prod -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f app

# Check container health
docker-compose -f docker-compose.prod.yml ps

# Stop production environment
docker-compose -f docker-compose.prod.yml down
```

## Environment Variables Reference

### Development (.env.dev)
| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `NEON_API_KEY` | Your Neon API key | Yes | `neon_api_key_...` |
| `NEON_PROJECT_ID` | Your Neon project ID | Yes | `cool-project-123` |
| `PARENT_BRANCH_ID` | Parent branch for ephemeral branches | Yes | `br-branch-123` |
| `ARCJET_KEY` | Arcjet security key | Yes | `ajkey_...` |

### Production (.env.prod or environment variables)
| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `DATABASE_URL` | Full Neon Cloud connection string | Yes | `postgres://user:pass@host.neon.tech/db` |
| `ARCJET_KEY` | Arcjet security key | Yes | `ajkey_...` |

## Troubleshooting

### Common Issues

**1. Neon Local fails to start**
- Check your API key and project ID are correct
- Ensure your Neon account has access to the project
- Verify the parent branch ID exists

**2. Application can't connect to database**
- Check that the `neon-local` service is healthy: `docker-compose -f docker-compose.dev.yml ps`
- Verify the database URL format in your environment file
- Check the container logs: `docker-compose -f docker-compose.dev.yml logs neon-local`

**3. Hot-reload not working in development**
- Ensure source code is properly mounted as a volume
- Check that `--watch` flag is being used in the development command

**4. Production deployment issues**
- Verify `DATABASE_URL` points to your actual Neon Cloud database
- Check that all required environment variables are set
- Ensure your Neon database accepts connections from your production environment

### Useful Commands

Check container health:
```bash
docker inspect acquisition-neon-local | grep -A 10 "Health"
```

Connect directly to Neon Local:
```bash
docker exec -it acquisition-neon-local psql postgres://neon:npg@localhost:5432/neondb
```

View detailed container logs:
```bash
docker logs acquisition-app-dev --follow
```

## Security Notes

- Never commit `.env.*` files to version control
- Use secrets management in production (not environment files)
- The Neon Local container uses self-signed certificates for SSL
- Production setup includes security enhancements like read-only filesystem

## Learn More

- [Neon Local Documentation](https://neon.com/docs/local/neon-local)
- [Neon Database Documentation](https://neon.com/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team)

## Support

For issues related to:
- Neon Local: Check [Neon Documentation](https://neon.com/docs/local/neon-local)
- Docker setup: Review the compose files and this documentation
- Application issues: Check application logs and verify environment configuration