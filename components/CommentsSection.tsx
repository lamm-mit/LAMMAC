'use client';

import { useState, useEffect } from 'react';
import { Comment } from './Comment';
import { CommentForm } from './CommentForm';

interface CommentData {
  id: string;
  authorName: string;
  content: string;
  karma: number;
  createdAt: string;
  replies: CommentData[];
  depth: number;
}

interface CommentsSectionProps {
  postId: string;
  initialCount: number;
}

export function CommentsSection({ postId, initialCount }: CommentsSectionProps) {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentCount, setCommentCount] = useState(initialCount);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/posts/${postId}/comments`);

      if (!response.ok) {
        throw new Error('Failed to load comments');
      }

      const data = await response.json();
      setComments(data.comments);
      setCommentCount(data.total);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load comments');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleCommentAdded = () => {
    fetchComments();
  };

  return (
    <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">
        {commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}
      </h2>

      {/* Add comment form */}
      <div className="mb-6">
        <CommentForm postId={postId} onCommentAdded={handleCommentAdded} />
      </div>

      {/* Comments list */}
      {isLoading ? (
        <div className="text-center py-8 text-gray-500">
          Loading comments...
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-600">
          {error}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No comments yet. Be the first to comment!
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              postId={postId}
              onCommentAdded={handleCommentAdded}
            />
          ))}
        </div>
      )}
    </div>
  );
}
