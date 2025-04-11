import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserPlus, Users, UserCheck, UserX, Filter } from "lucide-react";
import { useAuth } from "../contexts/AuthContext.jsx";

const Network = () => {
  const [suggestedConnections, setSuggestedConnections] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setSuggestedConnections([
        { 
          _id: "s1", 
          name: "Casey Rivera", 
          avatar: "https://i.pravatar.cc/150?img=21", 
          title: "Full Stack Developer", 
          mutualConnections: 15,
          bio: "Building web applications with React, Node.js, and MongoDB. Open to freelance opportunities."
        },
        { 
          _id: "s2", 
          name: "Riley Johnson", 
          avatar: "https://i.pravatar.cc/150?img=22", 
          title: "UI Designer", 
          mutualConnections: 7,
          bio: "Creating beautiful and intuitive user interfaces. Specializing in mobile app design."
        },
        { 
          _id: "s3", 
          name: "Morgan Patel", 
          avatar: "https://i.pravatar.cc/150?img=23", 
          title: "Content Strategist", 
          mutualConnections: 4,
          bio: "Helping brands tell their story through compelling content. SEO expert and copywriter."
        },
        { 
          _id: "s4", 
          name: "Avery Williams", 
          avatar: "https://i.pravatar.cc/150?img=24", 
          title: "SEO Specialist", 
          mutualConnections: 9,
          bio: "Driving organic traffic through data-driven SEO strategies. 5+ years of experience."
        },
        { 
          _id: "s5", 
          name: "Jordan Lee", 
          avatar: "https://i.pravatar.cc/150?img=13", 
          title: "Project Manager", 
          mutualConnections: 12,
          bio: "Managing digital projects from concept to completion. Certified Scrum Master."
        },
        { 
          _id: "s6", 
          name: "Taylor Wong", 
          avatar: "https://i.pravatar.cc/150?img=12", 
          title: "Frontend Developer", 
          mutualConnections: 8,
          bio: "Crafting responsive and accessible web experiences. React and Vue.js enthusiast."
        },
      ]);
      
      setPendingRequests([
        { 
          _id: "p1", 
          name: "Alex Johnson", 
          avatar: "https://i.pravatar.cc/150?img=1", 
          title: "Marketing Director", 
          sentAt: "2023-09-15T10:30:00Z",
          type: "received"
        },
        { 
          _id: "p2", 
          name: "Jamie Smith", 
          avatar: "https://i.pravatar.cc/150?img=11", 
          title: "UX Designer", 
          sentAt: "2023-09-18T14:20:00Z",
          type: "sent"
        },
        { 
          _id: "p3", 
          name: "Sarah Miller", 
          avatar: "https://i.pravatar.cc/150?img=5", 
          title: "Startup Founder", 
          sentAt: "2023-09-20T09:15:00Z",
          type: "received"
        },
      ]);
      
      setLoading(false);
    }, 1000);
  }, []);

  const handleConnect = (userId) => {
    // In a real app, this would send a connection request to the API
    alert(`Connection request sent to user ${userId}`);
    
    // Update the UI optimistically
    setSuggestedConnections(prev => 
      prev.filter(connection => connection._id !== userId)
    );
    
    // Add to pending requests with "sent" status
    const newRequest = suggestedConnections.find(c => c._id === userId);
    if (newRequest) {
      setPendingRequests(prev => [...prev, {
        ...newRequest, 
        type: "sent",
        sentAt: new Date().toISOString()
      }]);
    }
  };

  const handleAccept = (userId) => {
    // In a real app, this would accept the connection request via API
    alert(`Connection request from ${userId} accepted`);
    
    // Update the UI optimistically
    setPendingRequests(prev => 
      prev.filter(request => request._id !== userId)
    );
  };

  const handleIgnore = (userId) => {
    // In a real app, this would reject the connection request via API
    alert(`Connection request from ${userId} ignored`);
    
    // Update the UI optimistically
    setPendingRequests(prev => 
      prev.filter(request => request._id !== userId)
    );
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Network</h1>
        <Link to="/connections" className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
          <Users size={18} className="mr-1" />
          <span>View all connections</span>
        </Link>
      </div>
      
      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Pending Requests</h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
            {pendingRequests.map((request) => (
              <div key={request._id} className="p-4 border-b border-gray-100 dark:border-gray-700 last:border-0 flex items-center justify-between">
                <div className="flex items-center">
                  <img 
                    src={request.avatar} 
                    alt={request.name} 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{request.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {request.type === "sent" ? "Request sent" : "Wants to connect"} • {formatDate(request.sentAt)}
                    </p>
                  </div>
                </div>
                
                {request.type === "received" ? (
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleAccept(request._id)}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 flex items-center"
                    >
                      <UserCheck size={16} className="mr-1" />
                      Accept
                    </button>
                    <button 
                      onClick={() => handleIgnore(request._id)}
                      className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center"
                    >
                      <UserX size={16} className="mr-1" />
                      Ignore
                    </button>
                  </div>
                ) : (
                  <span className="text-sm text-gray-500 dark:text-gray-400">Pending</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Suggested Connections */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">People You May Know</h2>
          <button className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            <Filter size={18} className="mr-1" />
            <span>Filter</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suggestedConnections.map((person) => (
            <div key={person._id} className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <img 
                      src={person.avatar} 
                      alt={person.name} 
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    <div className="ml-4">
                      <p className="text-base font-medium text-gray-900 dark:text-white">{person.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{person.title}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleConnect(person._id)}
                    className="flex items-center px-3 py-1 border border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 text-sm"
                  >
                    <UserPlus size={16} className="mr-1" />
                    Connect
                  </button>
                </div>
                
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  {person.bio}
                </p>
                
                <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                  {person.mutualConnections} mutual connections
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            Show More
          </button>
        </div>
      </div>
    </div>
  );
};

export default Network;

