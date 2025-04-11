import React from "react";
import { Link } from "react-router-dom";
import { memberships } from "../data/memberships";
import { useMembership } from "../hooks/useMembership";

const Memberships = () => {
  const { membershipStatus } = useMembership();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Membership Plans</h1>
      
      <div className="bg-blue-50 p-4 rounded-lg mb-8">
        <p className="text-center">
          Your current plan: <span className="font-bold">{membershipStatus.type}</span> | 
          Days remaining: <span className="font-bold">{membershipStatus.daysRemaining}</span> | 
          Bids remaining: <span className="font-bold">{membershipStatus.bidsRemaining}</span>
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {memberships.map((membership) => (
          <div 
            key={membership._id} 
            className={`border rounded-lg overflow-hidden shadow-lg ${
              membershipStatus.type === membership.name ? 'border-blue-500 border-2' : ''
            }`}
          >
            <div className="bg-gray-100 p-6">
              <h2 className="text-2xl font-bold text-center">{membership.name}</h2>
              <p className="text-3xl font-bold text-center mt-4">
                ${membership.price}
                <span className="text-sm font-normal">/month</span>
              </p>
            </div>
            
            <div className="p-6">
              <ul className="space-y-3">
                {membership.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <div className="mt-8">
                {membershipStatus.type === membership.name ? (
                  <button 
                    className="w-full py-3 px-4 bg-gray-300 text-gray-700 rounded-md font-medium"
                    disabled
                  >
                    Current Plan
                  </button>
                ) : (
                  <Link 
                    to={`/membership-checkout/${membership._id}`}
                    className="block w-full py-3 px-4 bg-blue-600 text-white rounded-md font-medium text-center hover:bg-blue-700 transition"
                  >
                    {membership.price === 0 ? 'Select Free Plan' : 'Upgrade Now'}
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <Link to="/membership-management" className="text-blue-600 hover:underline">
          Manage your membership
        </Link>
      </div>
    </div>
  );
};

export default Memberships;
