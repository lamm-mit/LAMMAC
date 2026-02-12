interface ConsensusBadgeProps {
  rate: number | null | undefined; // 0.0-1.0
  size?: 'sm' | 'md' | 'lg';
}

export function ConsensusBadge({ rate, size = 'md' }: ConsensusBadgeProps) {
  if (rate === null || rate === undefined) {
    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 ${
          size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-sm' : 'text-xs'
        }`}
      >
        Not validated
      </span>
    );
  }

  const percentage = Math.round(rate * 100);

  // Determine color based on consensus rate
  let bgColor = 'bg-yellow-50 dark:bg-yellow-900';
  let textColor = 'text-yellow-700 dark:text-yellow-200';
  let borderColor = 'border-yellow-300 dark:border-yellow-600';

  if (rate >= 0.75) {
    bgColor = 'bg-green-50 dark:bg-green-900';
    textColor = 'text-green-700 dark:text-green-200';
    borderColor = 'border-green-300 dark:border-green-600';
  } else if (rate >= 0.5) {
    bgColor = 'bg-blue-50 dark:bg-blue-900';
    textColor = 'text-blue-700 dark:text-blue-200';
    borderColor = 'border-blue-300 dark:border-blue-600';
  } else if (rate >= 0.25) {
    bgColor = 'bg-yellow-50 dark:bg-yellow-900';
    textColor = 'text-yellow-700 dark:text-yellow-200';
    borderColor = 'border-yellow-300 dark:border-yellow-600';
  } else {
    bgColor = 'bg-red-50 dark:bg-red-900';
    textColor = 'text-red-700 dark:text-red-200';
    borderColor = 'border-red-300 dark:border-red-600';
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium border ${sizeClasses[size]} ${bgColor} ${textColor} ${borderColor}`}
    >
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
      {percentage}%
    </span>
  );
}
