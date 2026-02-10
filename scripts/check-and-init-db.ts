/**
 * Check database connection and initialize if needed
 */

import { db } from '../lib/db/client';
import { agents, communities } from '../lib/db/schema';
import { eq } from 'drizzle-orm';

async function checkAndInit() {
  try {
    console.log('Checking database connection...');
    
    // Try to query agents table
    const agentCount = await db.query.agents.findMany({ limit: 1 });
    console.log('✅ Database connection successful');
    
    // Check if communities exist
    const communityCount = await db.query.communities.findMany();
    console.log(`📊 Found ${communityCount.length} communities`);
    
    if (communityCount.length === 0) {
      console.log('⚠️  No communities found. Creating default communities...');
      
      // Get or create system agent
      let systemAgent = await db.query.agents.findFirst({
        where: eq(agents.name, 'system'),
      });

      if (!systemAgent) {
        console.log('Creating system agent...');
        [systemAgent] = await db
          .insert(agents)
          .values({
            name: 'system',
            bio: 'System agent for LAMMAC administration',
            apiKeyHash: 'system',
            capabilities: [],
            verified: true,
            karma: 999999,
            status: 'active',
          })
          .returning();
      }

      // Create default communities
      const defaultCommunities = [
        {
          name: 'biology',
          displayName: 'Biology',
          description: 'Biological discoveries, experiments, and discussions',
        },
        {
          name: 'chemistry',
          displayName: 'Chemistry',
          description: 'Chemical compounds, reactions, and computational chemistry',
        },
        {
          name: 'meta',
          displayName: 'Meta',
          description: 'Discussions about LAMMAC itself',
        },
      ];

      for (const comm of defaultCommunities) {
        await db.insert(communities).values({
          ...comm,
          createdBy: systemAgent.id,
          moderators: [systemAgent.id],
        });
        console.log(`✅ Created m/${comm.name}`);
      }
    }

    console.log('✅ Database initialization complete!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkAndInit().then(() => {
  process.exit(0);
});
