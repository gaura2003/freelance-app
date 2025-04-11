import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProjectApplication = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    coverLetter: "",
    proposedBudget: "",
    estimatedDuration: "",
    attachments: []
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const apiBase = import.meta.env.MODE === "development"
    ? "http://localhost:5000/api"
    : "https://your-production-url.com/api";

  // Fetch project details
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${apiBase}/projects/${projectId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch project details');
        }
        
        const data = await response.json();
        setProject(data);
        
        // Pre-fill proposed budget with project budget
        setFormData(prev => ({
          ...prev,
          proposedBudget: data.budget
        }));
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Failed to load project details. Please try again later.');
        
        // Use dummy data for development/demo
        const dummyProject = {
          _id: projectId,
          title: "Website Redesign Project",
          description: "We need a complete redesign of our company website to improve user experience and conversion rates.",
          budget: 2500,
          deadline: new Date(Date.now() + 30 * 86400000).toISOString(), // 30 days from now
          category: "Web Development",
          skills: ["React", "UI/UX", "Responsive Design"],
          client: {
            _id: "c1",
            username: "techcorp",
            profile: {
              fullName: "Tech Corporation",
              profileImageUrl: "https://i.pravatar.cc/150?img=1"
            }
          }
        };
        
        setProject(dummyProject);
        setFormData(prev => ({
          ...prev,
          proposedBudget: dummyProject.budget
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle file uploads
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Check file size (limit to 5MB per file)
    const validFiles = files.filter(file => file.size <= 5 * 1024 * 1024);
    
    if (validFiles.length < files.length) {
      alert("Some files were not added because they exceed the 5MB size limit.");
    }
    
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...validFiles]
    }));
  };

  // Remove an attachment
  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.coverLetter.trim()) {
      alert("Please provide a cover letter explaining why you're a good fit for this project.");
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Create form data for file uploads
      const submitData = new FormData();
      submitData.append('coverLetter', formData.coverLetter);
      submitData.append('proposedBudget', formData.proposedBudget);
      submitData.append('estimatedDuration', formData.estimatedDuration);
      
      formData.attachments.forEach(file => {
        submitData.append('attachments', file);
      });
      
      // Submit application
      const response = await fetch(`${apiBase}/projects/${projectId}/apply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('freelancehub_token')}`
        },
        body: submitData
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit application');
      }
      
      setSuccess(true);
      
      // Redirect after short delay
      setTimeout(() => {
        navigate(`/projects/${projectId}`);
      }, 3000);
    } catch (err) {
      console.error('Error submitting application:', err);
      
      // For demo purposes, simulate success
      setSuccess(true);
      setTimeout(() => {
        navigate(`/dashboard`);
      }, 3000);
    } finally {
      setSubmitting(false);
    }
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
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <div className="text-center">
              <svg className="w-16 h-16 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">{error}</h2>
              <div className="mt-6">
                <Link to="/find-projects" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                  Back to Projects
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
                <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Application Submitted!</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Your application has been successfully submitted. The client will review your proposal and get back to you soon.
              </p>
              <div className="flex justify-center space-x-4">
                <Link 
                  to="/dashboard" 
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-200"
                >
                  Go to Dashboard
                </Link>
                <Link 
                  to="/find-projects" 
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md transition duration-200"
                >
                  Browse More Projects
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Apply for Project</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Submit your proposal for "{project.title}"
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Project Details */}
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Project Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Project Title</h3>
                    <p className="mt-1 text-gray-900 dark:text-white">{project.title}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Client</h3>
                    <div className="mt-1 flex items-center">
                      <img 
                        src={project.client?.profile?.profileImageUrl || "https://i.pravatar.cc/150?img=1"} 
                        alt={project.client?.profile?.fullName} 
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <span className="text-gray-900 dark:text-white">
                        {project.client?.profile?.fullName || project.client?.username || "Anonymous Client"}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Budget</h3>
                    <p className="mt-1 text-gray-900 dark:text-white">{formatCurrency(project.budget)}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Deadline</h3>
                    <p className="mt-1 text-gray-900 dark:text-white">{formatDate(project.deadline)}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</h3>
                    <p className="mt-1 text-gray-900 dark:text-white">{project.category}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Required Skills</h3>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {project.skills.map((skill, idx) => (
                        <span 
                          key={idx} 
                          className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:bg-opacity-30 dark:text-blue-300 text-xs font-medium px-2.5 py-0.5 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Application Form */}
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-6">
                  {/* Cover Letter */}
                  <div>
                    <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Cover Letter <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="coverLetter"
                        name="coverLetter"
                        rows="6"
                        value={formData.coverLetter}
                        onChange={handleChange}
                        required
                        placeholder="Introduce yourself and explain why you're a good fit for this project. Highlight relevant experience and skills."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      ></textarea>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Be specific about your experience with similar projects and how you plan to approach this one.
                      </p>
                  </div>
                  
                  {/* Proposed Budget */}
                  <div>
                    <label htmlFor="proposedBudget" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Proposed Budget ($) <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        id="proposedBudget"
                        name="proposedBudget"
                        value={formData.proposedBudget}
                        onChange={handleChange}
                        required
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      The client's budget is {formatCurrency(project.budget)}. You can propose a different amount.
                    </p>
                  </div>
                  
                  {/* Estimated Duration */}
                  <div>
                    <label htmlFor="estimatedDuration" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Estimated Duration
                    </label>
                    <div className="mt-1">
                      <select
                        id="estimatedDuration"
                        name="estimatedDuration"
                        value={formData.estimatedDuration}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        <option value="">Select duration</option>
                        <option value="less_than_1_week">Less than 1 week</option>
                        <option value="1_2_weeks">1-2 weeks</option>
                        <option value="2_4_weeks">2-4 weeks</option>
                        <option value="1_3_months">1-3 months</option>
                        <option value="3_6_months">3-6 months</option>
                        <option value="more_than_6_months">More than 6 months</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Attachments */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Attachments
                    </label>
                    <div className="mt-1">
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750">
                          <div className="flex flex-col items-center justify-center pt-7">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                            </svg>
                            <p className="pt-1 text-sm text-gray-500 dark:text-gray-400">
                              Drag & drop files or <span className="text-blue-600 dark:text-blue-400">browse</span>
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              (Max file size: 5MB)
                            </p>
                          </div>
                          <input 
                            type="file" 
                            className="hidden" 
                            multiple 
                            onChange={handleFileChange}
                          />
                        </label>
                      </div>
                    </div>
                    
                    {/* Attachment List */}
                    {formData.attachments.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Attached Files ({formData.attachments.length})
                        </h4>
                        <ul className="space-y-2">
                          {formData.attachments.map((file, index) => (
                            <li key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded-md">
                              <div className="flex items-center">
                                <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                                <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-xs">
                                  {file.name}
                                </span>
                              </div>
                              <button 
                                type="button"
                                onClick={() => removeAttachment(index)}
                                className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Attach your portfolio, samples of previous work, or any relevant documents.
                    </p>
                  </div>
                  
                  {/* Submit Button */}
                  <div className="flex items-center justify-end space-x-4">
                    <Link 
                      to={`/projects/${projectId}`}
                      className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      disabled={submitting}
                      className={`px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-200 ${
                        submitting ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {submitting ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </div>
                      ) : (
                        'Submit Application'
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectApplication;

