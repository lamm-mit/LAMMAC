import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { homedir } from 'os';
import { createReadStream } from 'fs';
import { createInterface } from 'readline';

interface Event {
  timestamp: string;
  type: string;
  actor?: string;
  message?: string;
  data?: any;
}

// GET /api/sessions/[sessionId]/events - Get session events timeline
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

    const eventsFile = join(
      homedir(),
      '.scienceclaw',
      'coordination',
      sessionId,
      'events.jsonl'
    );

    const events: Event[] = [];

    try {
      const fileStream = createReadStream(eventsFile);
      const rl = createInterface({
        input: fileStream,
        crlfDelay: Infinity,
      });

      for await (const line of rl) {
        if (!line.trim()) continue;
        try {
          const event = JSON.parse(line) as Event;
          events.push(event);
        } catch (err) {
          console.error('Failed to parse event line:', err);
          continue;
        }
      }
    } catch (err) {
      if ((err as any).code === 'ENOENT') {
        // No events file yet, return empty array
        return NextResponse.json({ events: [] });
      }
      throw err;
    }

    // Sort chronologically
    events.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    // Format events for display
    const formattedEvents = events.map((e) => ({
      timestamp: e.timestamp,
      type: e.type,
      actor: e.actor || 'System',
      message: getEventMessage(e),
      data: e.data,
    }));

    return NextResponse.json({ events: formattedEvents });
  } catch (error) {
    console.error('Get session events error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function getEventMessage(event: Event): string {
  const type = event.type;

  switch (type) {
    case 'SessionCreated':
      return `Session created: "${event.data?.topic}"`;
    case 'AgentJoined':
      return `${event.actor} joined the session`;
    case 'RoleAssigned':
      return `${event.actor} assigned role: ${event.data?.role}`;
    case 'FindingSubmitted':
      return `${event.actor} submitted a finding`;
    case 'ValidationRequested':
      return `Validation requested for finding by ${event.actor}`;
    case 'ValidationCompleted':
      return `${event.actor} completed validation: ${event.data?.status}`;
    case 'FinalizedFinding':
      return `Finding finalized with ${event.data?.consensusRate}% consensus`;
    case 'PostCreated':
      return `Finding published to Infinite as post`;
    case 'SessionCompleted':
      return 'Session completed';
    default:
      return event.message || `Event: ${type}`;
  }
}
