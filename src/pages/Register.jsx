import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";

const Register = () => {
  const { isDark } = useTheme();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "freelancer",
    profile: {
      fullName: "",
      bio: "",
      skills: "",
      location: "",
      title: "",
      languages: [{ language: "English", proficiency: "fluent" }]
    },
    notifications: {
      email: true,
      projectInvites: true,
      messages: true,
      marketing: false
    },
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const apiUrl = import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/register"
    : "https://your-production-url.com/api/register";

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateStep = (stepNumber) => {
    let stepErrors = {};
    
    if (stepNumber === 1) {
      if (!formData.username.trim()) stepErrors.username = "Username is required";
      else if (formData.username.length < 3) stepErrors.username = "Username must be at least 3 characters";
      else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) stepErrors.username = "Username can only contain letters, numbers and underscores";
      
      if (!formData.email.trim()) stepErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email)) stepErrors.email = "Email is invalid";
      
      if (!formData.password) stepErrors.password = "Password is required";
      else if (formData.password.length < 8) stepErrors.password = "Password must be at least 8 characters";
      else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(formData.password)) 
        stepErrors.password = "Password must include uppercase, lowercase, number and special character";
      
      if (formData.password !== formData.confirmPassword) stepErrors.confirmPassword = "Passwords don't match";
      
      if (!formData.role) stepErrors.role = "Please select a role";
    }
    
    if (stepNumber === 2) {
      if (!formData.profile.fullName.trim()) stepErrors["profile.fullName"] = "Full name is required";
      if (!formData.profile.title && formData.role === "freelancer") stepErrors["profile.title"] = "Professional title is required";
      if (!formData.profile.location.trim()) stepErrors["profile.location"] = "Location is required";
    }
    
    if (stepNumber === 3) {
      if (!formData.agreeToTerms) stepErrors.agreeToTerms = "You must agree to the terms and conditions";
    }
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const saveUserLocally = (user) => {
    localStorage.setItem("freelancehub_user", JSON.stringify(user));
    alert("Registered locally! (API fallback)");
    window.location.href = "/login";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(step)) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          profile: {
            fullName: formData.profile.fullName,
            bio: formData.profile.bio,
            skills: formData.profile.skills.split(",").map(skill => skill.trim()),
            location: formData.profile.location,
            title: formData.profile.title,
            languages: formData.profile.languages
          },
          notifications: formData.notifications
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Registration successful! Please verify your email to continue.");
        window.location.href = "/login";
      } else {
        const errorData = await response.json();
        setErrors(errorData.errors || { general: "Registration failed. Please try again." });
        console.warn("API error:", errorData);
        // Uncomment for local fallback:
        // saveUserLocally(formData);
      }
    } catch (err) {
      console.warn("No API connection, saving locally...");
      saveUserLocally(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <>
            <h2 className="text-2xl font-bold mb-6 text-blue-800 dark:text-blue-300 text-center">Create Your Account</h2>
            
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-1">Username*</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-1">Email*</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-1">Password*</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-1">Confirm Password*</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-1">I am a:*</label>
              <div className="flex space-x-4 mt-2">
                <label className={`flex items-center p-3 border rounded-md cursor-pointer ${formData.role === 'freelancer' ? 'bg-blue-50 border-blue-500 dark:bg-blue-900' : 'border-gray-300 dark:border-gray-700'}`}>
                  <input
                    type="radio"
                    name="role"
                    value="freelancer"
                    checked={formData.role === 'freelancer'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="dark:text-white">Freelancer</span>
                </label>
                <label className={`flex items-center p-3 border rounded-md cursor-pointer ${formData.role === 'client' ? 'bg-blue-50 border-blue-500 dark:bg-blue-900' : 'border-gray-300 dark:border-gray-700'}`}>
                  <input
                    type="radio"
                    name="role"
                    value="client"
                    checked={formData.role === 'client'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="dark:text-white">Client</span>
                </label>
              </div>
              {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
            </div>
          </>
        );
      
      case 2:
        return (
          <>
            <h2 className="text-2xl font-bold mb-6 text-blue-800 dark:text-blue-300 text-center">Profile Information</h2>
            
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-1">Full Name*</label>
              <input
                type="text"
                name="profile.fullName"
                value={formData.profile.fullName}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white ${errors["profile.fullName"] ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors["profile.fullName"] && <p className="text-red-500 text-sm mt-1">{errors["profile.fullName"]}</p>}
            </div>
            
            {formData.role === 'freelancer' && (
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Professional Title*</label>
                <input
                  type="text"
                  name="profile.title"
                  value={formData.profile.title}
                  onChange={handleChange}
                  placeholder="e.g. Full Stack Developer"
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white ${errors["profile.title"] ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors["profile.title"] && <p className="text-red-500 text-sm mt-1">{errors["profile.title"]}</p>}
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-1">Location*</label>
              <input
                type="text"
                name="profile.location"
                value={formData.profile.location}
                onChange={handleChange}
                placeholder="City, Country"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white ${errors["profile.location"] ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors["profile.location"] && <p className="text-red-500 text-sm mt-1">{errors["profile.location"]}</p>}
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-1">Bio</label>
              <textarea
                name="profile.bio"
                value={formData.profile.bio}
                onChange={handleChange}
                rows="3"
                placeholder="Tell us about yourself"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
              ></textarea>
            </div>
            
            {formData.role === 'freelancer' && (
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Skills (comma separated)</label>
                <input
                  type="text"
                  name="profile.skills"
                  value={formData.profile.skills}
                  onChange={handleChange}
                  placeholder="e.g. JavaScript, React, Node.js"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
                />
              </div>
            )}
          </>
        );
      
      case 3:
        return (
          <>
            <h2 className="text-2xl font-bold mb-6 text-blue-800 dark:text-blue-300 text-center">Preferences</h2>
            
            <div className="mb-6">
              <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Notification Preferences</h3>
              
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="notifications.email"
                    checked={formData.notifications.email}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Email notifications</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="notifications.projectInvites"
                    checked={formData.notifications.projectInvites}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Project invitations</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="notifications.messages"
                    checked={formData.notifications.messages}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Message notifications</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="notifications.marketing"
                    checked={formData.notifications.marketing}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Marketing emails</span>
                </label>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className={`mr-2 ${errors.agreeToTerms ? 'border-red-500' : ''}`}
                />
                <span className="text-gray-700 dark:text-gray-300">
                  I agree to the <a href="/terms" className="text-blue-600 hover:underline dark:text-blue-400" target="_blank">Terms of Service</a> and <a href="/privacy" className="text-blue-600 hover:underline dark:text-blue-400" target="_blank">Privacy Policy</a>
                </span>
              </label>
              {errors.agreeToTerms && <p className="text-red-500 text-sm mt-1">{errors.agreeToTerms}</p>}
            </div>
            
            {errors.general && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {errors.general}
              </div>
            )}
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-blue-700 dark:from-blue-800 dark:to-blue-600 py-8">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="mb-6">
          <div className="flex justify-center mb-4">
            <div className="flex items-center">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step === stepNumber 
                      ? 'bg-blue-600 text-white' 
                      : step > stepNumber 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}>
                    {step > stepNumber ? '✓' : stepNumber}
                  </div>
                  {stepNumber < 3 && (
                    <div className={`w-10 h-1 ${
                      step > stepNumber ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          {renderStep()}
          
          <div className="flex justify-between mt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-md transition duration-200"
              >
                Back
              </button>
            )}
            
            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className={`px-4 py-2 bg-blue-800 hover:bg-blue-700 text-white rounded-md transition duration-200 ${
                  step === 1 && !formData.username ? 'ml-auto' : ''
                }`}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-800 hover:bg-blue-700 text-white rounded-md transition duration-200 ml-auto flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registering...
                  </>
                ) : (
                  "Register"
                )}
              </button>
            )}
          </div>
        </form>
        
        <div className="mt-6 text-center text-gray-600 dark:text-gray-400">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline dark:text-blue-400">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

