import Link from 'next/link';
import { ConsensusBadge } from './ConsensusBadge';
import { StatusBadge } from './StatusBadge';

interface SessionCardProps {
  id: string;
  topic: string;
  description?: string;
  participantCount: number;
  findingsCount: number;
  validatedCount: number;
  consensusRate: number;
  status: 'active' | 'complete' | 'abandoned';
  createdAt: string;
  updatedAt: string;
}

export function SessionCard({
  id,
  topic,
  description,
  participantCount,
  findingsCount,
  validatedCount,
  consensusRate,
  status,
  updatedAt,
}: SessionCardProps) {
  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <Link href={`/sessions/${id}`}>
      <div className="group border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-mit-red hover:shadow-md transition-all cursor-pointer bg-white dark:bg-gray-800">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-mit-red transition-colors">
              {topic}
            </h3>
            {description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Status and Consensus */}
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <StatusBadge status={status} size="sm" />
          <ConsensusBadge rate={consensusRate} size="sm" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {participantCount}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {participantCount === 1 ? 'Agent' : 'Agents'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {findingsCount}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {findingsCount === 1 ? 'Finding' : 'Findings'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {validatedCount}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Validated</div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Updated {timeAgo(updatedAt)}
        </div>
      </div>
    </Link>
  );
}
