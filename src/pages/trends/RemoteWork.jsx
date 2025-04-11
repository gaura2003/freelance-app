import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Share2, MessageCircle, Heart, Bookmark } from "lucide-react";

const TrendRemoteWork = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPosts([
        {
          id: "p1",
          title: "How I Built a Successful Remote Work Routine",
          content: "After years of working remotely, I've developed a system that helps me stay productive and maintain work-life balance...",
          author: {
            id: "u1",
            name: "Alex Johnson",
            avatar: "https://i.pravatar.cc/150?img=1",
            title: "Digital Nomad & Web Developer"
          },
          likes: 124,
          comments: 32,
          createdAt: "2023-09-15T10:30:00Z"
        },
        {
          id: "p2",
          title: "Best Tools for Remote Collaboration in 2023",
          content: "The right tools can make or break your remote work experience. Here are the top 10 tools my team uses for seamless collaboration...",
          author: {
            id: "u2",
            name: "Sarah Miller",
            avatar: "https://i.pravatar.cc/150?img=5",
            title: "Project Manager & Remote Work Consultant"
          },
          likes: 98,
          comments: 21,
          createdAt: "2023-09-18T14:20:00Z"
        },
        {
          id: "p3",
          title: "Remote Work Policy Template for Small Businesses",
          content: "Creating a clear remote work policy is essential. Here's a template I've used with multiple clients that you can adapt...",
          author: {
            id: "u3",
            name: "Michael Chen",
            avatar: "https://i.pravatar.cc/150?img=8",
            title: "HR Consultant & Business Coach"
          },
          likes: 76,
          comments: 15,
          createdAt: "2023-09-20T09:15:00Z"
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
        <ArrowLeft size={16} className="mr-1" />
          Back to Home
        </Link>
        
        <div className="mt-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">#RemoteWork</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Explore the latest posts, tips, and discussions about remote work.
          </p>
          <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
            <span>1,234 posts</span>
            <span className="mx-2">•</span>
            <span>5,678 followers</span>
          </div>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 text-sm">
            Follow Trend
          </button>
        </div>
      </div>
      
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
            {/* Post Header */}
            <div className="px-4 py-4 sm:px-6 flex items-center">
              <img 
                src={post.author.avatar} 
                alt={post.author.name} 
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {post.author.name}
                </p>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <span>{post.author.title}</span>
                  <span className="mx-1">•</span>
                  <span>{formatDate(post.createdAt)}</span>
                </div>
              </div>
            </div>
            
            {/* Post Content */}
            <div className="px-4 sm:px-6 py-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {post.title}
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {post.content}
              </p>
              <Link to={`/posts/${post.id}`} className="mt-2 inline-block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                Read more
              </Link>
            </div>
            
            {/* Post Stats */}
            <div className="px-4 sm:px-6 py-2 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-1">
                <span className="text-blue-500">❤️</span>
                <span>{post.likes} likes</span>
              </div>
              <div>
                <span>{post.comments} comments</span>
              </div>
            </div>
            
            {/* Post Actions */}
            <div className="px-4 sm:px-6 py-2 flex items-center justify-between border-t border-gray-100 dark:border-gray-700">
              <button className="flex items-center space-x-1 px-3 py-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700">
                <Heart size={18} />
                <span>Like</span>
              </button>
              
              <Link 
                to={`/posts/${post.id}#comments`}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <MessageCircle size={18} />
                <span>Comment</span>
              </Link>
              
              <button className="flex items-center space-x-1 px-3 py-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700">
                <Share2 size={18} />
                <span>Share</span>
              </button>
              
              <button className="flex items-center space-x-1 px-3 py-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700">
                <Bookmark size={18} />
                <span>Save</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendRemoteWork;

