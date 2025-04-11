import { useState, useEffect } from "react";
import { Bell, Check, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

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
            type: "proposal_accepted",
            message: "Your proposal for 'E-commerce Website Redesign' has been accepted!",
            read: false,
            createdAt: "2023-10-15T14:30:00Z",
            projectId: "p1"
          },
          {
            _id: "n2",
            type: "new_message",
            message: "You have a new message from Jane Smith regarding 'Mobile App Development'",
            read: true,
            createdAt: "2023-10-14T09:45:00Z",
            projectId: "p2"
          },
          {
            _id: "n3",
            type: "payment_received",
            message: "You've received a payment of $750 for 'Logo Design Project'",
            read: false,
            createdAt: "2023-10-12T16:20:00Z",
            projectId: "p3"
          },
          {
            _id: "n4",
            type: "project_completed",
            message: "Project 'Website Optimization' has been marked as completed",
            read: true,
            createdAt: "2023-10-10T11:15:00Z",
            projectId: "p4"
          },
          {
            _id: "n5",
            type: "new_project",
            message: "A new project matching your skills has been posted: 'React Native Mobile App'",
            read: false,
            createdAt: "2023-10-08T08:30:00Z",
            projectId: "p5"
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
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return diffInHours === 0 
        ? 'Just now' 
        : `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) {
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
      } else {
        const options = { month: 'short', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
      }
    }
  };

  // Mark notification as read
  const markAsRead = async (id) => {
    try {
      const response = await fetch(`${apiBase}/notifications/${id}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('freelancehub_token')}`
        }
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notification => 
            notification._id === id ? { ...notification, read: true } : notification
          )
        );
      } else {
        throw new Error("Failed to mark notification as read");
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      
      // For demo purposes, update the UI anyway
      setNotifications(prev => 
        prev.map(notification => 
          notification._id === id ? { ...notification, read: true } : notification
        )
      );
    }
  };

  // Delete notification
  const deleteNotification = async (id) => {
    try {
      const response = await fetch(`${apiBase}/notifications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('freelancehub_token')}`
        }
      });

      if (response.ok) {
        setNotifications(prev => prev.filter(notification => notification._id !== id));
      } else {
        throw new Error("Failed to delete notification");
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      
      // For demo purposes, update the UI anyway
      setNotifications(prev => prev.filter(notification => notification._id !== id));
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const response = await fetch(`${apiBase}/notifications/mark-all-read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('freelancehub_token')}`
        }
      });

      if (response.ok) {
        setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
      } else {
        throw new Error("Failed to mark all notifications as read");
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      
      // For demo purposes, update the UI anyway
      setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
    }
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'proposal_accepted':
        return (
          <div className="bg-green-100 dark:bg-green-900 dark:bg-opacity-20 p-2 rounded-full">
            <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
        );
      case 'new_message':
        return (
          <div className="bg-blue-100 dark:bg-blue-900 dark:bg-opacity-20 p-2 rounded-full">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
            </svg>
          </div>
        );
      case 'payment_received':
        return (
          <div className="bg-yellow-100 dark:bg-yellow-900 dark:bg-opacity-20 p-2 rounded-full">
            <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        );
      case 'project_completed':
        return (
          <div className="bg-purple-100 dark:bg-purple-900 dark:bg-opacity-20 p-2 rounded-full">
            <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        );
      case 'new_project':
        return (
          <div className="bg-indigo-100 dark:bg-indigo-900 dark:bg-opacity-20 p-2 rounded-full">
            <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
        );
      default:
        return (
          <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full">
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>
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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          
          {notifications.some(notification => !notification.read) && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              Mark all as read
            </button>
          )}
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {notifications.length === 0 ? (
                        <div className="py-8 text-center text-gray-600 dark:text-gray-400">
                        <Bell className="w-12 h-12 mx-auto mb-3 text-gray-400 dark:text-gray-500" />
                        <p>You don't have any notifications yet.</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div 
                          key={notification._id} 
                          className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 ${!notification.read ? 'bg-blue-50 dark:bg-blue-900 dark:bg-opacity-10' : ''}`}
                        >
                          <div className="flex items-start">
                            <div className="flex-shrink-0 mr-3">
                              {getNotificationIcon(notification.type)}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between">
                                <p className={`text-sm ${!notification.read ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                                  {notification.message}
                                </p>
                                <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                                  {formatDate(notification.createdAt)}
                                </span>
                              </div>
                              
                              <div className="mt-2 flex">
                                {notification.projectId && (
                                  <Link 
                                    to={`/projects/${notification.projectId}`}
                                    className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-4"
                                  >
                                    View Project
                                  </Link>
                                )}
                                
                                {!notification.read && (
                                  <button
                                    onClick={() => markAsRead(notification._id)}
                                    className="text-xs text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 mr-4"
                                  >
                                    Mark as Read
                                  </button>
                                )}
                                
                                <button
                                  onClick={() => deleteNotification(notification._id)}
                                  className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
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
          
