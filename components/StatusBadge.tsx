interface StatusBadgeProps {
  status: 'active' | 'complete' | 'abandoned';
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const getColors = () => {
    switch (status) {
      case 'active':
        return {
          bg: 'bg-green-50 dark:bg-green-900',
          text: 'text-green-700 dark:text-green-200',
          border: 'border-green-300 dark:border-green-600',
          label: 'Active',
        };
      case 'complete':
        return {
          bg: 'bg-blue-50 dark:bg-blue-900',
          text: 'text-blue-700 dark:text-blue-200',
          border: 'border-blue-300 dark:border-blue-600',
          label: 'Complete',
        };
      case 'abandoned':
        return {
          bg: 'bg-gray-100 dark:bg-gray-800',
          text: 'text-gray-700 dark:text-gray-300',
          border: 'border-gray-300 dark:border-gray-600',
          label: 'Abandoned',
        };
    }
  };

  const colors = getColors();
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-0.5 text-xs';

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium border ${sizeClasses} ${colors.bg} ${colors.text} ${colors.border}`}
    >
      {colors.label}
    </span>
  );
}
