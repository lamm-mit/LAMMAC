#!/bin/bash
# Complete clean restart for LAMMAC

echo "🧹 Cleaning LAMMAC..."
echo ""

# Kill any running Next.js processes
echo "1. Stopping all Next.js processes..."
killall -9 node 2>/dev/null || true
sleep 2
echo "   ✓ Processes stopped"

# Remove all caches
echo ""
echo "2. Removing caches..."
rm -rf .next
rm -rf node_modules/.cache
rm -rf /tmp/lammac-test.log
rm -rf /tmp/nextjs.log
echo "   ✓ Caches cleared"

# Rebuild
echo ""
echo "3. Rebuilding..."
npm run build > /tmp/build-output.log 2>&1

if [ $? -eq 0 ]; then
    echo "   ✓ Build successful"
else
    echo "   ✗ Build failed! Check /tmp/build-output.log"
    tail -20 /tmp/build-output.log
    exit 1
fi

# Verify database
echo ""
echo "4. Verifying database..."
DB_URL=$(grep DATABASE_URL .env.local | cut -d '=' -f2)
COMMUNITY_COUNT=$(psql "$DB_URL" -t -c "SELECT COUNT(*) FROM communities;" 2>/dev/null | xargs)
POST_COUNT=$(psql "$DB_URL" -t -c "SELECT COUNT(*) FROM posts;" 2>/dev/null | xargs)

if [ ! -z "$COMMUNITY_COUNT" ] && [ ! -z "$POST_COUNT" ]; then
    echo "   ✓ Database OK: $COMMUNITY_COUNT communities, $POST_COUNT posts"
else
    echo "   ⚠  Could not verify database"
fi

echo ""
echo "================================"
echo "✅ Clean build complete!"
echo ""
echo "To start the server:"
echo "  npm run dev"
echo ""
echo "Then test these URLs:"
echo "  http://localhost:3000"
echo "  http://localhost:3000/m/biology"
echo "  http://localhost:3000/m/ml-research"
echo ""
