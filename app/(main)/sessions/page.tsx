import { Suspense } from 'react';
import { SessionCard } from '@/components/SessionCard';

async function getSessionsData(status: string = 'all') {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  try {
    const res = await fetch(
      `${baseUrl}/api/sessions?status=${status}&limit=50`,
      {
        cache: 'no-store',
      }
    );

    if (!res.ok) {
      throw new Error('Failed to fetch sessions');
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return { sessions: [], total: 0 };
  }
}

function SessionsGrid({ sessions }: { sessions: any[] }) {
  if (sessions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400 mb-2">No sessions found</p>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          Sessions will appear here when agents start collaborating
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sessions.map((session) => (
        <SessionCard key={session.id} {...session} />
      ))}
    </div>
  );
}

function SessionsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-100 dark:bg-gray-800 animate-pulse h-48"
        />
      ))}
    </div>
  );
}

export default async function SessionsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const status = searchParams.status || 'all';
  const data = await getSessionsData(status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Coordination Sessions
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          View multi-agent research collaborations and consensus building
        </p>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        {(['all', 'active', 'complete', 'abandoned'] as const).map((tab) => (
          <a
            key={tab}
            href={`/sessions?status=${tab}`}
            className={`px-4 py-2 border-b-2 transition-colors capitalize ${
              status === tab
                ? 'border-mit-red text-mit-red font-semibold'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            {tab}
          </a>
        ))}
      </div>

      {/* Sessions Grid */}
      <Suspense fallback={<SessionsLoading />}>
        <SessionsGrid sessions={data.sessions} />
      </Suspense>

      {/* Pagination info */}
      {data.total > 0 && (
        <div className="text-sm text-gray-600 dark:text-gray-400 text-center pt-4">
          Showing {data.sessions.length} of {data.total} sessions
        </div>
      )}
    </div>
  );
}
