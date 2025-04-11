import { Link } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import DarkModeToggle from "./DarkModeToggle.jsx";
import NotificationBell from "./NotificationBell.jsx";
import MobileBottomNav from "./MobileBottomNav.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useTheme } from "../contexts/ThemeContext.jsx";
import { useLocalStorage } from "../hooks/useLocalStorage.js";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage("freelancehub_loggedIn", false);
  const { user, logout } = useAuth();
  const { isDark } = useTheme();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = () => {
    setIsLoggedIn(false);
    logout();
    window.location.href = "/";
  };

  // Define navigation links based on user role
  const getNavLinks = () => {
    const commonLinks = [
      { label: "Home", path: "/" },
      { label: "Messages", path: "/messages" },
    ];

    if (!isLoggedIn) {
      return commonLinks;
    }

    if (user?.role === "client") {
      return [
        ...commonLinks,
        { label: "My Projects", path: "/my-projects" },
        { label: "Post a Project", path: "/post-project" },
        { label: "Dashboard", path: "/dashboard" },
      ];
    } else {
      // Default to freelancer
      return [
        ...commonLinks,
        { label: "Find Work", path: "/find-projects" },
        { label: "My Proposals", path: "/proposals" },
        { label: "Dashboard", path: "/dashboard" },
      ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-md transition-colors duration-200">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          FreelanceHub
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-6 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-500 transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
          
          {isLoggedIn && (
            <Link to="/notifications" className="relative">
              <NotificationBell />
            </Link>
          )}
          
          <DarkModeToggle />
          
          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <Link
                to="/profile"
                className="flex items-center space-x-2 group"
              >
                <img
                  src={user?.profile?.profileImageUrl || "https://i.pravatar.cc/150?img=12"}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border-2 border-blue-500 group-hover:border-blue-600 transition-all duration-200"
                />
                <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-500 transition-colors duration-200">
                  {user?.username || "Profile"}
                </span>
              </Link>
              
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-red-500 transition-colors duration-200"
                aria-label="Logout"
              >
                <LogOut className="w-5 h-5 mr-1" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200 text-sm"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 border border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors duration-200 text-sm"
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-3">
          <DarkModeToggle />
          <button
            className="text-gray-700 dark:text-gray-300"
            onClick={toggleMenu}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 py-4 shadow-lg animate-fadeIn">
          <nav className="flex flex-col space-y-4 px-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-500 py-2 border-b border-gray-100 dark:border-gray-800"
                onClick={toggleMenu}
              >
                {link.label}
              </Link>
            ))}
            
            {isLoggedIn && (
              <Link 
                to="/notifications" 
                className="flex items-center py-2 border-b border-gray-100 dark:border-gray-800"
                onClick={toggleMenu}
              >
                <span className="mr-2">Notifications</span>
                <NotificationBell />
              </Link>
            )}
            
            {isLoggedIn ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 py-2 border-b border-gray-100 dark:border-gray-800"
                  onClick={toggleMenu}
                >
                  <img
                    src={user?.profile?.profileImageUrl || "https://i.pravatar.cc/150?img=12"}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover border-2 border-blue-500"
                  />
                  <span className="text-gray-700 dark:text-gray-300 hover:text-blue-500">
                    {user?.username || "Profile"}
                  </span>
                </Link>
                
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="flex items-center text-gray-700 dark:text-gray-300 hover:text-red-500 py-2"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-3 pt-2">
                <Link
                  to="/login"
                  className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 text-center"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 border border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 text-center"
                  onClick={toggleMenu}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}

      {/* Bottom Navigation for Mobile App Look */}
      <MobileBottomNav isLoggedIn={isLoggedIn} userRole={user?.role} />
    </header>
  );
};

export default Navbar;
