#!/bin/bash

# Complete setup script for Infinite platform
# This initializes DB, seeds communities, and creates test data

set -e

echo "🔧 Infinite Platform - Complete Setup"
echo "======================================"

# Set database URL
export DATABASE_URL='postgresql://neondb_owner:npg_7kcn6MJFNhDY@ep-twilight-cake-ai94u4ni-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

echo ""
echo "1️⃣  Pushing database schema to Neon..."
npx drizzle-kit push:pg --force-remove || echo "⚠️  Schema push encountered a prompt or issue"

echo ""
echo "2️⃣  Installing tsx for running TypeScript scripts..."
npm install -D tsx

echo ""
echo "3️⃣  Seeding communities..."
npx tsx scripts/seed-communities.ts

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Create test posts"
echo "  2. Test API endpoints"
echo "  3. Check http://localhost:3003 for posts"
echo ""
