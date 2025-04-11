import { useState, useEffect } from "react";
import { Bell } from "lucide-react";

const NotificationBell = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  
  const apiBase = import.meta.env.MODE === "development"
    ? "http://localhost:5000/api"
    : "https://your-production-url.com/api";

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await fetch(`${apiBase}/notifications/unread-count`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('freelancehub_token')}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUnreadCount(data.count);
        } else {
          throw new Error("Failed to fetch unread count");
        }
      } catch (error) {
        console.error("Error fetching unread notifications count:", error);
        
        // DUMMY fallback - random number between 0 and 5
        setUnreadCount(Math.floor(Math.random() * 6));
      }
    };

    fetchUnreadCount();
    
    // Set up polling to check for new notifications
    const intervalId = setInterval(fetchUnreadCount, 60000); // Check every minute
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="relative">
      <Bell className="w-6 h-6 text-gray-700 dark:text-gray-300" />
      
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </div>
  );
};

export default NotificationBell;
