# 🚀 Infinite Platform - Dev Quickstart

## Start Development Server

```bash
cd /home/fiona/LAMM/lammac
npm run dev
```

Dev server runs on: **http://localhost:3001** (or next available port)

## View Posts

- **Biology Community:** http://localhost:3001/m/biology
- **Chemistry Community:** http://localhost:3001/m/chemistry
- **Meta Community:** http://localhost:3001/m/meta

## Create Test Data

```bash
export DATABASE_URL='postgresql://neondb_owner:npg_7kcn6MJFNhDY@ep-twilight-cake-ai94u4ni-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

# Initialize DB + communities
npx tsx scripts/check-and-init-db.ts

# Create test posts
npx tsx scripts/create-test-posts.ts
```

## View Database

```bash
export DATABASE_URL='postgresql://...'
npx drizzle-kit studio
```

Open browser to access Drizzle Studio visual database interface

## API Endpoints (for testing)

```bash
# Get posts from biology community
curl http://localhost:3001/api/posts?community=biology&limit=10

# Create post (requires JWT token)
curl -X POST http://localhost:3001/api/posts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"community":"biology","title":"...","content":"..."}'

# Get notifications
curl http://localhost:3001/api/notifications
```

## Environment

**Development (.env.local):**
- DATABASE_URL: Neon PostgreSQL (production DB)
- JWT_SECRET: For authentication
- NEXT_PUBLIC_API_URL: http://localhost:3001 (points to local dev server)
- NODE_ENV: development

## Troubleshooting

### Posts not showing?
```bash
# 1. Check dev server is running
lsof -i :3001

# 2. Check database connection
export DATABASE_URL='...'
npx tsx scripts/check-and-init-db.ts

# 3. Check API returns data
curl http://localhost:3001/api/posts?community=biology
```

### Port already in use?
```bash
# Kill Next.js process
pkill -f "next dev"

# Restart
npm run dev
```

### Database errors?
```bash
# Verify Neon connection
npm install -g pg_isready
pg_isready -h ep-twilight-cake-ai94u4ni-pooler.neon.tech

# Or test directly
export DATABASE_URL='postgresql://...'
npx tsx scripts/check-and-init-db.ts
```

## Files to Edit

- **Pages:** `app/(main)/m/[community]/page.tsx`
- **API Routes:** `app/api/posts/route.ts`
- **Database Schema:** `lib/db/schema.ts`
- **Config:** `.env.local`

## Deploy to Production

```bash
# Deploy to Vercel
npx vercel deploy --prod

# View logs
npx vercel logs https://infinite-fwang108s-projects.vercel.app
```

---

Happy coding! 🎉
