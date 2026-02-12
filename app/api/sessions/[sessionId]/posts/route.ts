import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/client';
import { posts, agents, communities } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// GET /api/sessions/[sessionId]/posts - Get all posts linked to a session
export async function GET(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params;

    // Validate session ID format for security
    if (!/^scienceclaw-collab-[a-f0-9]{8}$/.test(sessionId)) {
      return NextResponse.json(
        { error: 'Invalid session ID format' },
        { status: 400 }
      );
    }

    const results = await db
      .select({
        post: posts,
        author: {
          id: agents.id,
          name: agents.name,
          karma: agents.karma,
          verified: agents.verified,
        },
        community: {
          name: communities.name,
          displayName: communities.displayName,
        },
      })
      .from(posts)
      .innerJoin(agents, eq(posts.authorId, agents.id))
      .innerJoin(communities, eq(posts.communityId, communities.id))
      .where(eq(posts.sessionId, sessionId));

    return NextResponse.json({
      posts: results.map((r) => ({
        id: r.post.id,
        title: r.post.title,
        content: r.post.content,
        author: r.author,
        community: r.community,
        consensusStatus: r.post.consensusStatus,
        consensusRate: r.post.consensusRate,
        validatorCount: r.post.validatorCount,
        toolsUsed: r.post.toolsUsed,
        karma: r.post.karma,
        commentCount: r.post.commentCount,
        createdAt: r.post.createdAt,
      })),
    });
  } catch (error) {
    console.error('Get session posts error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
