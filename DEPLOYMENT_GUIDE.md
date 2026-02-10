# Deployment Guide for Infinite to Vercel

## Prerequisites
- Neon database account (https://neon.tech) - **FREE TIER**
- Vercel CLI installed locally
- Environment variables set up

## Step-by-Step Setup

### 1. Create Neon Database (FREE)

1. Go to https://neon.tech
2. Sign up with GitHub (easiest)
3. Create a new project
4. Copy your connection string (looks like):
   ```
   postgresql://neondb_owner:password@ep-xxx-region.neon.tech/neondb?sslmode=require
   ```

### 2. Set Environment Variables in Vercel

Run these commands from `/home/fiona/LAMM/lammac`:

```bash
# Add database URL
npx vercel env add DATABASE_URL

# Paste your Neon connection string when prompted
```

Generate and add JWT secret:
```bash
# Generate a random secret
openssl rand -base64 32

# Add it to Vercel
npx vercel env add JWT_SECRET
```

### 3. Run Database Migrations

```bash
# Install drizzle-kit if not already installed
npm install -D drizzle-kit

# Generate migrations (if needed)
npx drizzle-kit generate:pg

# Push schema to production database
npx drizzle-kit push:pg
```

### 4. Deploy to Vercel

```bash
# Deploy to production
npx vercel deploy --prod

# Or use the shorthand
npm run build && npx vercel deploy --prod
```

### 5. Verify Deployment

```bash
# Check deployment status
npx vercel ls

# View logs
npx vercel logs https://infinite-fwang108s-projects.vercel.app
```

## Troubleshooting

### Database Connection Failed
- Verify `DATABASE_URL` is set in Vercel environment variables
- Check Neon connection string format
- Ensure database is not paused (Neon auto-pauses after inactivity)

### Table Creation Failed
- Run migrations locally first: `npx drizzle-kit push:pg`
- Check database permissions
- Verify schema syntax

### JWT Errors
- Ensure `JWT_SECRET` is set in Vercel environment variables
- Regenerate if needed: `openssl rand -base64 32`

## Environment Variables Checklist

In Vercel dashboard, set these:

- [ ] `DATABASE_URL` - Your Neon PostgreSQL connection string
- [ ] `JWT_SECRET` - Random 32+ character string
- [ ] `NEXT_PUBLIC_API_URL` - `https://infinite-fwang108s-projects.vercel.app`
- [ ] `NODE_ENV` - `production`

## Local Development

To run locally with database:

```bash
# Create .env.local
cp .env.example .env.local

# Edit .env.local with your Neon connection string
# DATABASE_URL=postgresql://...

# Install dependencies
npm install

# Run database push (creates tables)
npx drizzle-kit push:pg

# Start dev server
npm run dev
```

## Useful Commands

```bash
# View database in browser (Drizzle Studio)
npx drizzle-kit studio

# Check deployment
npx vercel inspect

# View environment variables
npx vercel env ls

# Pull current config from Vercel
npx vercel pull

# Redeploy latest commit
npx vercel redeploy
```
