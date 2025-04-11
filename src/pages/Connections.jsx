import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, MessageCircle, UserMinus, ArrowLeft } from "lucide-react";
import { useAuth } from "../contexts/AuthContext.jsx";

const Connections = () => {
  const [connections, setConnections] = useState([]);
  const [filteredConnections, setFilteredConnections] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const connectionsData = [
        { 
          _id: "c1", 
          name: "Jamie Smith", 
          avatar: "https://i.pravatar.cc/150?img=11", 
          title: "UX Designer", 
          company: "DesignHub",
          location: "San Francisco, CA",
          connectedSince: "2023-05-15T10:30:00Z",
          mutualConnections: 12 
        },
        { 
          _id: "c2", 
          name: "Taylor Wong", 
          avatar: "https://i.pravatar.cc/150?img=12", 
          title: "Frontend Developer", 
          company: "TechCorp",
          location: "Seattle, WA",
          connectedSince: "2023-06-22T14:20:00Z",
          mutualConnections: 8 
        },
        { 
          _id: "c3", 
          name: "Jordan Lee", 
          avatar: "https://i.pravatar.cc/150?img=13", 
          title: "Project Manager", 
          company: "Innovate Inc.",
          location: "Austin, TX",
          connectedSince: "2023-07-10T09:15:00Z",
          mutualConnections: 5 
        },
        { 
          _id: "c4", 
          name: "Alex Johnson", 
          avatar: "https://i.pravatar.cc/150?img=1", 
          title: "Marketing Director", 
          company: "Growth Strategies",
          location: "New York, NY",
          connectedSince: "2023-04-05T11:45:00Z",
          mutualConnections: 15 
        },
        { 
          _id: "c5", 
          name: "Sarah Miller", 
          avatar: "https://i.pravatar.cc/150?img=5", 
          title: "Startup Founder", 
          company: "InnovateTech",
          location: "Boston, MA",
          connectedSince: "2023-03-18T16:30:00Z",
          mutualConnections: 7 
        },
        { 
          _id: "c6", 
          name: "Michael Chen", 
          avatar: "https://i.pravatar.cc/150?img=8", 
          title: "Content Manager", 
          company: "MediaPulse",
          location: "Chicago, IL",
          connectedSince: "2023-02-28T13:20:00Z",
          mutualConnections: 9 
        },
      ];
      
      setConnections(connectionsData);
      setFilteredConnections(connectionsData);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = connections.filter(connection => 
        connection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        connection.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        connection.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredConnections(filtered);
    } else {
      setFilteredConnections(connections);
    }
  }, [searchTerm, connections]);

  const handleRemoveConnection = (connectionId) => {
    // In a real app, this would send a request to the API
    if (confirm("Are you sure you want to remove this connection?")) {
      setConnections(prev => prev.filter(c => c._id !== connectionId));
      setFilteredConnections(prev => prev.filter(c => c._id !== connectionId));
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long' };
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
      <div className="mb-6">
        <Link to="/network" className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
          <ArrowLeft size={16} className="mr-1" />
          Back to Network
        </Link>
        
        <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Connections</h1>
          <div className="mt-4 md:mt-0 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search connections..."
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      {filteredConnections.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
          {filteredConnections.map((connection) => (
            <div key={connection._id} className="p-4 border-b border-gray-100 dark:border-gray-700 last:border-0">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-center">
                  <img 
                    src={connection.avatar} 
                    alt={connection.name} 
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <Link to={`/profile/${connection._id}`} className="text-base font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                      {connection.name}
                    </Link>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{connection.title} at {connection.company}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{connection.location}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Connected since {formatDate(connection.connectedSince)} • {connection.mutualConnections} mutual connections
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0 flex space-x-2">
                  <Link 
                    to={`/messages/${connection._id}`}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 flex items-center"
                  >
                    <MessageCircle size={16} className="mr-1" />
                    Message
                  </Link>
                  <button 
                    onClick={() => handleRemoveConnection(connection._id)}
                    className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center"
                  >
                    <UserMinus size={16} className="mr-1" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm ? "No connections match your search." : "You don't have any connections yet."}
          </p>
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm("")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Clear Search
            </button>
          )}
          {!searchTerm && (
            <Link 
              to="/network"
              className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Find Connections
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Connections;
