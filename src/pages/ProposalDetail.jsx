import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, CheckCircle, XCircle, AlertCircle, MessageCircle, Download, Edit, Trash2 } from "lucide-react";

const ProposalDetail = () => {
  const { proposalId } = useParams();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const apiBase = import.meta.env.MODE === "development"
    ? "http://localhost:5000/api"
    : "https://your-production-url.com/api";

  useEffect(() => {
    const fetchProposalDetails = async () => {
      try {
        const response = await fetch(`${apiBase}/applications/${proposalId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('freelancehub_token')}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setProposal(data);
        } else {
          throw new Error("Failed to fetch proposal details");
        }
      } catch (error) {
        console.error("Error fetching proposal details:", error);
        setError("Failed to load proposal details. Please try again later.");
        
        // DUMMY fallback data
        setProposal({
          _id: proposalId,
          projectId: {
            _id: "proj1",
            title: "E-commerce Website Redesign",
            description: "Looking for an experienced web developer to redesign our e-commerce platform. The project involves updating the UI/UX, improving mobile responsiveness, and integrating new payment gateways.",
            budget: 2500,
            deadline: "2023-12-15T00:00:00Z",
            status: "open",
            clientId: {
              _id: "client1",
              username: "techcorp",
              profile: {
                fullName: "Tech Corporation",
                profileImageUrl: "https://i.pravatar.cc/150?img=4"
              }
            }
          },
          coverLetter: "I'm excited to apply for this project as I have extensive experience in e-commerce website development. I've worked on similar projects for retail clients and can deliver a modern, responsive design that will improve user experience and conversion rates. My expertise in payment gateway integration will ensure a smooth checkout process for your customers.",
          proposedBudget: 2200,
          estimatedDuration: "4 weeks",
          status: "pending",
          createdAt: "2023-10-05T14:30:00Z",
          attachments: [
            {
              filename: "portfolio_sample.pdf",
              originalName: "Portfolio Sample.pdf"
            },
            {
              filename: "previous_work.jpg",
              originalName: "Previous Work.jpg"
            }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProposalDetails();
  }, [proposalId]);

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
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
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:bg-opacity-30 dark:text-yellow-300">
            <Clock className="w-4 h-4 mr-1" />
            Pending Review
          </span>
        );
      case "shortlisted":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:bg-opacity-30 dark:text-blue-300">
            <AlertCircle className="w-4 h-4 mr-1" />
            Shortlisted
          </span>
        );
      case "accepted":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:bg-opacity-30 dark:text-green-300">
            <CheckCircle className="w-4 h-4 mr-1" />
            Accepted
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:bg-opacity-30 dark:text-red-300">
            <XCircle className="w-4 h-4 mr-1" />
            Not Selected
          </span>
        );
      default:
        return null;
    }
  };

  // Handle proposal withdrawal/deletion
  const handleDeleteProposal = async () => {
    try {
      const response = await fetch(`${apiBase}/applications/${proposalId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('freelancehub_token')}`
        }
      });

      if (response.ok) {
        // Redirect to proposals list
        navigate('/proposals');
      } else {
        throw new Error("Failed to withdraw proposal");
      }
    } catch (error) {
      console.error("Error withdrawing proposal:", error);
      // For demo, just redirect anyway
      navigate('/proposals');
    }
  };

  // Handle download attachment
  const handleDownloadAttachment = async (filename) => {
    try {
      window.open(`${apiBase}/applications/${proposalId}/attachments/${filename}`, '_blank');
    } catch (error) {
      console.error("Error downloading attachment:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-blue-600 text-lg animate-pulse">Loading proposal details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="bg-red-50 dark:bg-red-900 dark:bg-opacity-20 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Link
            to="/proposals"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Proposals
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16 mb-20">
      <div className="mb-6">
        <Link
          to="/proposals"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Proposals
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Proposal for: {proposal.projectId.title}
              </h1>
              <div className="mt-2 text-gray-600 dark:text-gray-400">
                Submitted on {formatDate(proposal.createdAt)}
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              {getStatusBadge(proposal.status)}
            </div>
          </div>
        </div>

        {/* Proposal Details */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column - Project Info */}
            <div className="md:col-span-2">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Project Details
                </h2>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {proposal.projectId.description}
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Client Budget:</span>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {formatCurrency(proposal.projectId.budget)}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Deadline:</span>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {formatDate(proposal.projectId.deadline)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Your Proposal
                </h2>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="mb-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Cover Letter:</span>
                    <p className="mt-1 text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {proposal.coverLetter}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Your Bid:</span>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {formatCurrency(proposal.proposedBudget)}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Estimated Duration:</span>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {proposal.estimatedDuration}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {proposal.attachments && proposal.attachments.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Attachments
                  </h2>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <ul className="space-y-2">
                      {proposal.attachments.map((attachment, index) => (
                        <li key={index} className="flex items-center justify-between">
                          <span className="text-gray-700 dark:text-gray-300">
                            {attachment.originalName}
                          </span>
                          <button
                            onClick={() => handleDownloadAttachment(attachment.filename)}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                          >
                            <Download className="w-5 h-5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Client Info & Actions */}
            <div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Client Information
                </h2>
                <div className="flex items-center mb-4">
                  <img
                    src={proposal.projectId.clientId.profile.profileImageUrl}
                    alt="Client"
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {proposal.projectId.clientId.profile.fullName}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      @{proposal.projectId.clientId.username}
                    </div>
                  </div>
                </div>
                <Link
                  to={`/messages/${proposal.projectId.clientId._id}`}
                  className="w-full flex items-center justify-center px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900 dark:hover:bg-opacity-20 transition duration-200"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message Client
                </Link>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Actions
                </h2>
                
                {proposal.status === "pending" && (
                  <div className="space-y-3">
                    <Link
                      to={`/proposals/${proposal._id}/edit`}
                      className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Proposal
                    </Link>
                    
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="w-full flex items-center justify-center px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 dark:hover:bg-red-900 dark:hover:bg-opacity-20 transition duration-200"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Withdraw Proposal
                    </button>
                  </div>
                )}
                
                {proposal.status === "shortlisted" && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 rounded-md">
                    <p className="text-blue-800 dark:text-blue-300 text-sm">
                      <AlertCircle className="w-4 h-4 inline mr-1" />
                      Your proposal has been shortlisted! The client may contact you soon for more details.
                    </p>
                  </div>
                )}
                
                {proposal.status === "accepted" && (
                  <div className="p-4 bg-green-50 dark:bg-green-900 dark:bg-opacity-20 rounded-md">
                    <p className="text-green-800 dark:text-green-300 text-sm">
                      <CheckCircle className="w-4 h-4 inline mr-1" />
                      Congratulations! Your proposal has been accepted. Check your messages for next steps.
                    </p>
                  </div>
                )}
                
                {proposal.status === "rejected" && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-600 rounded-md">
                    <p className="text-gray-800 dark:text-gray-300 text-sm">
                      <XCircle className="w-4 h-4 inline mr-1" />
                      This proposal was not selected. Don't be discouraged - keep applying to other projects!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Withdraw Proposal
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to withdraw this proposal? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProposal}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Withdraw
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProposalDetail;

