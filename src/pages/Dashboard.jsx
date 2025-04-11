import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";

const Dashboard = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    earnings: 0,
    activeProjects: 0,
    proposals: 0,
    completionRate: 0
  });
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const apiBase = import.meta.env.MODE === "development"
    ? "http://localhost:5000/api"
    : "https://your-production-url.com/api";

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Get auth token from storage
        const token = localStorage.getItem("freelancehub_token") || sessionStorage.getItem("freelancehub_token");
        
        if (!token) {
          throw new Error("No authentication token found");
        }

        const headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        };

        // Fetch all required data in parallel
        const [userResponse, projectsResponse, statsResponse, notificationsResponse] = await Promise.all([
          fetch(`${apiBase}/user/me`, { headers }),
          fetch(`${apiBase}/projects/my-projects`, { headers }),
          fetch(`${apiBase}/dashboard/stats`, { headers }),
          fetch(`${apiBase}/notifications`, { headers })
        ]);

        if (userResponse.ok && projectsResponse.ok) {
          const user = await userResponse.json();
          const projects = await projectsResponse.json();
          setUserData(user);
          setProjects(projects);
          
          if (statsResponse.ok) {
            const stats = await statsResponse.json();
            setStats(stats);
          }
          
          if (notificationsResponse.ok) {
            const notifications = await notificationsResponse.json();
            setNotifications(notifications);
          }
        } else {
          throw new Error("API not available, using dummy data");
        }
      } catch (error) {
        console.error(error);

        // DUMMY fallback data
        setUserData({
          username: "john_doe",
          profile: {
            fullName: "John Doe",
            title: "Fullstack Developer",
            bio: "Experienced developer with a passion for creating elegant solutions",
            skills: ["React", "Node.js", "MongoDB", "TypeScript", "GraphQL"],
            location: "New York, USA",
            profileImageUrl: "https://i.pravatar.cc/150?img=12",
          },
          role: "freelancer"
        });
        
        setProjects([
          { 
            id: 1, 
            title: "E-commerce Website Redesign", 
            status: "in_progress",
            client: "ABC Company",
            deadline: "2023-12-15",
            budget: 2500,
            description: "Redesigning the user interface and improving the checkout process."
          },
          { 
            id: 2, 
            title: "Mobile App Development", 
            status: "completed",
            client: "XYZ Startup",
            deadline: "2023-10-30",
            budget: 5000,
            description: "Developed a cross-platform mobile app using React Native."
          },
          { 
            id: 3, 
            title: "API Integration", 
            status: "pending",
            client: "Tech Solutions Inc",
            deadline: "2023-12-30",
            budget: 1800,
            description: "Integrate payment gateway and third-party APIs."
          }
        ]);
        
        setStats({
          earnings: 7500,
          activeProjects: 2,
          proposals: 5,
          completionRate: 92
        });
        
        setNotifications([
          {
            id: 1,
            message: "Your proposal for 'Website Optimization' was accepted",
            read: false,
            createdAt: "2023-11-10T14:30:00Z"
          },
          {
            id: 2,
            message: "New message from client regarding E-commerce project",
            read: true,
            createdAt: "2023-11-09T09:15:00Z"
          },
          {
            id: 3,
            message: "Payment of $1,500 has been processed",
            read: true,
            createdAt: "2023-11-08T16:45:00Z"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusClass = (status) => {
    switch(status) {
      case "completed":
        return "text-green-500 bg-green-100 dark:bg-green-900 dark:bg-opacity-30";
      case "in_progress":
        return "text-blue-500 bg-blue-100 dark:bg-blue-900 dark:bg-opacity-30";
      case "pending":
        return "text-yellow-500 bg-yellow-100 dark:bg-yellow-900 dark:bg-opacity-30";
      case "cancelled":
        return "text-red-500 bg-red-100 dark:bg-red-900 dark:bg-opacity-30";
      default:
        return "text-gray-500 bg-gray-100 dark:bg-gray-800";
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now - date) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
      return interval === 1 ? "1 year ago" : `${interval} years ago`;
    }
    
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      return interval === 1 ? "1 month ago" : `${interval} months ago`;
    }
    
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      return interval === 1 ? "1 day ago" : `${interval} days ago`;
    }
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      return interval === 1 ? "1 hour ago" : `${interval} hours ago`;
    }
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      return interval === 1 ? "1 minute ago" : `${interval} minutes ago`;
    }
    
    return "Just now";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-12 w-12 text-blue-600 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <div className="text-blue-600 text-lg">Loading Dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome, {userData?.profile?.fullName}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {userData?.role === 'freelancer' ? 'Freelancer Dashboard' : 'Client Dashboard'}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link 
              to={userData?.role === 'freelancer' ? "/find-projects" : "/post-project"} 
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-200"
            >
              {userData?.role === 'freelancer' ? 'Find Projects' : 'Post a Project'}
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 dark:bg-opacity-30 text-blue-600 dark:text-blue-400 mr-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(stats.earnings)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 dark:bg-opacity-30 text-green-600 dark:text-green-400 mr-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                </svg>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Active Projects</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeProjects}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 dark:bg-opacity-30 text-purple-600 dark:text-purple-400 mr-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path>
                </svg>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Proposals Sent</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.proposals}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900 dark:bg-opacity-30 text-yellow-600 dark:text-yellow-400 mr-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completionRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <ul className="flex flex-wrap -mb-px">
            <li className="mr-2">
              <button
                onClick={() => setActiveTab("overview")}
                className={`inline-block py-4 px-4 text-sm font-medium ${
                  activeTab === "overview"
                    ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                Overview
              </button>
            </li>
            <li className="mr-2">
              <button
                onClick={() => setActiveTab("projects")}
                className={`inline-block py-4 px-4 text-sm font-medium ${
                  activeTab === "projects"
                    ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                Projects
              </button>
            </li>
            <li className="mr-2">
              <button
                onClick={() => setActiveTab("notifications")}
                className={`inline-block py-4 px-4 text-sm font-medium ${
                  activeTab === "notifications"
                    ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                Notifications
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>
            </li>
          </ul>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className={`${activeTab !== "overview" ? "lg:col-span-3" : ""}`}>
            {activeTab === "overview" && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
                <div className="flex items-center mb-4">
                  <img
                    src={userData?.profile?.profileImageUrl || "https://i.pravatar.cc/150?img=12"}
                    alt="Profile"
                    className="w-16 h-16 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{userData?.profile?.fullName}</h2>
                    <p className="text-gray-600 dark:text-gray-300">{userData?.profile?.title || userData?.profile?.bio}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                      <span className="inline-flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        {userData?.profile?.location}
                      </span>
                    </p>
                  </div>
                  <Link to="/profile/edit" className="ml-auto bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-1 px-3 rounded-md text-sm transition duration-200">
                    Edit Profile
                  </Link>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {userData?.profile?.skills.map((skill, idx) => (
                      <span 
                        key={idx} 
                        className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:bg-opacity-30 dark:text-blue-300 text-xs font-medium px-2.5 py-0.5 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">About</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {userData?.profile?.bio || "No bio provided yet."}
                  </p>
                </div>
              </div>
            )}

            {activeTab === "projects" && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">My Projects</h3>
                </div>
                
                {projects.length === 0 ? (
                  <div className="p-6 text-center">
                    <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                    </svg>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">No projects found.</p>
                    <Link 
                      to={userData?.role === 'freelancer' ? "/find-projects" : "/post-project"} 
                      className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-200"
                    >
                      {userData?.role === 'freelancer' ? 'Find Projects' : 'Post a Project'}
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {projects.map((project) => (
                      <div key={project.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-750 transition duration-150">
                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                          <div className="mb-3 md:mb-0">
                            <Link to={`/projects/${project.id}`} className="text-lg font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                              {project.title}
                            </Link>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 line-clamp-2">
                              {project.description}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusClass(project.status)}`}>
                              {project.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex flex-wrap gap-y-2 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center mr-4">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                            {project.client}
                          </div>
                          <div className="flex items-center mr-4">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            Due: {formatDate(project.deadline)}
                          </div>
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            {formatCurrency(project.budget)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {projects.length > 0 && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700 text-center">
                    <Link to="/projects" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
                      View All Projects
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
                  {notifications.filter(n => !n.read).length > 0 && (
                    <button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                      Mark all as read
                    </button>
                  )}
                </div>
                
                {notifications.length === 0 ? (
                  <div className="p-6 text-center">
                    <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                    </svg>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">No notifications yet.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {notifications.map((notification) => (
                      <div key={notification.id} className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition duration-150 ${!notification.read ? 'bg-blue-50 dark:bg-blue-900 dark:bg-opacity-10' : ''}`}>
                        <div className="flex">
                        <div className={`flex-shrink-0 mr-3 ${!notification.read ? 'text-blue-500' : 'text-gray-400'}`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm ${!notification.read ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                              {getTimeAgo(notification.createdAt)}
                            </p>
                          </div>
                          {!notification.read && (
                            <button className="ml-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                              <span className="sr-only">Mark as read</span>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {notifications.length > 0 && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700 text-center">
                    <Link to="/notifications" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
                      View All Notifications
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Only visible in overview tab */}
          {activeTab === "overview" && (
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden mb-6">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Projects</h3>
                </div>
                
                {projects.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-gray-600 dark:text-gray-400">No projects found.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {projects.slice(0, 3).map((project) => (
                      <div key={project.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition duration-150">
                        <div className="flex justify-between items-start">
                          <div>
                            <Link to={`/projects/${project.id}`} className="text-md font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                              {project.title}
                            </Link>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                              Client: {project.client}
                            </p>
                          </div>
                          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusClass(project.status)}`}>
                            {project.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </div>
                        
                        <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          Due: {formatDate(project.deadline)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {projects.length > 0 && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700 text-center">
                    <button 
                      onClick={() => setActiveTab("projects")}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                    >
                      View All Projects
                    </button>
                  </div>
                )}
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Notifications</h3>
                </div>
                
                {notifications.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-gray-600 dark:text-gray-400">No notifications yet.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {notifications.slice(0, 3).map((notification) => (
                      <div key={notification.id} className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition duration-150 ${!notification.read ? 'bg-blue-50 dark:bg-blue-900 dark:bg-opacity-10' : ''}`}>
                        <div className="flex">
                          <div className={`flex-shrink-0 mr-3 ${!notification.read ? 'text-blue-500' : 'text-gray-400'}`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                            </svg>
                          </div>
                          <div>
                            <p className={`text-sm ${!notification.read ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                              {getTimeAgo(notification.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {notifications.length > 0 && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700 text-center">
                    <button 
                      onClick={() => setActiveTab("notifications")}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                    >
                      View All Notifications
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MembershipSection = () => {
  const { membershipStatus } = useMembership();
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Membership Status</h2>
        <Link to="/memberships" className="text-blue-600 hover:underline text-sm">
          View Plans
        </Link>
      </div>
      
      <div className="flex items-center mb-4">
        <div className={`w-3 h-3 rounded-full mr-2 ${membershipStatus.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span className="font-medium">{membershipStatus.type} Plan</span>
        <span className="ml-2 text-sm text-gray-500">
          ({membershipStatus.isActive ? `${membershipStatus.daysRemaining} days remaining` : 'Expired'})
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm text-gray-500">Bids Remaining</p>
          <p className="text-lg font-semibold">{membershipStatus.bidsRemaining}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm text-gray-500">Profile Status</p>
          <p className="text-lg font-semibold">
            {membershipStatus.type === 'Basic' ? 'Standard' : 'Featured'}
          </p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm text-gray-500">Commission Rate</p>
          <p className="text-lg font-semibold">
            {membershipStatus.type === 'Basic' ? '10%' : 
             membershipStatus.type === 'Premium' ? '7%' : '5%'}
          </p>
        </div>
      </div>
      
      {!membershipStatus.isActive && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md mb-4">
          Your membership has expired. Renew now to continue enjoying the benefits.
        </div>
      )}
      
      <Link 
        to="/memberships"
        className="block w-full py-2 px-4 bg-blue-600 text-white rounded-md font-medium text-center hover:bg-blue-700 transition"
      >
        {membershipStatus.type === 'Basic' ? 'Upgrade Membership' : 
         membershipStatus.isActive ? 'Manage Membership' : 'Renew Membership'}
      </Link>
    </div>
  );
};

export default Dashboard;

