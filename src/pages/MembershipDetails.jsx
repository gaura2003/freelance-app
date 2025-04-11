import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { memberships } from "../data/memberships";

const MembershipDetails = () => {
  const { id } = useParams();
  const [membership, setMembership] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchMembership = () => {
      const found = memberships.find(m => m._id === id);
      setMembership(found);
      setLoading(false);
    };

    fetchMembership();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading membership details...</p>
      </div>
    );
  }

  if (!membership) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Membership not found.</p>
        <Link to="/memberships" className="text-blue-600 hover:underline mt-4 inline-block">
          Back to Memberships
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{membership.name} Membership</h1>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
          <div className="bg-blue-600 text-white p-6">
            <h2 className="text-2xl font-bold">${membership.price}/month</h2>
            <p className="mt-2 opacity-90">Billed monthly</p>
          </div>
          
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-4">Features</h3>
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
              <Link 
                to={`/membership-checkout/${membership._id}`}
                className="block w-full py-3 px-4 bg-blue-600 text-white rounded-md font-medium text-center hover:bg-blue-700 transition"
              >
                {membership.price === 0 ? 'Select Free Plan' : 'Subscribe Now'}
              </Link>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <Link to="/memberships" className="text-blue-600 hover:underline">
            Back to Memberships
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MembershipDetails;
