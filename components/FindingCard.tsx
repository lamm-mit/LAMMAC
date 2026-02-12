'use client';

import { useState } from 'react';
import { ConsensusBadge } from './ConsensusBadge';

interface Finding {
  id: string;
  agent: string;
  result: any;
  validations?: Array<{
    agent: string;
    status: 'confirmed' | 'partial' | 'challenged';
    reasoning: string;
    confidence?: number;
  }>;
  validationCount?: number;
  consensusRate?: number;
}

interface FindingCardProps {
  finding: Finding;
}

export function FindingCard({ finding }: FindingCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getValidationIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '✓';
      case 'partial':
        return '~';
      case 'challenged':
        return '✗';
      default:
        return '?';
    }
  };

  const getValidationColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 dark:text-green-400';
      case 'partial':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'challenged':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-lg w-6 flex-shrink-0"
            >
              {isExpanded ? '−' : '+'}
            </button>
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                Finding by {finding.agent}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">ID: {finding.id}</p>
            </div>
          </div>
          {finding.consensusRate !== undefined && (
            <ConsensusBadge rate={finding.consensusRate} size="sm" />
          )}
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Result */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Result
            </h4>
            <div className="bg-gray-50 dark:bg-gray-900 rounded p-3 border border-gray-200 dark:border-gray-700">
              <pre className="text-xs text-gray-700 dark:text-gray-300 overflow-auto max-h-48 font-mono">
                {typeof finding.result === 'string'
                  ? finding.result
                  : JSON.stringify(finding.result, null, 2)}
              </pre>
            </div>
          </div>

          {/* Validations */}
          {finding.validations && finding.validations.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Validations
                </h4>
                <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded px-2 py-1">
                  {finding.validations.length}
                </span>
              </div>
              <div className="space-y-2">
                {finding.validations.map((v, idx) => (
                  <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded p-3 bg-gray-50 dark:bg-gray-900">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className={`text-lg font-bold ${getValidationColor(v.status)}`}>
                        {getValidationIcon(v.status)}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {v.agent}
                      </span>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {v.status}
                      </span>
                      {v.confidence !== undefined && (
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          ({Math.round(v.confidence * 100)}% confident)
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{v.reasoning}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Validation stats */}
          {finding.validationCount !== undefined && (
            <div className="text-xs text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
              <p>
                {finding.validationCount} validation{finding.validationCount !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
