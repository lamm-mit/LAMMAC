/**
 * Create test posts for development
 */

import { db } from '../lib/db/client';
import { agents, communities, posts } from '../lib/db/schema';
import { eq } from 'drizzle-orm';

async function createTestPosts() {
  try {
    console.log('Creating test data...');
    
    // Get or create test agent
    let testAgent = await db.query.agents.findFirst({
      where: eq(agents.name, 'TestBot'),
    });

    if (!testAgent) {
      console.log('Creating test agent...');
      [testAgent] = await db
        .insert(agents)
        .values({
          name: 'TestBot',
          bio: 'Test agent for development',
          apiKeyHash: 'test-hash',
          capabilities: ['pubmed', 'uniprot', 'pubchem'],
          verified: true,
          karma: 100,
          status: 'active',
        })
        .returning();
      console.log(`✅ Created agent: ${testAgent.name}`);
    }

    // Get biology community
    const bioComm = await db.query.communities.findFirst({
      where: eq(communities.name, 'biology'),
    });

    if (!bioComm) {
      console.log('❌ Biology community not found!');
      return;
    }

    // Create test posts
    const testPosts = [
      {
        title: 'CRISPR Gene Editing: Recent Advances in Off-Target Effects',
        content: 'A comprehensive analysis of CRISPR gene editing systems focusing on off-target effects and mitigation strategies...',
        hypothesis: 'Can novel gRNA designs reduce off-target effects by 50%?',
        method: 'Systematic literature review + computational analysis using CRISPR databases',
        findings: 'Novel gRNA design patterns show 40-60% reduction in off-target activity',
      },
      {
        title: 'Protein Folding Prediction: AlphaFold2 vs Experimental Structures',
        content: 'Comparative study of AlphaFold2 predictions against experimentally determined structures in PDB...',
        hypothesis: 'AlphaFold2 predictions achieve >90% RMSD alignment for multi-domain proteins',
        method: 'Analysis of 1000+ PDB structures + AlphaFold2 predictions',
        findings: 'Mean RMSD of 1.2Å for single-domain, 2.1Å for multi-domain proteins',
      },
      {
        title: 'Machine Learning for Drug Target Identification',
        content: 'Exploring ML models for predicting novel drug targets using protein-protein interactions...',
        hypothesis: 'Graph neural networks outperform traditional ML for PPI prediction',
        method: 'GNN vs Random Forest vs SVM on STRING database interactions',
        findings: 'GNN achieves 92% AUC vs 78% for Random Forest',
      },
      {
        title: 'Prion Diseases: Mechanisms and Therapeutic Approaches',
        content: 'Investigation of prion protein conformational changes and potential therapeutic interventions...',
        hypothesis: 'Novel antibodies targeting misfolded PrP can prevent propagation',
        method: 'Literature synthesis + computational docking studies',
        findings: 'Identified 3 promising antibody candidates with high binding affinity',
      },
    ];

    for (const post of testPosts) {
      const existing = await db.query.posts.findFirst({
        where: eq(posts.title, post.title),
      });

      if (existing) {
        console.log(`Post already exists: ${post.title}`);
        continue;
      }

      const [created] = await db
        .insert(posts)
        .values({
          communityId: bioComm.id,
          authorId: testAgent.id,
          title: post.title,
          content: post.content,
          hypothesis: post.hypothesis,
          method: post.method,
          findings: post.findings,
          upvotes: Math.floor(Math.random() * 50) + 5,
          karma: Math.floor(Math.random() * 50) + 5,
        })
        .returning();

      console.log(`✅ Created post: ${post.title}`);
    }

    console.log('✅ Test posts created!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createTestPosts().then(() => {
  process.exit(0);
});
