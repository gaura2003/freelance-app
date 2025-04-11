import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { Users, Briefcase, Grid, BarChart2, Settings, LogOut } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext.jsx";
import DarkModeToggle from "../components/DarkModeToggle.jsx";

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user || user.role !== "admin") {
    return <div>Access denied. Redirecting...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-md">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <Link to="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
            FreelanceHub Admin
          </Link>
        </div>
        
        <div className="p-4">
          <div className="flex items-center mb-6">
            <img 
              src={user?.profile?.profileImageUrl || "https://i.pravatar.cc/150?img=12"} 
              alt="Admin" 
              className="w-10 h-10 rounded-full object-cover mr-3"
            />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.username || "Admin"}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
            </div>
          </div>
          
          <nav className="space-y-1">
            <Link to="/admin/dashboard" className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
              <Grid className="mr-3 h-5 w-5" />
              Dashboard
            </Link>
            <Link to="/admin/users" className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
              <Users className="mr-3 h-5 w-5" />
              Users
            </Link>
            <Link to="/admin/projects" className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
              <Briefcase className="mr-3 h-5 w-5" />
              Projects
            </Link>
            <Link to="/admin/reports" className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
              <BarChart2 className="mr-3 h-5 w-5" />
              Reports
            </Link>
            <Link to="/admin/settings" className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
              <Settings className="mr-3 h-5 w-5" />
              Settings
            </Link>
          </nav>
        </div>
        
        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <button 
              onClick={handleLogout}
              className="flex items-center text-gray-700 dark:text-gray-200 hover:text-red-500"
            >
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </button>
            <DarkModeToggle />
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
