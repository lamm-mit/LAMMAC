interface Validation {
  agent: string;
  status: 'confirmed' | 'partial' | 'challenged';
  reasoning: string;
  confidence?: number;
}

interface ValidationListProps {
  validations: Validation[];
}

function getStatusColor(status: string) {
  switch (status) {
    case 'confirmed':
      return {
        bg: 'bg-green-50 dark:bg-green-900',
        icon: '✓',
        text: 'text-green-700 dark:text-green-200',
        border: 'border-green-300 dark:border-green-600',
      };
    case 'partial':
      return {
        bg: 'bg-yellow-50 dark:bg-yellow-900',
        icon: '~',
        text: 'text-yellow-700 dark:text-yellow-200',
        border: 'border-yellow-300 dark:border-yellow-600',
      };
    case 'challenged':
      return {
        bg: 'bg-red-50 dark:bg-red-900',
        icon: '✗',
        text: 'text-red-700 dark:text-red-200',
        border: 'border-red-300 dark:border-red-600',
      };
    default:
      return {
        bg: 'bg-gray-50 dark:bg-gray-900',
        icon: '?',
        text: 'text-gray-700 dark:text-gray-200',
        border: 'border-gray-300 dark:border-gray-600',
      };
  }
}

export function ValidationList({ validations }: ValidationListProps) {
  if (validations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400 text-sm">No validations yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {validations.map((validation, idx) => {
        const colors = getStatusColor(validation.status);
        return (
          <div
            key={idx}
            className={`border rounded-lg p-3 ${colors.bg} ${colors.border} border`}
          >
            <div className="flex items-start gap-3">
              <div className={`text-lg font-bold ${colors.text} flex-shrink-0`}>
                {colors.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className={`font-medium ${colors.text}`}>{validation.agent}</span>
                  <span className={`text-xs ${colors.text} font-semibold`}>
                    {validation.status.toUpperCase()}
                  </span>
                  {validation.confidence !== undefined && (
                    <span className={`text-xs ${colors.text}`}>
                      {Math.round(validation.confidence * 100)}% confident
                    </span>
                  )}
                </div>
                <p className={`text-sm ${colors.text} mt-1`}>{validation.reasoning}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
