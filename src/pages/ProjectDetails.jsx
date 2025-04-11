import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Clock, DollarSign, MapPin, Briefcase, Star, 
  Calendar, User, Send, ChevronLeft, Share2 
} from "lucide-react";
import { categories } from "../data/categories";

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [proposalText, setProposalText] = useState("");
  const [proposalRate, setProposalRate] = useState("");
  const [proposalDuration, setProposalDuration] = useState("");
  
  const apiBase = import.meta.env.MODE === "development"
    ? "http://localhost:5000/api"
    : "https://your-production-url.com/api";

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await fetch(`${apiBase}/projects/${id}`);

        if (response.ok) {
          const data = await response.json();
          setProject(data);
        } else {
          throw new Error("Failed to fetch project details");
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
        setError("Failed to load project details. Please try again later.");
        
        // DUMMY fallback data
        setProject({
          _id: id,
          title: "E-commerce Website Redesign",
          description: "Looking for an experienced web designer to redesign our e-commerce website. The goal is to improve user experience and increase conversion rates. We need a complete overhaul of our current website, including new product pages, checkout process, and mobile responsiveness.",
          category: "c1", // Web Development
          budget: 2500,
          deadline: "2023-12-15T00:00:00Z",
          skills: ["React", "UI/UX", "Responsive Design", "E-commerce", "Figma"],
          experience: "Intermediate",
          location: "Remote",
          postedBy: {
            _id: "u2",
            username: "jane_smith",
            fullName: "Jane Smith",
            profileImageUrl: "https://i.pravatar.cc/150?img=2",
            rating: 4.8,
            memberSince: "2021-03-15T00:00:00Z",
            completedProjects: 24
          },
          createdAt: "2023-10-05T14:30:00Z",
          proposals: 5,
          detailedDescription: `
            <h3>Project Overview</h3>
            <p>Our e-commerce store sells handmade crafts and has been operating for 3 years. The current website is built on WordPress with WooCommerce but has become outdated and difficult to navigate on mobile devices.</p>
            
            <h3>Requirements</h3>
            <ul>
              <li>Redesign the entire user interface with a modern, clean look</li>
              <li>Improve mobile responsiveness across all pages</li>
              <li>Optimize the checkout process to reduce cart abandonment</li>
              <li>Implement better product filtering and search functionality</li>
              <li>Integrate with our existing payment processors (Stripe, PayPal)</li>
              <li>Ensure the design is accessible and meets WCAG guidelines</li>
            </ul>
            
            <h3>Deliverables</h3>
            <ul>
              <li>Complete design mockups in Figma</li>
              <li>Fully functional responsive website</li>
              <li>Documentation for content management</li>
              <li>30 days of support after launch</li>
            </ul>
          `,
          attachments: [
            { name: "current_site_screenshots.pdf", url: "#" },
            { name: "brand_guidelines.pdf", url: "#" }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id]);

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

  // Submit proposal
  const handleSubmitProposal = async (e) => {
    e.preventDefault();
    
    if (!proposalText.trim() || !proposalRate || !proposalDuration) {
      alert("Please fill in all fields");
      return;
    }
    
    const proposalData = {
      projectId: id,
      coverLetter: proposalText,
      rate: parseFloat(proposalRate),
      estimatedDuration: proposalDuration
    };
    
    try {
      const response = await fetch(`${apiBase}/proposals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('freelancehub_token')}`
        },
        body: JSON.stringify(proposalData)
      });

      if (response.ok) {
        alert("Your proposal has been submitted successfully!");
        setProposalText("");
        setProposalRate("");
        setProposalDuration("");
      } else {
        throw new Error("Failed to submit proposal");
      }
    } catch (error) {
      console.error("Error submitting proposal:", error);
      alert("There was an error submitting your proposal. Please try again later.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-blue-600 text-lg animate-pulse">Loading project details...</div>
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

  const categoryName = categories.find(c => c._id === project.category)?.name || "Uncategorized";

  return (
    <div className="container mx-auto px-4 py-8 mt-16 mb-20">
      <div className="mb-6">
        <Link to="/projects" className="flex items-center text-blue-600 dark:text-blue-400 hover:underline">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Projects
        </Link>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 md:mb-0">
              {project.title}
            </h1>
            
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:bg-opacity-30 dark:text-blue-300 text-xs font-medium rounded-full">
                {categoryName}
              </span>
              
              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="prose dark:prose-invert max-w-none mb-6">
                <p className="text-gray-600 dark:text-gray-400">
                  {project.description}
                </p>
                
                <div className="my-6" dangerouslySetInnerHTML={{ __html: project.detailedDescription }} />
                
                {project.attachments && project.attachments.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Attachments</h3>
                    <div className="space-y-2">
                      {project.attachments.map((attachment, index) => (
                        <a
                          key={index}
                          href={attachment.url}
                          className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                          </svg>
                          <span className="text-sm text-gray-700 dark:text-gray-300">{attachment.name}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2 mt-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white w-full mb-2">Skills Required</h3>
                  {project.skills.map((skill, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Submit a Proposal</h3>
                <form onSubmit={handleSubmitProposal} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Cover Letter
                    </label>
                    <textarea
                      value={proposalText}
                      onChange={(e) => setProposalText(e.target.value)}
                      rows={6}
                      placeholder="Introduce yourself and explain why you're a good fit for this project..."
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Your Rate (USD)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 dark:text-gray-400">$</span>
                        </div>
                        <input
                          type="number"
                          value={proposalRate}
                          onChange={(e) => setProposalRate(e.target.value)}
                          placeholder="Hourly or fixed rate"
                          className="w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Estimated Duration
                      </label>
                      <select
                        value={proposalDuration}
                        onChange={(e) => setProposalDuration(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        required
                      >
                        <option value="">Select duration</option>
                        <option value="Less than 1 week">Less than 1 week</option>
                        <option value="1-2 weeks">1-2 weeks</option>
                        <option value="2-4 weeks">2-4 weeks</option>
                        <option value="1-3 months">1-3 months</option>
                        <option value="3-6 months">3-6 months</option>
                        <option value="More than 6 months">More than 6 months</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <Send className="w-4 h-4 inline mr-2" />
                      Submit Proposal
                    </button>
                  </div>
                </form>
              </div>
            </div>
            
            <div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Project Details</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Budget</p>
                      <p className="text-base font-medium text-gray-900 dark:text-white">
                        {formatCurrency(project.budget)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Deadline</p>
                      <p className="text-base font-medium text-gray-900 dark:text-white">
                        {formatDate(project.deadline)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Briefcase className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Experience Level</p>
                      <p className="text-base font-medium text-gray-900 dark:text-white">
                        {project.experience}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                      <p className="text-base font-medium text-gray-900 dark:text-white">
                        {project.location}
                      </p>
                      </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Posted</p>
                      <p className="text-base font-medium text-gray-900 dark:text-white">
                        {timeAgo(project.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <User className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Proposals</p>
                      <p className="text-base font-medium text-gray-900 dark:text-white">
                        {project.proposals || 0} received
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">About the Client</h3>
                
                <div className="flex items-center mb-4">
                  <img
                    src={project.postedBy.profileImageUrl}
                    alt={project.postedBy.fullName}
                    className="w-12 h-12 rounded-full object-cover mr-3"
                  />
                  
                  <div>
                    <h4 className="text-base font-medium text-gray-900 dark:text-white">
                      {project.postedBy.fullName}
                    </h4>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                        {project.postedBy.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {formatDate(project.postedBy.memberSince)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Projects Posted</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {project.postedBy.completedProjects || 0} projects
                    </p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Link
                    to={`/profile/${project.postedBy.username}`}
                    className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;



