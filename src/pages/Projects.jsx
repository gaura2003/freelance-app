import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Clock, DollarSign, MapPin, Briefcase, Star } from "lucide-react";
import { categories } from "../data/categories";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    budget: "",
    experience: ""
  });
  const [showFilters, setShowFilters] = useState(false);
  
  const apiBase = import.meta.env.MODE === "development"
    ? "http://localhost:5000/api"
    : "https://your-production-url.com/api";

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${apiBase}/projects`);

        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        } else {
          throw new Error("Failed to fetch projects");
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError("Failed to load projects. Please try again later.");
        
        // DUMMY fallback data
        setProjects([
          {
            _id: "p1",
            title: "E-commerce Website Redesign",
            description: "Looking for an experienced web designer to redesign our e-commerce website. The goal is to improve user experience and increase conversion rates.",
            category: "c1", // Web Development
            budget: 2500,
            deadline: "2023-12-15T00:00:00Z",
            skills: ["React", "UI/UX", "Responsive Design"],
            experience: "Intermediate",
            location: "Remote",
            postedBy: {
              _id: "u2",
              username: "jane_smith",
              fullName: "Jane Smith",
              profileImageUrl: "https://i.pravatar.cc/150?img=2",
              rating: 4.8
            },
            createdAt: "2023-10-05T14:30:00Z"
          },
          {
            _id: "p2",
            title: "Mobile App Development for Fitness Tracking",
            description: "We need a mobile app developer to create a fitness tracking app for iOS and Android. The app should track workouts, nutrition, and provide personalized recommendations.",
            category: "c1", // Web Development
            budget: 5000,
            deadline: "2024-01-20T00:00:00Z",
            skills: ["React Native", "iOS", "Android", "API Integration"],
            experience: "Expert",
            location: "Remote",
            postedBy: {
              _id: "u3",
              username: "mike_wilson",
              fullName: "Mike Wilson",
              profileImageUrl: "https://i.pravatar.cc/150?img=3",
              rating: 4.9
            },
            createdAt: "2023-10-08T09:15:00Z"
          },
          {
            _id: "p3",
            title: "Logo and Brand Identity Design",
            description: "Startup looking for a creative designer to develop our logo and brand identity. We're a tech company focused on sustainability.",
            category: "c2", // Design
            budget: 1200,
            deadline: "2023-11-30T00:00:00Z",
            skills: ["Logo Design", "Brand Identity", "Adobe Illustrator"],
            experience: "Beginner",
            location: "Remote",
            postedBy: {
              _id: "u4",
              username: "sarah_johnson",
              fullName: "Sarah Johnson",
              profileImageUrl: "https://i.pravatar.cc/150?img=4",
              rating: 4.7
            },
            createdAt: "2023-10-10T16:45:00Z"
          },
          {
            _id: "p4",
            title: "Content Writing for Tech Blog",
            description: "Need an experienced writer to create engaging content for our tech blog. Topics include AI, blockchain, and software development trends.",
            category: "c4", // Writing
            budget: 800,
            deadline: "2023-11-15T00:00:00Z",
            skills: ["Content Writing", "SEO", "Tech Knowledge"],
            experience: "Intermediate",
            location: "Remote",
            postedBy: {
              _id: "u5",
              username: "alex_brown",
              fullName: "Alex Brown",
              profileImageUrl: "https://i.pravatar.cc/150?img=5",
              rating: 4.6
            },
            createdAt: "2023-10-12T11:20:00Z"
          },
          {
            _id: "p5",
            title: "Social Media Marketing Campaign",
            description: "Looking for a social media expert to create and manage a marketing campaign for our new product launch. Platforms include Instagram, Facebook, and Twitter.",
            category: "c3", // Marketing
            budget: 1800,
            deadline: "2023-12-01T00:00:00Z",
            skills: ["Social Media Marketing", "Content Creation", "Analytics"],
            experience: "Expert",
            location: "Remote",
            postedBy: {
              _id: "u6",
              username: "emily_davis",
              fullName: "Emily Davis",
              profileImageUrl: "https://i.pravatar.cc/150?img=6",
              rating: 4.9
            },
            createdAt: "2023-10-14T13:10:00Z"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Calculate time ago
  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} ago`;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      category: "",
      budget: "",
      experience: ""
    });
    setSearchTerm("");
  };

    // Filter projects
    const filteredProjects = projects.filter(project => {
        // Search term filter
        if (searchTerm && !project.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
            !project.description.toLowerCase().includes(searchTerm.toLowerCase())) {
          return false;
        }
        
        // Category filter
        if (filters.category && project.category !== filters.category) {
          return false;
        }
        
        // Budget filter
        if (filters.budget) {
          const budget = parseInt(project.budget);
          if (filters.budget === "under1000" && budget >= 1000) return false;
          if (filters.budget === "1000to3000" && (budget < 1000 || budget > 3000)) return false;
          if (filters.budget === "3000to5000" && (budget < 3000 || budget > 5000)) return false;
          if (filters.budget === "over5000" && budget <= 5000) return false;
        }
        
        // Experience filter
        if (filters.experience && project.experience !== filters.experience) {
          return false;
        }
        
        return true;
      });
    
      if (loading) {
        return (
          <div className="flex justify-center items-center min-h-screen">
            <div className="text-blue-600 text-lg animate-pulse">Loading projects...</div>
          </div>
        );
      }
    
      if (error) {
        return (
          <div className="container mx-auto px-4 py-8 mt-16">
            <div className="bg-red-50 dark:bg-red-900 dark:bg-opacity-20 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
              </div>
            </div>
          </div>
        );
      }
    
      return (
        <div className="container mx-auto px-4 py-8 mt-16 mb-20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
              Available Projects
            </h1>
            
            <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </button>
            </div>
          </div>
          
          {/* Filters */}
          {showFilters && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Budget
                  </label>
                  <select
                    name="budget"
                    value={filters.budget}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Any Budget</option>
                    <option value="under1000">Under $1,000</option>
                    <option value="1000to3000">$1,000 - $3,000</option>
                    <option value="3000to5000">$3,000 - $5,000</option>
                    <option value="over5000">Over $5,000</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Experience Level
                  </label>
                  <select
                    name="experience"
                    value={filters.experience}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Any Level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
          
          {/* Projects List */}
          {filteredProjects.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
              <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No projects found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search or filter criteria to find more projects.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredProjects.map((project) => {
                const categoryName = categories.find(c => c._id === project.category)?.name || "Uncategorized";
                
                return (
                  <div key={project._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          {project.title}
                        </h2>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:bg-opacity-30 dark:text-blue-300 text-xs font-medium rounded-full">
                          {categoryName}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {project.description}
                      </p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center">
                          <DollarSign className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" />
                          <span className="text-gray-700 dark:text-gray-300 font-medium">
                            {formatCurrency(project.budget)}
                          </span>
                        </div>
                        
                        <div className="flex items-center">
                          <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" />
                          <span className="text-gray-700 dark:text-gray-300">
                            Due {formatDate(project.deadline)}
                          </span>
                        </div>
                        
                        <div className="flex items-center">
                          <Briefcase className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {project.experience}
                          </span>
                        </div>
                        
                        <div className="flex items-center">
                          <MapPin className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {project.location}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.skills.map((skill, index) => (
                          <span 
                            key={index} 
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                          <img
                            src={project.postedBy.profileImageUrl}
                            alt={project.postedBy.fullName}
                            className="w-8 h-8 rounded-full mr-2"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {project.postedBy.fullName}
                            </p>
                            <div className="flex items-center">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">
                                {project.postedBy.rating.toFixed(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <span className="text-xs text-gray-500 dark:text-gray-400 mr-4">
                            Posted {timeAgo(project.createdAt)}
                          </span>
                          <Link
                            to={`/projects/${project._id}`}
                            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                          >
                            Apply Now
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    };
    
    export default Projects;
    
