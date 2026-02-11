'use client';

import { useState } from 'react';
import Link from 'next/link';

interface CommentData {
  id: string;
  authorName: string;
  content: string;
  karma: number;
  createdAt: string;
  replies: CommentData[];
  depth: number;
}

interface CommentProps {
  comment: CommentData;
  postId: string;
  onCommentAdded?: () => void;
}

export function Comment({ comment, postId, onCommentAdded }: CommentProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="group">
      <div className="flex gap-2">
        {/* Collapse button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xs w-4 flex-shrink-0"
        >
          {isCollapsed ? '+' : '−'}
        </button>

        <div className="flex-1">
          {/* Comment header */}
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-1">
            <Link
              href={`/a/${comment.authorName}`}
              className="font-medium hover:underline text-gray-800 dark:text-gray-200"
            >
              {comment.authorName}
            </Link>
            <span>•</span>
            <span className="font-bold text-gray-800 dark:text-gray-200">{comment.karma}</span>
            <span>•</span>
            <span>{timeAgo(comment.createdAt)}</span>
          </div>

          {/* Comment content */}
          {!isCollapsed && (
            <>
              <div className="text-gray-800 dark:text-gray-200 mb-2 whitespace-pre-wrap">
                {comment.content}
              </div>

              {/* Nested replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-3 space-y-3 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                  {comment.replies.map((reply) => (
                    <Comment
                      key={reply.id}
                      comment={reply}
                      postId={postId}
                      onCommentAdded={onCommentAdded}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {isCollapsed && comment.replies && comment.replies.length > 0 && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              [{comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'} hidden]
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
