import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock, CheckCircle, XCircle, AlertCircle, ChevronRight, Filter } from "lucide-react";

const Proposals = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  const apiBase = import.meta.env.MODE === "development"
    ? "http://localhost:5000/api"
    : "https://your-production-url.com/api";

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const response = await fetch(`${apiBase}/my-applications`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('freelancehub_token')}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setProposals(data);
        } else {
          throw new Error("Failed to fetch proposals");
        }
      } catch (error) {
        console.error("Error fetching proposals:", error);
        
        // DUMMY fallback data
        setProposals([
          {
            _id: "p1",
            projectId: {
              _id: "proj1",
              title: "E-commerce Website Redesign",
              budget: 2500,
              deadline: "2023-12-15T00:00:00Z",
              status: "open"
            },
            proposedBudget: 2200,
            status: "pending",
            createdAt: "2023-10-05T14:30:00Z"
          },
          {
            _id: "p2",
            projectId: {
              _id: "proj2",
              title: "Mobile App Development",
              budget: 5000,
              deadline: "2024-01-20T00:00:00Z",
              status: "open"
            },
            proposedBudget: 4800,
            status: "shortlisted",
            createdAt: "2023-10-02T09:15:00Z"
          },
          {
            _id: "p3",
            projectId: {
              _id: "proj3",
              title: "Logo Design for Tech Startup",
              budget: 500,
              deadline: "2023-11-10T00:00:00Z",
              status: "open"
            },
            proposedBudget: 450,
            status: "rejected",
            createdAt: "2023-09-28T16:45:00Z"
          },
          {
            _id: "p4",
            projectId: {
              _id: "proj4",
              title: "Content Writing for Blog",
              budget: 800,
              deadline: "2023-11-30T00:00:00Z",
              status: "open"
            },
            proposedBudget: 750,
            status: "accepted",
            createdAt: "2023-10-01T11:20:00Z"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, []);

  // Filter proposals based on status
  const filteredProposals = proposals.filter(proposal => {
    if (filter === "all") return true;
    return proposal.status === filter;
  });

  // Sort proposals
  const sortedProposals = [...filteredProposals].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === "oldest") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else if (sortBy === "budget-high") {
      return b.proposedBudget - a.proposedBudget;
    } else if (sortBy === "budget-low") {
      return a.proposedBudget - b.proposedBudget;
    }
    return 0;
  });

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:bg-opacity-30 dark:text-yellow-300">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      case "shortlisted":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:bg-opacity-30 dark:text-blue-300">
            <AlertCircle className="w-3 h-3 mr-1" />
            Shortlisted
          </span>
        );
      case "accepted":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:bg-opacity-30 dark:text-green-300">
            <CheckCircle className="w-3 h-3 mr-1" />
            Accepted
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:bg-opacity-30 dark:text-red-300">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-blue-600 text-lg animate-pulse">Loading proposals...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16 mb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Proposals</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track and manage your project applications
          </p>
        </div>
        
        <button 
          className="mt-4 md:mt-0 flex items-center text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="w-4 h-4 mr-1" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="all">All Proposals</option>
                <option value="pending">Pending</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="budget-high">Budget: High to Low</option>
                <option value="budget-low">Budget: Low to High</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Proposals List */}
      {sortedProposals.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
            <AlertCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No proposals found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You haven't submitted any proposals yet, or none match your current filters.
          </p>
          <Link
            to="/find-projects"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
          >
            Find Projects to Apply
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedProposals.map((proposal) => (
            <div 
              key={proposal._id} 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              <div className="p-5">
                <div className="flex flex-col md:flex-row justify-between">
                  <div className="mb-4 md:mb-0">
                    <Link 
                      to={`/projects/${proposal.projectId._id}`}
                      className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {proposal.projectId.title}
                    </Link>
                    <div className="flex flex-wrap items-center mt-2 space-x-4">
                      <div className="text-gray-600 dark:text-gray-400 text-sm">
                        Client Budget: {formatCurrency(proposal.projectId.budget)}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400 text-sm">
                        Your Bid: {formatCurrency(proposal.proposedBudget)}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400 text-sm">
                        Deadline: {formatDate(proposal.projectId.deadline)}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-start md:items-end">
                    {getStatusBadge(proposal.status)}
                    <div className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                      Submitted on {formatDate(proposal.createdAt)}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {proposal.status === "accepted" ? (
                      <span className="text-green-600 dark:text-green-400">
                        Congratulations! Your proposal was accepted.
                      </span>
                    ) : proposal.status === "rejected" ? (
                      <span className="text-gray-600 dark:text-gray-400">
                        This proposal was not selected.
                      </span>
                    ) : (
                      <span>
                        Waiting for client review.
                      </span>
                    )}
                  </div>
                  
                  <Link 
                    to={`/proposals/${proposal._id}`}
                    className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    View Details
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Stats Summary */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Proposals", value: proposals.length, color: "blue" },
          { label: "Pending", value: proposals.filter(p => p.status === "pending").length, color: "yellow" },
          { label: "Accepted", value: proposals.filter(p => p.status === "accepted").length, color: "green" },
          { label: "Rejected", value: proposals.filter(p => p.status === "rejected").length, color: "red" }
        ].map((stat, index) => (
          <div 
            key={index} 
            className={`bg-${stat.color}-50 dark:bg-${stat.color}-900 dark:bg-opacity-20 border border-${stat.color}-200 dark:border-${stat.color}-800 rounded-lg p-4 text-center`}
          >
                        <div className={`text-2xl font-bold text-${stat.color}-600 dark:text-${stat.color}-400`}>
              {stat.value}
            </div>
            <div className={`text-sm text-${stat.color}-800 dark:text-${stat.color}-300`}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Proposals;

