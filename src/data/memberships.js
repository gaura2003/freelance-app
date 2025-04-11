export const memberships = [
  {
    _id: "m1",
    name: "Basic",
    price: 0,
    duration: 1,
    features: [
      "10 project bids per month",
      "Standard profile visibility",
      "Basic support",
      "10% platform commission"
    ],
    projectBidsPerMonth: 10,
    featuredProfile: false,
    prioritySupport: false,
    commissionRate: 10
  },
  {
    _id: "m2",
    name: "Premium",
    price: 19.99,
    duration: 1,
    features: [
      "30 project bids per month",
      "Enhanced profile visibility",
      "Priority support",
      "7% platform commission"
    ],
    projectBidsPerMonth: 30,
    featuredProfile: true,
    prioritySupport: true,
    commissionRate: 7
  },
  {
    _id: "m3",
    name: "Pro",
    price: 39.99,
    duration: 1,
    features: [
      "Unlimited project bids",
      "Featured profile placement",
      "24/7 priority support",
      "5% platform commission"
    ],
    projectBidsPerMonth: 9999,
    featuredProfile: true,
    prioritySupport: true,
    commissionRate: 5
  }
];
