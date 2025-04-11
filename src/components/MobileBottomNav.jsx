import { Link } from "react-router-dom";
import { Home, Search, PlusSquare, MessageSquare, User } from "lucide-react";
import { useLocation } from "react-router-dom";

const MobileBottomNav = ({ isLoggedIn, userRole }) => {
  const location = useLocation();
  
  if (!isLoggedIn) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-50">
      <div className="flex justify-around items-center py-2">
        <Link 
          to="/" 
          className={`flex flex-col items-center p-2 ${
            location.pathname === "/" ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
          }`}
        >
          <Home size={24} />
          <span className="text-xs mt-1">Home</span>
        </Link>
        
        <Link 
          to={userRole === "client" ? "/find-freelancers" : "/find-projects"} 
          className={`flex flex-col items-center p-2 ${
            location.pathname.includes("/find") ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
          }`}
        >
          <Search size={24} />
          <span className="text-xs mt-1">Find</span>
        </Link>
        
        <Link 
          to="/post-project" 
          className={`flex flex-col items-center p-2 ${
            location.pathname === "/post-project" ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
          }`}
        >
          <PlusSquare size={24} />
          <span className="text-xs mt-1">Post</span>
        </Link>
        
        <Link 
          to="/messages" 
          className={`flex flex-col items-center p-2 ${
            location.pathname === "/messages" ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
          }`}
        >
          <MessageSquare size={24} />
          <span className="text-xs mt-1">Messages</span>
        </Link>
        
        <Link 
          to="/profile" 
          className={`flex flex-col items-center p-2 ${
            location.pathname === "/profile" ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
          }`}
        >
          <User size={24} />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileBottomNav;
