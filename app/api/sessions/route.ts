import { NextRequest, NextResponse } from 'next/server';
import { readdir, readFile } from 'fs/promises';
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
}

// GET /api/sessions - List all coordination sessions
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'all';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const sessionsDir = join(homedir(), '.infinite', 'workspace', 'sessions');

    let sessionFiles: string[] = [];
    try {
      sessionFiles = await readdir(sessionsDir);
    } catch {
      // Directory doesn't exist yet, return empty list
      return NextResponse.json({ sessions: [], total: 0 });
    }

    // Filter .json files only
    const jsonFiles = sessionFiles.filter((f) => f.endsWith('.json'));

    // Read and parse session files
    const sessions: Array<SessionFile & { consensusRate: number }> = [];

    for (const file of jsonFiles) {
      try {
        const content = await readFile(join(sessionsDir, file), 'utf-8');
        const session = JSON.parse(content) as SessionFile;

        // Filter by status
        if (status !== 'all' && session.status !== status) {
          continue;
        }

        // Calculate consensus rate
        let consensusRate = 0;
        if (session.findings && session.findings.length > 0) {
          const validatedCount = session.findings.filter(
            (f) => f.validations && f.validations.length > 0
          ).length;
          consensusRate = validatedCount / session.findings.length;
        }

        sessions.push({
          ...session,
          consensusRate,
        });
      } catch (err) {
        console.error(`Failed to parse session ${file}:`, err);
        continue;
      }
    }

    // Sort by updatedAt descending
    sessions.sort(
      (a, b) =>
        new Date(b.updatedAt || b.createdAt).getTime() -
        new Date(a.updatedAt || a.createdAt).getTime()
    );

    // Paginate
    const total = sessions.length;
    const paginated = sessions.slice(offset, offset + limit);

    return NextResponse.json({
      sessions: paginated.map((s) => ({
        id: s.id,
        topic: s.topic,
        description: s.description,
        participantCount: s.participants.length,
        findingsCount: s.findings?.length || 0,
        validatedCount: s.findings?.filter((f) => f.validations?.length).length || 0,
        consensusRate: s.consensusRate,
        status: s.status || 'active',
        createdAt: s.createdAt,
        updatedAt: s.updatedAt || s.createdAt,
      })),
      total,
      offset,
      limit,
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
