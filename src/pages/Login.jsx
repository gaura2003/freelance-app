import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";

const Login = () => {
  const { isDark } = useTheme();
  const [credentials, setCredentials] = useState({ 
    username: "", 
    password: "",
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const apiUrl = import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/login"
    : "https://67f8e65f094de2fe6e9fa7ac.mockapi.io/api/users/login";

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCredentials((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const validateForm = () => {
    let formErrors = {};
    
    if (!credentials.username.trim()) {
      formErrors.username = "Username or email is required";
    }
    
    if (!credentials.password) {
      formErrors.password = "Password is required";
    }
    
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Try to connect to the API
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Save auth token
        if (credentials.rememberMe) {
          localStorage.setItem("freelancehub_token", data.token);
        } else {
          sessionStorage.setItem("freelancehub_token", data.token);
        }
        
        // Save basic user info
        localStorage.setItem("freelancehub_user", JSON.stringify({
          id: data.user.id,
          username: data.user.username,
          role: data.user.role,
          isDarkMode: data.user.isDarkMode
        }));
        
        // Redirect based on user role
        if (data.user.role === 'admin') {
          window.location.href = "/admin/dashboard";
        } 
        else if (data.user.role === 'client') {
          window.location.href = "/client/dashboard";
        } 
        else {
          window.location.href = "/dashboard";
        }
      } else {
        const errorData = await response.json();
        if (errorData.message === "User not verified") {
          setErrors({ general: "Please verify your email before logging in." });
        } else {
          setErrors({ general: errorData.message || "Invalid credentials" });
        }
      }
    } catch (err) {
      console.warn("API connection failed, trying local fallback...");
      
      // Fallback to local storage for development/demo
      const storedUser = JSON.parse(localStorage.getItem("freelancehub_user"));
      
      if (storedUser && storedUser.username === credentials.username) {
        localStorage.setItem("freelancehub_loggedIn", "true");
        window.location.href = "/dashboard";
      } else {
        setErrors({ general: "Invalid credentials or user not found!" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-blue-700 dark:from-blue-800 dark:to-blue-600">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-blue-800 dark:text-blue-300 text-center">Welcome Back</h2>
        
        {errors.general && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errors.general}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Username or Email</label>
            <input
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
          </div>

          <div className="mb-4">
            <div className="flex justify-between">
              <label className="block text-gray-700 dark:text-gray-300 mb-1">Password</label>
              
            </div>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            />
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline dark:text-blue-400 ">
                Forgot Password?
              </Link>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="rememberMe"
                checked={credentials.rememberMe}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-gray-700 dark:text-gray-300">Remember me</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-800 hover:bg-blue-700 text-white py-2 rounded-md transition duration-200 flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
          
          <div className="mt-6 flex items-center justify-center">
            <span className="border-b w-1/4 md:w-1/4"></span>
            <span className="text-xs text-gray-500 uppercase px-2">or</span>
            <span className="border-b w-1/4 md:w-1/4"></span>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-4">
            <button
              type="button"
              className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.79-1.677-4.184-2.702-6.735-2.702-5.522 0-10 4.478-10 10s4.478 10 10 10c8.396 0 10.249-7.85 9.426-11.748l-9.426 0.082z"/>
              </svg>
              Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
              </svg>
              Facebook
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center text-gray-600 dark:text-gray-400">
          Don't have an account? <Link to="/register" className="text-blue-600 hover:underline dark:text-blue-400">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
