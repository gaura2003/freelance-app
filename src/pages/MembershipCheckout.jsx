import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { memberships } from "../data/memberships";
import { useMembership } from "../hooks/useMembership";
import { useLocalStorage } from "../hooks/useLocalStorage";

const MembershipCheckout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [membership, setMembership] = useState(null);
  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [processing, setProcessing] = useState(false);
  const { upgradeMembership } = useMembership();
  const [currentUser] = useLocalStorage("currentUser", null);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login?redirect=memberships");
      return;
    }

    // Simulate API call
    const fetchMembership = () => {
      const found = memberships.find(m => m._id === id);
      setMembership(found);
      setLoading(false);
    };

    fetchMembership();
  }, [id, currentUser, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const success = upgradeMembership(membership.name, duration);
      
      if (success) {
        navigate("/membership-success", { 
          state: { 
            membership: membership,
            duration: duration
          } 
        });
      } else {
        alert("There was an error processing your payment. Please try again.");
        setProcessing(false);
      }
    }, 1500);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading checkout...</p>
      </div>
    );
  }

  if (!membership) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Membership not found.</p>
        <button 
          onClick={() => navigate("/memberships")}
          className="text-blue-600 hover:underline mt-4"
        >
          Back to Memberships
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">Subscription Duration</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    disabled={membership.price === 0}
                  >
                    <option value={1}>1 Month (${(membership.price * 1).toFixed(2)})</option>
                    <option value={3}>3 Months (${(membership.price * 3 * 0.95).toFixed(2)}) - Save 5%</option>
                    <option value={6}>6 Months (${(membership.price * 6 * 0.9).toFixed(2)}) - Save 10%</option>
                    <option value={12}>12 Months (${(membership.price * 12 * 0.8).toFixed(2)}) - Save 20%</option>
                  </select>
                </div>
                
                {membership.price > 0 && (
                  <>
                    <div className="mb-6">
                      <label className="block text-gray-700 mb-2">Payment Method</label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="credit_card"
                            checked={paymentMethod === "credit_card"}
                            onChange={() => setPaymentMethod("credit_card")}
                            className="mr-2"
                          />
                          Credit Card
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="paypal"
                            checked={paymentMethod === "paypal"}
                            onChange={() => setPaymentMethod("paypal")}
                            className="mr-2"
                          />
                          PayPal
                        </label>
                      </div>
                    </div>
                    
                    {paymentMethod === "credit_card" && (
                      <>
                        <div className="mb-4">
                          <label className="block text-gray-700 mb-2">Card Number</label>
                          <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            className="w-full p-3 border border-gray-300 rounded-md"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-gray-700 mb-2">Expiry Date</label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              className="w-full p-3 border border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700 mb-2">CVC</label>
                            <input
                              type="text"
                              placeholder="123"
                              className="w-full p-3 border border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                        
                        <div className="mb-6">
                          <label className="block text-gray-700 mb-2">Name on Card</label>
                          <input
                            type="text"
                            placeholder="John Doe"
                            className="w-full p-3 border border-gray-300 rounded-md"
                          />
                        </div>
                      </>
                    )}
                  </>
                )}
                
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition"
                  disabled={processing}
                >
                  {processing ? 'Processing...' : membership.price === 0 ? 'Confirm Free Plan' : 'Complete Payment'}
                </button>
              </form>
            </div>
          </div>
          
          <div className="md:col-span-1">
            <div className="bg-gray-50 shadow-md rounded-lg p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="mb-4 pb-4 border-b">
                <p className="font-medium">{membership.name} Membership</p>
                <p className="text-gray-600">{duration} month{duration > 1 ? 's' : ''}</p>
              </div>
              
              <div className="mb-4 pb-4 border-b">
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>${(membership.price * duration).toFixed(2)}</span>
                </div>
                
                {duration > 1 && membership.price > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>
                      {duration === 3 ? '5%' : duration === 6 ? '10%' : duration === 12 ? '20%' : '0%'}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>
                  ${membership.price === 0 ? '0.00' : 
                    (duration === 1 ? (membership.price * 1) : 
                     duration === 3 ? (membership.price * 3 * 0.95) : 
                     duration === 6 ? (membership.price * 6 * 0.9) : 
                     (membership.price * 12 * 0.8)).toFixed(2)
                  }
                </span>
              </div>
              
              <div className="mt-6 text-sm text-gray-600">
                <p>By completing this purchase, you agree to our Terms of Service and Privacy Policy.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipCheckout;

