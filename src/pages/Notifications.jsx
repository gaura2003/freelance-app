import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell, MessageCircle, DollarSign, Briefcase, AlertCircle, Check } from "lucide-react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const apiBase = import.meta.env.MODE === "development"
    ? "http://localhost:5000/api"
    : "https://your-production-url.com/api";

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${apiBase}/notifications`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('freelancehub_token')}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setNotifications(data);
        } else {
          throw new Error("Failed to fetch notifications");
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setError("Failed to load notifications. Please try again later.");
        
        // DUMMY fallback data
        setNotifications([
          {
            _id: "n1",
            type: "message",
            message: "Jane Smith sent you a message",
            read: false,
            createdAt: "2023-10-14T15:30:00Z",
            projectId: "p1"
          },
          {
            _id: "n2",
            type: "proposal",
            message: "Your proposal for 'Mobile App Development' was accepted",
            read: true,
            createdAt: "2023-10-13T09:15:00Z",
            projectId: "p2"
          },
          {
            _id: "n3",
            type: "payment",
            message: "You received a payment of $750 for 'Logo Design' project",
            read: false,
            createdAt: "2023-10-12T14:45:00Z",
            projectId: "p3"
          },
          {
            _id: "n4",
            type: "project",
            message: "A new project matching your skills was posted: 'E-commerce Website Redesign'",
            read: true,
            createdAt: "2023-10-10T11:20:00Z",
            projectId: "p1"
          },
          {
            _id: "n5",
            type: "system",
            message: "Your account was successfully verified",
            read: true,
            createdAt: "2023-10-05T08:10:00Z"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "message":
        return <MessageCircle className="w-6 h-6 text-blue-500" />;
      case "payment":
        return <DollarSign className="w-6 h-6 text-green-500" />;
      case "project":
        return <Briefcase className="w-6 h-6 text-purple-500" />;
      case "proposal":
        return <Check className="w-6 h-6 text-teal-500" />;
      case "system":
      default:
        return <AlertCircle className="w-6 h-6 text-gray-500" />;
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(`${apiBase}/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('freelancehub_token')}`
        }
      });

      if (response.ok) {
        setNotifications(prevNotifications => 
          prevNotifications.map(notification => 
            notification._id === notificationId 
              ? { ...notification, read: true } 
              : notification
          )
        );
      } else {
        throw new Error("Failed to mark notification as read");
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      
      // For demo purposes, update the UI anyway
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification._id === notificationId 
            ? { ...notification, read: true } 
            : notification
        )
      );
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      const response = await fetch(`${apiBase}/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('freelancehub_token')}`
        }
      });

      if (response.ok) {
        setNotifications(prevNotifications => 
          prevNotifications.filter(notification => notification._id !== notificationId)
        );
      } else {
        throw new Error("Failed to delete notification");
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      
      // For demo purposes, update the UI anyway
      setNotifications(prevNotifications => 
        prevNotifications.filter(notification => notification._id !== notificationId)
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-blue-600 text-lg animate-pulse">Loading notifications...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16 mb-20">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No notifications</h3>
              <p className="text-gray-600 dark:text-gray-400">
                You don't have any notifications at the moment.
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div 
                key={notification._id} 
                className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  !notification.read ? 'bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20' : ''
                }`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <p className={`text-sm text-gray-900 dark:text-white ${!notification.read ? 'font-semibold' : ''}`}>
                        {notification.message}
                      </p>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                        {formatDate(notification.createdAt)}
                      </span>
                    </div>
                    
                    <div className="mt-2 flex">
                      {notification.projectId && (
                        <Link
                          to={`/projects/${notification.projectId}`}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline mr-4"
                        >
                          View Project
                        </Link>
                      )}
                      
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification._id)}
                          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mr-4"
                        >
                          Mark as Read
                        </button>
                      )}
                      
                      <button
                        onClick={() => deleteNotification(notification._id)}
                        className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;

