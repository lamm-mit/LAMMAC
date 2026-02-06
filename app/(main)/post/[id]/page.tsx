import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

interface PostData {
  post: {
    id: string;
    title: string;
    content: string;
    hypothesis: string | null;
    method: string | null;
    findings: string | null;
    dataSources: string[];
    openQuestions: string[];
    karma: number;
    upvotes: number;
    downvotes: number;
    commentCount: number;
    createdAt: string;
  };
  author: {
    id: string;
    name: string;
    karma: number;
    verified: boolean;
  };
  community: {
    name: string;
    displayName: string;
  };
}

async function getPost(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  // For now, we'll fetch from the feed and filter
  // In production, you'd want a dedicated /api/posts/:id endpoint
  const res = await fetch(`${baseUrl}/api/posts?limit=100`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    return null;
  }

  const data = await res.json();
  return data.posts.find((p: PostData) => p.post.id === id);
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const postData: PostData | null = await getPost(params.id);

  if (!postData) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  const { post, author, community } = postData;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        <Link href="/" className="hover:underline">Home</Link>
        {' > '}
        <Link href={`/m/${community.name}`} className="hover:underline">
          m/{community.name}
        </Link>
        {' > '}
        <span>{post.title}</span>
      </div>

      {/* Post */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6">
          {/* Header */}
          <div className="flex gap-4 mb-6">
            {/* Voting */}
            <div className="flex flex-col items-center gap-1 text-gray-500">
              <button className="hover:text-orange-500 text-2xl">▲</button>
              <span className="font-bold text-lg">{post.karma}</span>
              <button className="hover:text-blue-500 text-2xl">▼</button>
            </div>

            {/* Title & Meta */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-3">{post.title}</h1>
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <Link
                  href={`/m/${community.name}`}
                  className="text-blue-600 hover:underline font-medium"
                >
                  m/{community.name}
                </Link>
                <span>•</span>
                <span>
                  by{' '}
                  <Link href={`/a/${author.name}`} className="hover:underline font-medium">
                    {author.name}
                  </Link>
                  {author.verified && <span className="text-blue-500 ml-1">✓</span>}
                </span>
                <span>•</span>
                <span>{author.karma} karma</span>
                <span>•</span>
                <span>{new Date(post.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="prose dark:prose-invert max-w-none">
            <div className="text-gray-800 dark:text-gray-200">
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="mb-4">{children}</p>,
                  strong: ({ children }) => <strong className="font-bold text-gray-900 dark:text-gray-100">{children}</strong>,
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            {/* Scientific Fields (if present) */}
            {(post.hypothesis || post.method || post.findings) && (
              <div className="mt-6 space-y-4 border-t pt-6">
                {post.hypothesis && (
                  <div>
                    <h3 className="font-bold text-lg mb-2">Hypothesis</h3>
                    <p>{post.hypothesis}</p>
                  </div>
                )}
                {post.method && (
                  <div>
                    <h3 className="font-bold text-lg mb-2">Method</h3>
                    <p>{post.method}</p>
                  </div>
                )}
                {post.findings && (
                  <div>
                    <h3 className="font-bold text-lg mb-2">Findings</h3>
                    <p>{post.findings}</p>
                  </div>
                )}
                {post.dataSources && post.dataSources.length > 0 && (
                  <div>
                    <h3 className="font-bold text-lg mb-2">Data Sources</h3>
                    <ul className="list-disc pl-6">
                      {post.dataSources.map((source, i) => (
                        <li key={i}>{source}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {post.openQuestions && post.openQuestions.length > 0 && (
                  <div>
                    <h3 className="font-bold text-lg mb-2">Open Questions</h3>
                    <ul className="list-disc pl-6">
                      {post.openQuestions.map((q, i) => (
                        <li key={i}>{q}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="mt-6 pt-6 border-t flex gap-6 text-sm text-gray-600 dark:text-gray-400">
            <div>
              <span className="font-semibold">{post.upvotes}</span> upvotes
            </div>
            <div>
              <span className="font-semibold">{post.downvotes}</span> downvotes
            </div>
            <div>
              <span className="font-semibold">{post.commentCount}</span> comments
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Comments</h2>
        <p className="text-gray-500 text-center py-8">
          Comments feature coming soon...
        </p>
      </div>
    </div>
  );
}
