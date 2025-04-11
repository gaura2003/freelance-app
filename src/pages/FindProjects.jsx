import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";

const FindProjects = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: "",
    skills: [],
    budget: { min: "", max: "" },
    sort: "recent"
  });
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState([]);
  const [popularSkills, setPopularSkills] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [commentText, setCommentText] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const observer = useRef();
  const lastProjectRef = useRef();

  const apiBase = import.meta.env.MODE === "development"
    ? "http://localhost:5000/api"
    : "https://your-production-url.com/api";

  // Fetch projects with infinite scrolling
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        
        // Build query parameters
        const queryParams = new URLSearchParams();
        queryParams.append('page', page);
        queryParams.append('limit', 10);
        queryParams.append('sort', filters.sort);
        
        if (filters.category) {
          queryParams.append('category', filters.category);
        }
        
        if (filters.skills.length > 0) {
          filters.skills.forEach(skill => {
            queryParams.append('skills', skill);
          });
        }
        
        if (filters.budget.min) {
          queryParams.append('minBudget', filters.budget.min);
        }
        
        if (filters.budget.max) {
          queryParams.append('maxBudget', filters.budget.max);
        }

        // Fetch projects
        const response = await fetch(`${apiBase}/projects?${queryParams.toString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        
        const data = await response.json();
        
        // Update state based on page number
        if (page === 1) {
          setProjects(data.projects);
        } else {
          setProjects(prev => [...prev, ...data.projects]);
        }
        
        setHasMore(data.hasMore);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Failed to load projects. Please try again later.');
        
        // Use dummy data for development/demo
        if (page === 1) {
          setProjects(generateDummyProjects());
        } else if (page <= 3) { // Limit dummy data to 3 pages
          setProjects(prev => [...prev, ...generateDummyProjects()]);
        } else {
          setHasMore(false);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [page, filters]);

  // Fetch categories and popular skills
  useEffect(() => {
    const fetchCategoriesAndSkills = async () => {
      try {
        const [categoriesResponse, skillsResponse] = await Promise.all([
          fetch(`${apiBase}/categories`),
          fetch(`${apiBase}/skills/popular`)
        ]);
        
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          setCategories(categoriesData);
        }
        
        if (skillsResponse.ok) {
          const skillsData = await skillsResponse.json();
          setPopularSkills(skillsData);
        }
      } catch (err) {
        console.error('Failed to fetch categories or skills', err);
        // Use dummy data
        setCategories([
          { _id: "c1", name: "Web Development" },
          { _id: "c2", name: "Mobile Development" },
          { _id: "c3", name: "UI/UX Design" },
          { _id: "c4", name: "Data Science" },
          { _id: "c5", name: "Digital Marketing" },
          { _id: "c6", name: "Content Writing" }
        ]);
        
        setPopularSkills([
          "React", "Node.js", "JavaScript", "Python", "UI/UX", 
          "Figma", "WordPress", "SEO", "Content Writing", "Data Analysis"
        ]);
      }
    };

    fetchCategoriesAndSkills();
  }, []);

  // Setup intersection observer for infinite scrolling
  useEffect(() => {
    if (loading) return;
    
    if (observer.current) {
      observer.current.disconnect();
    }
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (lastProjectRef.current) {
      observer.current.observe(lastProjectRef.current);
    }
    
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [loading, hasMore]);

  // Handle like action
  const handleLike = async (projectId) => {
    try {
      // Optimistic update
      setProjects(projects.map(project => {
        if (project._id === projectId) {
          const isLiked = project.likes.includes(user?._id);
          return {
            ...project,
            likes: isLiked 
              ? project.likes.filter(id => id !== user?._id)
              : [...project.likes, user?._id]
          };
        }
        return project;
      }));
      
      // API call
      const response = await fetch(`${apiBase}/projects/${projectId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('freelancehub_token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to like project');
      }
    } catch (err) {
      console.error('Error liking project:', err);
      // Revert optimistic update if failed
    }
  };

  // Handle save/bookmark action
  const handleSave = async (projectId) => {
    try {
      // Optimistic update
      setProjects(projects.map(project => {
        if (project._id === projectId) {
          const isSaved = project.savedBy.includes(user?._id);
          return {
            ...project,
            savedBy: isSaved 
              ? project.savedBy.filter(id => id !== user?._id)
              : [...project.savedBy, user?._id]
          };
        }
        return project;
      }));
      
      // API call
      const response = await fetch(`${apiBase}/projects/${projectId}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('freelancehub_token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to save project');
      }
    } catch (err) {
      console.error('Error saving project:', err);
      // Revert optimistic update if failed
    }
  };

  // Handle share action
  const handleShare = async (projectId) => {
    try {
      // Increment share count optimistically
      setProjects(projects.map(project => {
        if (project._id === projectId) {
          return {
            ...project,
            shares: project.shares + 1
          };
        }
        return project;
      }));
      
      // Copy link to clipboard
      const projectUrl = `${window.location.origin}/projects/${projectId}`;
      await navigator.clipboard.writeText(projectUrl);
      
      // Show toast notification
      alert('Project link copied to clipboard!');
      
      // API call to record share
      const response = await fetch(`${apiBase}/projects/${projectId}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('freelancehub_token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to record share');
      }
    } catch (err) {
      console.error('Error sharing project:', err);
    }
  };

  // Handle comment submission
  const handleCommentSubmit = async (projectId) => {
    if (!commentText[projectId]?.trim()) return;
    
    try {
      // Optimistic update
      const newComment = {
        _id: `temp-${Date.now()}`,
        projectId,
        userId: user?._id,
        content: commentText[projectId],
        likes: [],
        createdAt: new Date().toISOString(),
        user: {
          _id: user?._id,
          username: user?.username,
          profile: {
            fullName: user?.profile?.fullName,
            profileImageUrl: user?.profile?.profileImageUrl
          }
        }
      };
      
      setProjects(projects.map(project => {
        if (project._id === projectId) {
          return {
            ...project,
            comments: [...(project.comments || []), newComment]
          };
        }
        return project;
      }));
      
      // Clear comment input
      setCommentText({...commentText, [projectId]: ''});
      
      // API call
      const response = await fetch(`${apiBase}/projects/${projectId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('freelancehub_token')}`
        },
        body: JSON.stringify({ content: commentText[projectId] })
      });
      
      if (!response.ok) {
        throw new Error('Failed to post comment');
      }
      
      // Update with real comment from server
      const data = await response.json();
      
      setProjects(projects.map(project => {
        if (project._id === projectId) {
          return {
            ...project,
            comments: project.comments.map(comment => 
              comment._id === newComment._id ? data : comment
            )
          };
        }
        return project;
      }));
    } catch (err) {
      console.error('Error posting comment:', err);
      // Revert optimistic update if failed
    }
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      if (filterType === 'skills') {
        // Toggle skill selection
        const updatedSkills = prev.skills.includes(value)
          ? prev.skills.filter(skill => skill !== value)
          : [...prev.skills, value];
        
        return { ...prev, skills: updatedSkills };
      }
      
      return { ...prev, [filterType]: value };
    });
    
    // Reset to first page when filters change
    setPage(1);
  };

  // Toggle expanded comments for a project
  const toggleComments = (projectId) => {
    setExpandedComments(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  // Toggle expanded description for a project
  const toggleDescription = (projectId) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  // Generate dummy projects for development/demo
  const generateDummyProjects = () => {
    const dummyProjects = [];
    const statuses = ['open', 'in_progress', 'completed'];
    const dummyCategories = ['Web Development', 'Mobile Development', 'UI/UX Design', 'Data Science', 'Digital Marketing'];
    const dummySkills = ['React', 'Node.js', 'JavaScript', 'Python', 'UI/UX', 'Figma', 'WordPress', 'SEO'];
    const dummyClients = [
      { _id: 'c1', username: 'techcorp', profile: { fullName: 'Tech Corporation', profileImageUrl: 'https://i.pravatar.cc/150?img=1' } },
      { _id: 'c2', username: 'designstudio', profile: { fullName: 'Design Studio', profileImageUrl: 'https://i.pravatar.cc/150?img=2' } },
      { _id: 'c3', username: 'marketingpro', profile: { fullName: 'Marketing Pro', profileImageUrl: 'https://i.pravatar.cc/150?img=3' } },
    ];
    
    for (let i = 0; i < 5; i++) {
      const id = `p${Date.now() + i}`;
      const randomClient = dummyClients[Math.floor(Math.random() * dummyClients.length)];
      const randomCategory = dummyCategories[Math.floor(Math.random() * dummyCategories.length)];
      const randomSkillsCount = Math.floor(Math.random() * 4) + 2; // 2-5 skills
      const randomSkills = [];
      
      for (let j = 0; j < randomSkillsCount; j++) {
        const skill = dummySkills[Math.floor(Math.random() * dummySkills.length)];
        if (!randomSkills.includes(skill)) {
          randomSkills.push(skill);
        }
      }
      
      const likesCount = Math.floor(Math.random() * 50);
      const likes = [];
      for (let j = 0; j < likesCount; j++) {
        likes.push(`user${j}`);
      }
      
      const commentsCount = Math.floor(Math.random() * 5);
      const comments = [];
      for (let j = 0; j < commentsCount; j++) {
        comments.push({
          _id: `comment${j}-${id}`,
          content: `This is a sample comment ${j+1} for this project. Looks interesting!`,
          userId: `user${j}`,
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000)).toISOString(),
          likes: [],
          user: {
            _id: `user${j}`,
            username: `user${j}`,
            profile: {
              fullName: `User ${j}`,
              profileImageUrl: `https://i.pravatar.cc/150?img=${10+j}`
            }
          }
        });
      }
      
      dummyProjects.push({
        _id: id,
        title: `${randomCategory} Project ${i+1}`,
        description: `This is a ${randomCategory.toLowerCase()} project that requires expertise in ${randomSkills.join(', ')}. We are looking for a skilled freelancer who can deliver high-quality work within the deadline. The project involves designing and implementing a solution that meets our specific requirements and business objectives.`,
        budget: Math.floor(Math.random() * 9000) + 1000, // $1000-$10000
        deadline: new Date(Date.now() + (Math.floor(Math.random() * 30) + 15) * 86400000).toISOString(), // 15-45 days from now
        category: randomCategory,
        skills: randomSkills,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        clientId: randomClient._id,
        client: randomClient,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000000)).toISOString(),
        likes: likes,
        shares: Math.floor(Math.random() * 20),
        views: Math.floor(Math.random() * 200) + 50,
        savedBy: [],
        comments: comments,
        attachments: Math.random() > 0.7 ? [{ name: 'project_brief.pdf', url: '#', type: 'pdf' }] : []
      });
    }
    
    return dummyProjects;
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get time ago
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

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Find Projects</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Discover projects that match your skills and interests
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-md border border-gray-300 dark:border-gray-600 transition duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
              </svg>
              Filters
            </button>
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="recent">Most Recent</option>
              <option value="budget_high">Highest Budget</option>
              <option value="budget_low">Lowest Budget</option>
              <option value="deadline">Closest Deadline</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Categories */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Categories</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      id="all-categories"
                      type="radio"
                      name="category"
                      checked={filters.category === ""}
                      onChange={() => handleFilterChange('category', '')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="all-categories" className="ml-2 text-gray-700 dark:text-gray-300">
                      All Categories
                    </label>
                  </div>
                  {categories.map(category => (
                    <div key={category._id} className="flex items-center">
                      <input
                        id={`category-${category._id}`}
                        type="radio"
                        name="category"
                        checked={filters.category === category.name}
                        onChange={() => handleFilterChange('category', category.name)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`category-${category._id}`} className="ml-2 text-gray-700 dark:text-gray-300">
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {popularSkills.map((skill, index) => (
                    <button
                      key={index}
                      onClick={() => handleFilterChange('skills', skill)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        filters.skills.includes(skill)
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:bg-opacity-30 dark:text-blue-300'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget Range */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Budget Range</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="min-budget" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                      Min ($)
                    </label>
                    <input
                      type="number"
                      id="min-budget"
                      value={filters.budget.min}
                      onChange={(e) => handleFilterChange('budget', { ...filters.budget, min: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="Min"
                      min="0"
                    />
                  </div>
                  <div>
                    <label htmlFor="max-budget" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                      Max ($)
                    </label>
                    <input
                      type="number"
                      id="max-budget"
                      value={filters.budget.max}
                      onChange={(e) => handleFilterChange('budget', { ...filters.budget, max: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="Max"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => {
                  setFilters({
                    category: "",
                    skills: [],
                    budget: { min: "", max: "" },
                    sort: "recent"
                  });
                  setPage(1);
                }}
                className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 mr-4"
              >
                Reset Filters
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-200"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded" role="alert">
                        <p>{error}</p>
          </div>
        )}

        {/* Projects Feed */}
        <div className="space-y-6">
          {projects.map((project, index) => {
            // Check if this is the last item for intersection observer
            const isLastItem = index === projects.length - 1;
            
            return (
              <div 
                key={project._id} 
                ref={isLastItem ? lastProjectRef : null}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
              >
                {/* Project Header */}
                <div className="p-6">
                  <div className="flex items-start">
                    <img 
                      src={project.client?.profile?.profileImageUrl || "https://i.pravatar.cc/150?img=1"} 
                      alt={project.client?.profile?.fullName} 
                      className="w-12 h-12 rounded-full mr-4 object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {project.client?.profile?.fullName || "Anonymous Client"}
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">
                            {getTimeAgo(project.createdAt)}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:bg-opacity-30 dark:text-blue-300 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
                            {project.category}
                          </span>
                          <div className="relative">
                            <button className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                              </svg>
                            </button>
                            {/* Dropdown menu would go here */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Project Title and Description */}
                  <div className="mt-4">
                    <Link to={`/projects/${project._id}`} className="text-xl font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                      {project.title}
                    </Link>
                    <div className="mt-2 text-gray-600 dark:text-gray-300">
                      {expandedDescriptions[project._id] ? (
                        <p>{project.description}</p>
                      ) : (
                        <p className="line-clamp-3">{project.description}</p>
                      )}
                      {project.description.length > 180 && (
                        <button 
                          onClick={() => toggleDescription(project._id)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium mt-1"
                        >
                          {expandedDescriptions[project._id] ? 'Show less' : 'Read more'}
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Project Details */}
                  <div className="mt-4 flex flex-wrap gap-y-2">
                    <div className="flex items-center mr-6 text-gray-700 dark:text-gray-300">
                      <svg className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span className="font-medium">{formatCurrency(project.budget)}</span>
                    </div>
                    <div className="flex items-center mr-6 text-gray-700 dark:text-gray-300">
                      <svg className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <span>Due: {formatDate(project.deadline)}</span>
                    </div>
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <svg className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                      <span>{project.views} views</span>
                    </div>
                  </div>
                  
                  {/* Skills */}
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {project.skills.map((skill, idx) => (
                        <span 
                          key={idx} 
                          className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 text-xs font-medium px-2.5 py-0.5 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Attachments */}
                  {project.attachments && project.attachments.length > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                        </svg>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Attachments:</span>
                        {project.attachments.map((attachment, idx) => (
                          <a 
                            key={idx}
                            href={attachment.url}
                            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {attachment.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Project Actions */}
                <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
                  <div className="flex justify-between">
                    <div className="flex space-x-4">
                      <button 
                        onClick={() => handleLike(project._id)}
                        className={`flex items-center space-x-1 ${
                          project.likes.includes(user?._id) 
                            ? 'text-blue-600 dark:text-blue-400' 
                            : 'text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                        }`}
                      >
                        <svg className="w-5 h-5" fill={project.likes.includes(user?._id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                        </svg>
                        <span>{project.likes.length}</span>
                      </button>
                      
                      <button 
                        onClick={() => toggleComments(project._id)}
                        className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                        </svg>
                        <span>{project.comments?.length || 0}</span>
                      </button>
                      
                      <button 
                        onClick={() => handleShare(project._id)}
                        className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                        </svg>
                        <span>{project.shares}</span>
                      </button>
                    </div>
                    
                    <div className="flex space-x-4">
                      <button 
                        onClick={() => handleSave(project._id)}
                        className={`flex items-center space-x-1 ${
                          project.savedBy?.includes(user?._id) 
                            ? 'text-yellow-500 dark:text-yellow-400' 
                            : 'text-gray-500 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400'
                        }`}
                      >
                        <svg className="w-5 h-5" fill={project.savedBy?.includes(user?._id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                        </svg>
                        <span>Save</span>
                      </button>
                      
                      <Link 
                        to={`/projects/${project._id}/apply`}
                        className="flex items-center space-x-1 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path>
                          </svg>
                          <span>Apply</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                  
                  {/* Comments Section */}
                  {expandedComments[project._id] && (
                    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Comments</h4>
                      
                      {/* Comment Input */}
                      <div className="flex space-x-3 mb-6">
                        <img 
                          src={user?.profile?.profileImageUrl || "https://i.pravatar.cc/150?img=12"} 
                          alt="Your profile" 
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <textarea
                            value={commentText[project._id] || ''}
                            onChange={(e) => setCommentText({...commentText, [project._id]: e.target.value})}
                            placeholder="Write a comment..."
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
                            rows="2"
                          ></textarea>
                          <div className="mt-2 flex justify-end">
                            <button
                              onClick={() => handleCommentSubmit(project._id)}
                              disabled={!commentText[project._id]?.trim()}
                              className={`px-4 py-1 rounded-md ${
                                commentText[project._id]?.trim()
                                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                  : 'bg-gray-300 text-gray-500 dark:bg-gray-600 dark:text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              Comment
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Comments List */}
                      {project.comments && project.comments.length > 0 ? (
                        <div className="space-y-4">
                          {project.comments.map((comment) => (
                            <div key={comment._id} className="flex space-x-3">
                              <img 
                                src={comment.user?.profile?.profileImageUrl || "https://i.pravatar.cc/150?img=12"} 
                                alt={comment.user?.profile?.fullName} 
                                className="w-10 h-10 rounded-full"
                              />
                              <div className="flex-1">
                                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                                  <div className="flex items-center justify-between mb-1">
                                    <h5 className="font-medium text-gray-900 dark:text-white">
                                      {comment.user?.profile?.fullName || comment.user?.username || "Anonymous User"}
                                    </h5>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      {getTimeAgo(comment.createdAt)}
                                    </span>
                                  </div>
                                  <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
                                </div>
                                <div className="mt-1 ml-1 flex items-center space-x-3">
                                  <button className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                                    Like
                                  </button>
                                  <button className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                                    Reply
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-gray-500 dark:text-gray-400">No comments yet. Be the first to comment!</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            
            {/* Loading Indicator */}
            {loading && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              </div>
            )}
            
            {/* End of Results */}
            {!loading && !hasMore && projects.length > 0 && (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400">You've reached the end of the results.</p>
              </div>
            )}
            
            {/* No Projects Found */}
            {!loading && projects.length === 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
                <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No projects found</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Try adjusting your filters or check back later for new projects.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  export default FindProjects;
