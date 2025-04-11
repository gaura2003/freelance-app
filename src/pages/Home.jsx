import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Share2, MessageCircle, UserPlus, Bookmark, Heart, MoreHorizontal } from "lucide-react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useTheme } from "../contexts/ThemeContext.jsx";

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [connections, setConnections] = useState([]);
  const [suggestedConnections, setSuggestedConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { isDark } = useTheme();
  const isLoggedIn = !!user;

  const apiBase = import.meta.env.MODE === "development"
    ? "http://localhost:5000/api"
    : "https://your-production-url.com/api";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, categoriesRes, connectionsRes, suggestedRes] = await Promise.all([
          fetch(`${apiBase}/projects`),
          fetch(`${apiBase}/categories`),
          isLoggedIn ? fetch(`${apiBase}/connections`) : Promise.resolve(null),
          isLoggedIn ? fetch(`${apiBase}/connections/suggested`) : Promise.resolve(null),
        ]);

        if (projectsRes.ok && categoriesRes.ok) {
          const projectsData = await projectsRes.json();
          const categoriesData = await categoriesRes.json();
          setProjects(projectsData);
          setCategories(categoriesData);
          
          if (isLoggedIn && connectionsRes?.ok && suggestedRes?.ok) {
            const connectionsData = await connectionsRes.json();
            const suggestedData = await suggestedRes.json();
            setConnections(connectionsData);
            setSuggestedConnections(suggestedData);
          }
        } else {
          throw new Error("API not available, loading dummy data...");
        }
      } catch (error) {
        console.error(error);

        // Dummy data fallback
        setProjects([
          { 
            _id: "1", 
            title: "Build a Portfolio Website", 
            budget: 500,
            description: "Looking for a skilled web developer to create a stunning portfolio website with responsive design.",
            skills: ["React", "Tailwind CSS", "Node.js"],
            postedBy: {
              _id: "u1",
              name: "Alex Johnson",
              avatar: "https://i.pravatar.cc/150?img=1",
              title: "Marketing Director"
            },
            likes: 24,
            comments: 8,
            createdAt: "2023-09-15T10:30:00Z"
          },
          { 
            _id: "2", 
            title: "Design a Company Logo", 
            budget: 200,
            description: "Need a professional logo design for a new tech startup. Looking for modern, clean aesthetics.",
            skills: ["Graphic Design", "Illustrator", "Branding"],
            postedBy: {
              _id: "u2",
              name: "Sarah Miller",
              avatar: "https://i.pravatar.cc/150?img=5",
              title: "Startup Founder"
            },
            likes: 18,
            comments: 5,
            createdAt: "2023-09-18T14:20:00Z"
          },
          { 
            _id: "3", 
            title: "Write SEO Articles", 
            budget: 150,
            description: "Seeking a content writer to create 5 SEO-optimized articles for a fitness blog. Each article should be 1500+ words.",
            skills: ["Content Writing", "SEO", "Research"],
            postedBy: {
              _id: "u3",
              name: "Michael Chen",
              avatar: "https://i.pravatar.cc/150?img=8",
              title: "Content Manager"
            },
            likes: 12,
            comments: 3,
            createdAt: "2023-09-20T09:15:00Z"
          },
        ]);

        setCategories([
          { _id: "1", name: "Web Development", icon: "💻", count: 145 },
          { _id: "2", name: "Graphic Design", icon: "🎨", count: 98 },
          { _id: "3", name: "Content Writing", icon: "✍️", count: 67 },
          { _id: "4", name: "Digital Marketing", icon: "📱", count: 52 },
        ]);
        
        if (isLoggedIn) {
          setConnections([
            { _id: "c1", name: "Jamie Smith", avatar: "https://i.pravatar.cc/150?img=11", title: "UX Designer", mutualConnections: 12 },
            { _id: "c2", name: "Taylor Wong", avatar: "https://i.pravatar.cc/150?img=12", title: "Frontend Developer", mutualConnections: 8 },
            { _id: "c3", name: "Jordan Lee", avatar: "https://i.pravatar.cc/150?img=13", title: "Project Manager", mutualConnections: 5 },
          ]);
          
          setSuggestedConnections([
            { _id: "s1", name: "Casey Rivera", avatar: "https://i.pravatar.cc/150?img=21", title: "Full Stack Developer", mutualConnections: 15 },
            { _id: "s2", name: "Riley Johnson", avatar: "https://i.pravatar.cc/150?img=22", title: "UI Designer", mutualConnections: 7 },
            { _id: "s3", name: "Morgan Patel", avatar: "https://i.pravatar.cc/150?img=23", title: "Content Strategist", mutualConnections: 4 },
            { _id: "s4", name: "Avery Williams", avatar: "https://i.pravatar.cc/150?img=24", title: "SEO Specialist", mutualConnections: 9 },
          ]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isLoggedIn]);

  const handleConnect = (userId) => {
    // In a real app, this would send a connection request to the API
    alert(`Connection request sent to user ${userId}`);
    
    // Update the UI optimistically
    setSuggestedConnections(prev => 
      prev.filter(connection => connection._id !== userId)
    );
    
    // Add to connections with "pending" status
    const newConnection = suggestedConnections.find(c => c._id === userId);
    if (newConnection) {
      setConnections(prev => [...prev, {...newConnection, status: 'pending'}]);
    }
  };

  const handleShare = (projectId) => {
    // In a real app, this would open a share modal with options
    const shareOptions = ["Share via Message", "Copy Link", "Share on LinkedIn", "Share on Twitter"];
    alert(`Share project ${projectId}: ${shareOptions.join(", ")}`);
  };

  const handleLike = (projectId) => {
    // Toggle like status for a project
    setProjects(prev => 
      prev.map(project => 
        project._id === projectId 
          ? {...project, liked: !project.liked, likes: project.liked ? project.likes - 1 : project.likes + 1} 
          : project
      )
    );
  };

  const handleSave = (projectId) => {
    // Toggle saved status for a project
    setProjects(prev => 
      prev.map(project => 
        project._id === projectId 
          ? {...project, saved: !project.saved} 
          : project
      )
    );
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Sidebar - Profile & Connections */}
        <div className="hidden lg:block">
          {isLoggedIn ? (
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-24"></div>
                <div className="px-4 py-5 sm:p-6 -mt-12">
                  <div className="flex flex-col items-center">
                    <img 
                      src={user?.profile?.profileImageUrl || "https://i.pravatar.cc/150?img=12"} 
                      alt="Profile" 
                      className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 object-cover"
                    />
                    <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">{user?.username || "Your Name"}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user?.profile?.title || "Your Professional Title"}</p>
                    
                    <div className="mt-4 w-full">
                      <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <span>Profile views</span>
                        <span className="font-medium">142</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                        <span>Post impressions</span>
                        <span className="font-medium">1,253</span>
                      </div>
                    </div>
                    
                    <Link to="/profile" className="mt-5 w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Connections */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Your Connections</h3>
                  
                  {connections.length > 0 ? (
                    <div className="space-y-4">
                      {connections.map(connection => (
                        <div key={connection._id} className="flex items-center">
                          <img 
                            src={connection.avatar} 
                            alt={connection.name} 
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{connection.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{connection.title}</p>
                          </div>
                          <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                            <MessageCircle size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">You don't have any connections yet.</p>
                  )}
                  
                  <Link to="/connections" className="mt-4 block text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                    See all connections
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Welcome to FreelanceHub</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Sign in to connect with other professionals and find opportunities.</p>
                <div className="space-y-3">
                  <Link to="/login" className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                    Sign In
                  </Link>
                  <Link to="/register" className="block w-full text-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    Create Account
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Main Content - Feed */}
        <div className="lg:col-span-2">
          {/* Hero Section for non-logged in users */}
          {!isLoggedIn && (
            <section className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg mb-8 p-8 text-white">
              <h1 className="text-3xl font-bold mb-4">Find Top Freelancers for Your Projects</h1>
              <p className="text-lg mb-6 opacity-90">
                Connect, collaborate, and create success with the best talents worldwide.
              </p>
              <div className="flex space-x-4">
                <Link
                  to="/register"
                  className="px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-gray-100 transition"
                >
                  Join Now
                </Link>
                <Link
                  to="/projects"
                  className="px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition"
                >
                  Explore Projects
                </Link>
              </div>
            </section>
          )}
          
                   {/* Post Project CTA for logged in users */}
                   {isLoggedIn && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow mb-8 p-6">
              <div className="flex items-center space-x-3">
                <img 
                  src={user?.profile?.profileImageUrl || "https://i.pravatar.cc/150?img=12"} 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full object-cover"
                />
                <Link 
                  to="/post-project" 
                  className="flex-grow bg-gray-100 dark:bg-gray-700 rounded-full py-2.5 px-4 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 text-left"
                >
                  Start a post...
                </Link>
              </div>
              <div className="flex justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                <Link to="/post-project" className="flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                  <span className="mr-2">📝</span>
                  <span>Post Project</span>
                </Link>
                <Link to="/upload-work" className="flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                  <span className="mr-2">🖼️</span>
                  <span>Share Work</span>
                </Link>
                <Link to="/events" className="flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                  <span className="mr-2">📅</span>
                  <span>Event</span>
                </Link>
              </div>
            </div>
          )}

          {/* Projects Feed */}
          <div className="space-y-6">
            {projects.map((project) => (
              <div key={project._id} className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
                {/* Post Header */}
                <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                  <div className="flex items-center">
                    <img 
                      src={project.postedBy.avatar} 
                      alt={project.postedBy.name} 
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {project.postedBy.name}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <span>{project.postedBy.title}</span>
                        <span className="mx-1">•</span>
                        <span>{formatDate(project.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                    <MoreHorizontal size={20} />
                  </button>
                </div>
                
                {/* Post Content */}
                <div className="px-4 sm:px-6 py-2">
                  <Link to={`/projects/${project._id}`}>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                      {project.title}
                    </h3>
                  </Link>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {project.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.skills.map((skill, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 text-sm font-medium text-gray-900 dark:text-white">
                    Budget: ${project.budget}
                  </div>
                </div>
                
                {/* Post Stats */}
                <div className="px-4 sm:px-6 py-2 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center space-x-1">
                    <span className="text-blue-500">❤️</span>
                    <span>{project.likes} likes</span>
                  </div>
                  <div>
                    <span>{project.comments} comments</span>
                  </div>
                </div>
                
                {/* Post Actions */}
                <div className="px-4 sm:px-6 py-2 flex items-center justify-between border-t border-gray-100 dark:border-gray-700">
                  <button 
                    onClick={() => handleLike(project._id)} 
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-md ${
                      project.liked 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Heart size={18} fill={project.liked ? "currentColor" : "none"} />
                    <span>Like</span>
                  </button>
                  
                  <Link 
                    to={`/projects/${project._id}#comments`}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <MessageCircle size={18} />
                    <span>Comment</span>
                  </Link>
                  
                  <button 
                    onClick={() => handleShare(project._id)}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <Share2 size={18} />
                    <span>Share</span>
                  </button>
                  
                  <button 
                    onClick={() => handleSave(project._id)}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-md ${
                      project.saved 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Bookmark size={18} fill={project.saved ? "currentColor" : "none"} />
                    <span>Save</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Load More */}
          <div className="mt-8 text-center">
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              Load More Projects
            </button>
          </div>
        </div>
        
        {/* Right Sidebar - Categories & Suggested Connections */}
        <div className="hidden lg:block space-y-6">
          {/* Categories */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Popular Categories</h3>
              <div className="space-y-3">
                {categories.map((cat) => (
                  <Link 
                    key={cat._id} 
                    to={`/categories/${cat._id}`}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    <div className="flex items-center">
                      <span className="text-xl mr-3">{cat.icon}</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{cat.name}</span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{cat.count}</span>
                  </Link>
                ))}
              </div>
              <Link to="/categories" className="mt-4 block text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                View all categories
              </Link>
            </div>
          </div>
          
          {/* Suggested Connections */}
          {isLoggedIn && suggestedConnections.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">People You May Know</h3>
                <div className="space-y-4">
                  {suggestedConnections.map(person => (
                    <div key={person._id} className="flex items-start">
                      <img 
                        src={person.avatar} 
                        alt={person.name} 
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{person.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{person.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{person.mutualConnections} mutual connections</p>
                      </div>
                      <button 
                        onClick={() => handleConnect(person._id)}
                        className="ml-2 inline-flex items-center px-2.5 py-1.5 border border-gray-300 dark:border-gray-600 text-xs font-medium rounded text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        <UserPlus size={14} className="mr-1" />
                        Connect
                      </button>
                    </div>
                  ))}
                </div>
                <Link to="/network" className="mt-4 block text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                  See more suggestions
                </Link>
              </div>
            </div>
          )}
          
          {/* Trending Topics */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Trending in Freelancing</h3>
              <div className="space-y-3">
                <Link to="/trends/remote-work" className="block p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">#RemoteWork</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">1,234 posts</p>
                </Link>
                <Link to="/trends/ai-tools" className="block p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">#AITools</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">982 posts</p>
                </Link>
                <Link to="/trends/freelance-tips" className="block p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">#FreelanceTips</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">756 posts</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

