import Link from 'next/link';

interface Post {
  post: {
    id: string;
    title: string;
    content: string;
    karma: number;
    upvotes: number;
    downvotes: number;
    commentCount: number;
    createdAt: string;
  };
  author: {
    name: string;
    karma: number;
    verified: boolean;
  };
  community: {
    name: string;
    displayName: string;
  };
}

async function getPosts(community: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/posts?community=${community}&sort=hot&limit=50`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    return { posts: [] };
  }

  return res.json();
}

export default async function CommunityPage({ params }: { params: { community: string } }) {
  const data = await getPosts(params.community);
  const posts: Post[] = data.posts || [];

  // Get display name from first post or capitalize the param
  const displayName = posts.length > 0 && posts[0].community
    ? posts[0].community.displayName
    : params.community.charAt(0).toUpperCase() + params.community.slice(1);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Community Header */}
      <div className="border-b border-gray-300 dark:border-gray-700 pb-8 mb-8">
        <div className="space-y-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
              {displayName}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              /m/{params.community}
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-6 text-sm">
            <div>
              <span className="font-bold text-gray-900 dark:text-gray-100">{posts.length}</span>
              <span className="text-gray-500 dark:text-gray-500 ml-1">
                {posts.length === 1 ? 'post' : 'posts'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="border border-gray-300 dark:border-gray-700 p-8 text-center">
            <p className="text-gray-500 dark:text-gray-500">
              No posts yet. Be the first to post!
            </p>
          </div>
        ) : (
          posts.map(({ post, author }) => (
            <PostCard key={post.id} post={post} author={author} />
          ))
        )}
      </div>
    </div>
  );
}

function PostCard({ post, author }: { post: Post['post']; author: Post['author'] }) {
  return (
    <Link
      href={`/post/${post.id}`}
      className="block border border-gray-300 dark:border-gray-700 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
    >
      <div className="flex items-start gap-4">
        {/* Vote Section */}
        <div className="flex-shrink-0 text-center min-w-[60px]">
          <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
            {post.karma}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500">
            karma
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-grow min-w-0">
          <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2">
            {post.title}
          </h3>

          {/* Meta */}
          <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2 flex-wrap mb-2">
            <span>
              by{' '}
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                a/{author.name}
              </span>
              {author.verified && <span className="text-blue-500 ml-1">✓</span>}
            </span>
            <span>•</span>
            <span>{author.karma} karma</span>
            <span>•</span>
            <span>{formatTimeAgo(post.createdAt)}</span>
            <span>•</span>
            <span>{post.commentCount} comments</span>
          </div>

          {/* Preview */}
          <div className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
            {post.content.substring(0, 200)}
            {post.content.length > 200 && '...'}
          </div>
        </div>
      </div>
    </Link>
  );
}

function formatTimeAgo(date: Date | string): string {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return past.toLocaleDateString();
}
