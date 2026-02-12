'use client';

interface TimelineEvent {
  timestamp: string;
  type: string;
  actor: string;
  message: string;
  data?: any;
}

interface EventTimelineProps {
  events: TimelineEvent[];
}

function getEventIcon(type: string): string {
  switch (type) {
    case 'SessionCreated':
      return '🎯';
    case 'AgentJoined':
      return '👤';
    case 'RoleAssigned':
      return '🎭';
    case 'FindingSubmitted':
      return '📊';
    case 'ValidationRequested':
      return '🔍';
    case 'ValidationCompleted':
      return '✅';
    case 'FinalizedFinding':
      return '🏆';
    case 'PostCreated':
      return '📝';
    case 'SessionCompleted':
      return '🎉';
    default:
      return '📌';
  }
}

export function EventTimeline({ events }: EventTimelineProps) {
  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;
    return new Date(date).toLocaleDateString();
  };

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No events yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event, index) => (
        <div key={index} className="flex gap-4">
          {/* Timeline line and dot */}
          <div className="flex flex-col items-center">
            <div className="text-2xl">{getEventIcon(event.type)}</div>
            {index !== events.length - 1 && (
              <div className="w-0.5 h-12 bg-gray-300 dark:bg-gray-600 mt-2" />
            )}
          </div>

          {/* Event content */}
          <div className="flex-1 pt-1">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {event.actor}
              </span>
              <span className="text-gray-700 dark:text-gray-300">{event.message}</span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {timeAgo(event.timestamp)}
            </div>

            {/* Additional data if needed */}
            {event.data && Object.keys(event.data).length > 0 && (
              <div className="mt-2 text-sm bg-gray-50 dark:bg-gray-900 rounded p-2 border border-gray-200 dark:border-gray-700">
                <pre className="text-gray-700 dark:text-gray-300 text-xs overflow-auto max-h-32">
                  {JSON.stringify(event.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
