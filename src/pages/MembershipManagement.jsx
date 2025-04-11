import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useMembership } from "../hooks/useMembership";
import { memberships } from "../data/memberships";

const MembershipManagement = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useLocalStorage("currentUser", null);
  const { membershipStatus } = useMembership();
  const [autoRenew, setAutoRenew] = useState(
    currentUser?.membership?.autoRenew || false
  );

  if (!currentUser) {
    navigate("/login?redirect=membership-management");
    return null;
  }

  const currentMembership = memberships.find(
    (m) => m.name === membershipStatus.type
  );

  const toggleAutoRenew = () => {
    const updatedUser = {
      ...currentUser,
      membership: {
        ...currentUser.membership,
        autoRenew: !autoRenew,
      },
    };
    setCurrentUser(updatedUser);
    setAutoRenew(!autoRenew);
  };

  const cancelMembership = () => {
    if (window.confirm("Are you sure you want to cancel your membership? Your benefits will continue until the end of your current billing period.")) {
      // In a real app, you would call an API to cancel the membership
      // For now, we'll just update the local storage
      const updatedUser = {
        ...currentUser,
        membership: {
          ...currentUser.membership,
          autoRenew: false,
        },
      };
      setCurrentUser(updatedUser);
      setAutoRenew(false);
      alert("Your membership has been canceled and will not renew at the end of the current period.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Manage Your Membership</h1>

        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
          <div className="bg-blue-600 text-white p-6">
            <h2 className="text-2xl font-bold">Current Plan: {membershipStatus.type}</h2>
            <p className="mt-2">
              {membershipStatus.daysRemaining > 0
                ? `Your plan will ${
                    autoRenew ? "renew" : "expire"
                  } in ${membershipStatus.daysRemaining} days`
                : "Your plan has expired"}
            </p>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Membership Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Plan</p>
                  <p className="font-medium">{membershipStatus.type}</p>
                </div>
                <div>
                  <p className="text-gray-600">Status</p>
                  <p className="font-medium">
                    {membershipStatus.isActive ? (
                      <span className="text-green-600">Active</span>
                    ) : (
                      <span className="text-red-600">Expired</span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Bids Remaining</p>
                  <p className="font-medium">{membershipStatus.bidsRemaining}</p>
                </div>
                <div>
                  <p className="text-gray-600">Commission Rate</p>
                  <p className="font-medium">{currentMembership?.commissionRate || 10}%</p>
                </div>
                <div>
                  <p className="text-gray-600">Auto-Renew</p>
                  <p className="font-medium">
                    {autoRenew ? (
                      <span className="text-green-600">Enabled</span>
                    ) : (
                      <span className="text-red-600">Disabled</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Billing</h3>
              {currentMembership?.price > 0 ? (
                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  <p>
                    Your next billing date is{" "}
                    <strong>
                      {new Date(currentUser.membership.endDate).toLocaleDateString()}
                    </strong>
                  </p>
                  <p className="mt-2">
                    You will be charged{" "}
                    <strong>${currentMembership.price.toFixed(2)}</strong> for the next billing cycle.
                  </p>
                </div>
              ) : (
                <p>You are on a free plan with no billing.</p>
              )}

              {currentMembership?.price > 0 && (
                <div className="flex items-center mt-4">
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={autoRenew}
                        onChange={toggleAutoRenew}
                      />
                      <div className={`block w-14 h-8 rounded-full ${autoRenew ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${autoRenew ? 'transform translate-x-6' : ''}`}></div>
                    </div>
                    <div className="ml-3">
                      Auto-renew my membership
                    </div>
                  </label>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/memberships"
                className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-md font-medium text-center hover:bg-blue-700 transition"
              >
                Change Plan
              </Link>
              {currentMembership?.price > 0 && (
                <button
                  onClick={cancelMembership}
                  className="flex-1 py-3 px-4 bg-red-100 text-red-700 rounded-md font-medium text-center hover:bg-red-200 transition"
                >
                  Cancel Membership
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-4">Membership History</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* In a real app, this would be populated from API data */}
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(currentUser.membership.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {membershipStatus.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${currentMembership?.price.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Paid
                      </span>
                    </td>
                  </tr>
                  {/* Example of previous payment */}
                  {membershipStatus.type !== 'Basic' && (
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(new Date(currentUser.membership.startDate).getTime() - 30*24*60*60*1000).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        Basic
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        $0.00
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          Free
                        </span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipManagement;

