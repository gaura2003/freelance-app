import React, { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";

const MembershipSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser] = useLocalStorage("currentUser", null);
  
  const { membership, duration } = location.state || {};

  useEffect(() => {
    if (!membership || !currentUser) {
      navigate("/memberships");
    }
  }, [membership, currentUser, navigate]);

  if (!membership) {
    return null;
  }

  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + duration);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="bg-green-600 text-white p-6 text-center">
          <svg className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <h1 className="text-3xl font-bold">Payment Successful!</h1>
          <p className="mt-2 text-lg">Your membership has been upgraded successfully.</p>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Membership Details</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Plan</p>
                  <p className="font-medium">{membership.name}</p>
                </div>
                <div>
                  <p className="text-gray-600">Duration</p>
                  <p className="font-medium">{duration} month{duration > 1 ? 's' : ''}</p>
                </div>
                <div>
                  <p className="text-gray-600">Start Date</p>
                  <p className="font-medium">{new Date().toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">End Date</p>
                  <p className="font-medium">{endDate.toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Amount Paid</p>
                  <p className="font-medium">
                    ${membership.price === 0 ? '0.00' : 
                      (duration === 1 ? (membership.price * 1) : 
                       duration === 3 ? (membership.price * 3 * 0.95) : 
                       duration === 6 ? (membership.price * 6 * 0.9) : 
                       (membership.price * 12 * 0.8)).toFixed(2)
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">What's Next?</h2>
            <ul className="space-y-2">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Start bidding on projects with your new {membership.projectBidsPerMonth} bids per month
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                {membership.featuredProfile ? 'Enjoy enhanced profile visibility to attract more clients' : 'Consider upgrading for enhanced profile visibility'}
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Pay only {membership.commissionRate}% commission on your completed projects
              </li>
            </ul>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              to="/find-projects"
              className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-md font-medium text-center hover:bg-blue-700 transition"
            >
              Find Projects
            </Link>
            <Link 
              to="/membership-management"
              className="flex-1 py-3 px-4 bg-gray-200 text-gray-800 rounded-md font-medium text-center hover:bg-gray-300 transition"
            >
              Manage Membership
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipSuccess;
