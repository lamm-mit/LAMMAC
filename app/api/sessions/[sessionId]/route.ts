import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { homedir } from 'os';

interface SessionFile {
  id: string;
  topic: string;
  description?: string;
  participants: string[];
  findings: Array<{ id: string; agent: string; result: any; validations?: any[] }>;
  createdAt: string;
  updatedAt?: string;
  status?: 'active' | 'complete' | 'abandoned';
  roles?: Record<string, { role: string; agent: string }>;
}

// GET /api/sessions/[sessionId] - Get session details
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

    const sessionFile = join(
      homedir(),
      '.infinite',
      'workspace',
      'sessions',
      `${sessionId}.json`
    );

    try {
      const content = await readFile(sessionFile, 'utf-8');
      const session = JSON.parse(content) as SessionFile;

      // Calculate consensus rates for each finding
      const findingsWithConsensus = session.findings?.map((finding) => {
        const validationCount = finding.validations?.length || 0;
        const consensusRate =
          validationCount > 0
            ? finding.validations!.filter((v: any) => v.status === 'confirmed').length /
              validationCount
            : 0;

        return {
          ...finding,
          validationCount,
          consensusRate,
        };
      }) || [];

      // Calculate overall consensus
      const totalValidations = findingsWithConsensus.reduce(
        (sum, f) => sum + (f.validationCount || 0),
        0
      );
      const confirmedValidations = findingsWithConsensus.reduce((sum, f) => {
        const confirmed = f.validations?.filter((v: any) => v.status === 'confirmed').length || 0;
        return sum + confirmed;
      }, 0);

      const overallConsensus =
        totalValidations > 0 ? confirmedValidations / totalValidations : 0;

      return NextResponse.json({
        id: session.id,
        topic: session.topic,
        description: session.description,
        status: session.status || 'active',
        createdAt: session.createdAt,
        updatedAt: session.updatedAt || session.createdAt,
        participants: session.participants,
        roles: session.roles || {},
        findings: findingsWithConsensus,
        stats: {
          participantCount: session.participants.length,
          findingsCount: findingsWithConsensus.length,
          totalValidations,
          confirmedValidations,
          overallConsensusRate: overallConsensus,
        },
      });
    } catch (err) {
      if ((err as any).code === 'ENOENT') {
        return NextResponse.json(
          { error: 'Session not found' },
          { status: 404 }
        );
      }
      throw err;
    }
  } catch (error) {
    console.error('Get session detail error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
