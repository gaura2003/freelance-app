import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Edit, MapPin, Calendar, Star, Briefcase, Award, ExternalLink } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Profile = () => {
  const { username } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    bio: "",
    location: "",
    skills: [],
    hourlyRate: "",
    website: "",
    github: "",
    linkedin: ""
  });
  const [skillInput, setSkillInput] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const apiBase = import.meta.env.MODE === "development"
    ? "http://localhost:5000/api"
    : "https://your-production-url.com/api";

  const isOwnProfile = isAuthenticated && (username === user?.username || !username);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const endpoint = isOwnProfile && !username
          ? `${apiBase}/users/me`
          : `${apiBase}/users/profile/${username || user?.username}`;

        const response = await fetch(endpoint, {
          headers: isAuthenticated ? {
            'Authorization': `Bearer ${localStorage.getItem('freelancehub_token')}`
          } : {}
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(data);
          
          // Initialize form data if it's the user's own profile
          if (isOwnProfile) {
            setFormData({
              fullName: data.profile.fullName || "",
              bio: data.profile.bio || "",
              location: data.profile.location || "",
              skills: data.profile.skills || [],
              hourlyRate: data.profile.hourlyRate || "",
              website: data.profile.website || "",
              github: data.profile.github || "",
              linkedin: data.profile.linkedin || ""
            });
          }
        } else {
          throw new Error("Failed to fetch profile data");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setError("Failed to load profile data. Please try again later.");
        
        // DUMMY fallback data
        const dummyProfile = {
          _id: "u1",
          username: username || "john_doe",
          email: "john@example.com",
          role: "freelancer",
          profile: {
            fullName: "John Doe",
            bio: "Full-stack developer with 5+ years of experience specializing in React and Node.js. I've worked with startups and enterprise clients to deliver high-quality web applications that solve real business problems.",
            skills: ["React", "Node.js", "MongoDB", "Express", "JavaScript", "TypeScript", "Tailwind CSS"],
            location: "New York, USA",
            profileImageUrl: "https://i.pravatar.cc/300?img=12",
            hourlyRate: 45,
            website: "https://johndoe.dev",
            github: "johndoe",
            linkedin: "johndoe",
            memberSince: "2021-03-15T00:00:00Z"
          },
          stats: {
            projectsCompleted: 27,
            totalEarnings: 32500,
            onTimeDelivery: 98,
            clientSatisfaction: 4.9
          },
          recentProjects: [
            {
              _id: "p1",
              title: "E-commerce Platform Redesign",
              description: "Redesigned the UI/UX of an e-commerce platform, improving conversion rates by 25%",
              completedAt: "2023-09-15T00:00:00Z",
              clientReview: "John delivered exceptional work. The redesign exceeded our expectations.",
              clientRating: 5
            },
            {
              _id: "p2",
              title: "Real-time Chat Application",
              description: "Built a real-time chat application using Socket.io and React",
              completedAt: "2023-07-22T00:00:00Z",
              clientReview: "Great communication and timely delivery. Would hire again.",
              clientRating: 5
            },
            {
              _id: "p3",
              title: "API Integration for Payment System",
              description: "Integrated Stripe payment gateway into an existing application",
              completedAt: "2023-05-10T00:00:00Z",
              clientReview: "John is a skilled developer who solved our payment integration challenges.",
              clientRating: 4.5
            }
          ],
          testimonials: [
            {
              _id: "t1",
              clientName: "Sarah Johnson",
              clientCompany: "TechStart Inc.",
              content: "John is an exceptional developer who consistently delivers high-quality work. His attention to detail and problem-solving skills are outstanding.",
              rating: 5,
              date: "2023-08-20T00:00:00Z"
            },
            {
              _id: "t2",
              clientName: "Michael Chen",
              clientCompany: "DataViz Solutions",
              content: "Working with John was a pleasure. He understood our requirements quickly and delivered a solution that perfectly matched our needs.",
              rating: 5,
              date: "2023-06-15T00:00:00Z"
            }
          ]
        };
        
        setProfile(dummyProfile);
        
        if (isOwnProfile) {
          setFormData({
            fullName: dummyProfile.profile.fullName || "",
            bio: dummyProfile.profile.bio || "",
            location: dummyProfile.profile.location || "",
            skills: dummyProfile.profile.skills || [],
            hourlyRate: dummyProfile.profile.hourlyRate || "",
            website: dummyProfile.profile.website || "",
            github: dummyProfile.profile.github || "",
            linkedin: dummyProfile.profile.linkedin || ""
          });
        }
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated || username) {
      fetchProfileData();
    }
  }, [username, isAuthenticated, user?.username, isOwnProfile]);

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

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Add skill to form data
  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput("");
    }
  };

  // Remove skill from form data
  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  // Handle profile update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${apiBase}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('freelancehub_token')}`
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(prev => ({
          ...prev,
          profile: {
            ...prev.profile,
            ...formData
          }
        }));
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('There was an error updating your profile. Please try again.');
      
      // For demo purposes, update the profile anyway
      setProfile(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          ...formData
        }
      }));
      setIsEditing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-blue-600 text-lg animate-pulse">Loading profile...</div>
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
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="relative h-48 bg-gradient-to-r from-blue-500 to-blue-700">
          {isOwnProfile && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="absolute top-4 right-4 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Edit className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </button>
          )}
        </div>
        
        <div className="relative px-6 pb-6">
          <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 md:-mt-20">
            <img
              src={profile.profile.profileImageUrl}
              alt={profile.profile.fullName}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-gray-800 bg-white dark:bg-gray-700"
            />
            
            <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold">{profile.fullName}</h1>
                {user.membership && user.membership.type !== "Basic" && (
                  <MembershipBadge type={user.membership.type} />
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-400">@{profile.username}</p>
              
              <div className="mt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
                {profile.profile.location && (
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4 mr-1" />
                    {profile.profile.location}
                  </div>
                )}
                
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4 mr-1" />
                  Member since {formatDate(profile.profile.memberSince)}
                </div>
                
                {profile.profile.hourlyRate && (
                  <div className="flex items-center text-gray-900 dark:text-white font-medium">
                    <DollarSign className="w-4 h-4 mr-1" />
                    {profile.profile.hourlyRate}/hr
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Social Links */}
          {!isEditing && (
            <div className="mt-4 flex justify-center md:justify-start space-x-4">
              {profile.profile.website && (
                <a 
                  href={profile.profile.website.startsWith('http') ? profile.profile.website : `https://${profile.profile.website}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              )}
              
              {profile.profile.github && (
                <a 
                  href={`https://github.com/${profile.profile.github}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                  </svg>
                </a>
              )}
              
              {profile.profile.linkedin && (
                <a 
                  href={`https://linkedin.com/in/${profile.profile.linkedin}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Form */}
      {isEditing ? (
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Edit Profile
            </h2>
            
            <form onSubmit={handleUpdateProfile}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="City, Country"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Hourly Rate (USD)
                  </label>
                  <input
                    type="number"
                    name="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={handleInputChange}
                    placeholder="45"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Website
                  </label>
                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://yourwebsite.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    GitHub Username
                  </label>
                  <input
                    type="text"
                    name="github"
                    value={formData.github}
                    onChange={handleInputChange}
                    placeholder="username"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    LinkedIn Username
                  </label>
                  <input
                    type="text"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    placeholder="username"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  ></textarea>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Skills
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      placeholder="Add a skill (e.g., React, Node.js)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSkill();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Add
                    </button>
                  </div>
                  
                  {/* Skills Tags */}
                  {formData.skills.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.skills.map((skill, index) => (
                        <div 
                          key={index} 
                          className="inline-flex items-center bg-blue-100 text-blue-800 dark:bg-blue-900 dark:bg-opacity-30 dark:text-blue-300 text-sm px-2 py-1 rounded"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 focus:outline-none"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="mr-4 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <>
          {/* Profile Tabs */}
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex">
                {["overview", "projects", "testimonials"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-4 text-sm font-medium ${
                      activeTab === tab
                        ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </nav>
            </div>
            
            <div className="p-6">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      About Me
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300">
                      {profile.profile.bio}
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Skills
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {profile.profile.skills.map((skill, index) => (
                        <span 
                          key={index} 
                          className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:bg-opacity-30 dark:text-blue-300 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {profile.stats && (
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Stats & Achievements
                      </h2>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {profile.stats.projectsCompleted}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Projects Completed
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {formatCurrency(profile.stats.totalEarnings)}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Total Earnings
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {profile.stats.onTimeDelivery}%
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            On-time Delivery
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                          <div className="flex items-center justify-center text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {profile.stats.clientSatisfaction}
                            <Star className="w-5 h-5 ml-1 fill-current" />
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Client Satisfaction
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Projects Tab */}
              {activeTab === "projects" && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Recent Projects
                  </h2>
                  
                  {profile.recentProjects && profile.recentProjects.length > 0 ? (
                    <div className="space-y-6">
                      {profile.recentProjects.map((project) => (
                        <div key={project._id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {project.title}
                          </h3>
                          <p className="mt-1 text-gray-600 dark:text-gray-400">
                            {project.description}
                          </p>
                          
                          <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Calendar className="w-4 h-4 mr-1" />
                            Completed on {formatDate(project.completedAt)}
                          </div>
                          
                          {project.clientReview && (
                            <div className="mt-3 bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-600">
                              <div className="flex items-center mb-1">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < Math.floor(project.clientRating)
                                          ? "text-yellow-400 fill-current"
                                          : "text-gray-300 dark:text-gray-600"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                  {project.clientRating}/5
                                </span>
                              </div>
                              <p className="text-sm italic text-gray-600 dark:text-gray-400">
                                "{project.clientReview}"
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400">
                      No projects to display yet.
                    </p>
                  )}
                </div>
              )}
              
              {/* Testimonials Tab */}
              {activeTab === "testimonials" && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Client Testimonials
                  </h2>
                  
                  {profile.testimonials && profile.testimonials.length > 0 ? (
                                        <div className="space-y-6">
                                        {profile.testimonials.map((testimonial) => (
                                          <div key={testimonial._id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                            <div className="flex items-center mb-3">
                                              <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                  <Star
                                                    key={i}
                                                    className={`w-4 h-4 ${
                                                      i < Math.floor(testimonial.rating)
                                                        ? "text-yellow-400 fill-current"
                                                        : "text-gray-300 dark:text-gray-600"
                                                    }`}
                                                  />
                                                ))}
                                              </div>
                                              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                                {testimonial.rating}/5
                                              </span>
                                            </div>
                                            
                                            <p className="text-gray-700 dark:text-gray-300 italic">
                                              "{testimonial.content}"
                                            </p>
                                            
                                            <div className="mt-3 flex items-center justify-between">
                                              <div>
                                                <div className="font-medium text-gray-900 dark:text-white">
                                                  {testimonial.clientName}
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                  {testimonial.clientCompany}
                                                </div>
                                              </div>
                                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {formatDate(testimonial.date)}
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <p className="text-gray-600 dark:text-gray-400">
                                        No testimonials to display yet.
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  };
                  
                  export default Profile;
                  


