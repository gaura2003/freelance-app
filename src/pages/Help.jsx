import React, { useState } from "react";
import { Link } from "react-router-dom";

const Help = () => {
  const [activeCategory, setActiveCategory] = useState("getting-started");
  const [expandedFaqs, setExpandedFaqs] = useState({});

  const toggleFaq = (faqId) => {
    setExpandedFaqs(prev => ({
      ...prev,
      [faqId]: !prev[faqId]
    }));
  };

  const categories = [
    { id: "getting-started", name: "Getting Started" },
    { id: "account", name: "Account & Profile" },
    { id: "projects", name: "Projects" },
    { id: "payments", name: "Payments" },
    { id: "membership", name: "Membership" }
  ];

  const faqs = {
    "getting-started": [
      {
        id: "gs1",
        question: "How do I get started as a freelancer?",
        answer: "To get started as a freelancer, create an account, complete your profile with relevant skills and experience, and start browsing available projects. You can apply to projects that match your skills by submitting proposals."
      },
      {
        id: "gs2",
        question: "How do I hire freelancers?",
        answer: "To hire freelancers, create an account, post a detailed project description including requirements and budget, and wait for freelancers to submit proposals. Review the proposals, check freelancer profiles and ratings, and select the best candidate for your project."
      },
      {
        id: "gs3",
        question: "What types of projects can I find on the platform?",
        answer: "Our platform supports a wide range of project categories including web development, design, marketing, writing, and more. You can find both short-term and long-term projects, as well as fixed-price and hourly rate arrangements."
      }
    ],
    "account": [
      {
        id: "acc1",
        question: "How do I change my password?",
        answer: "To change your password, go to Settings > Change Password. You'll need to enter your current password and then your new password twice to confirm."
      },
      {
        id: "acc2",
        question: "How do I update my profile?",
        answer: "To update your profile, go to Settings > Edit Profile. Here you can update your personal information, skills, portfolio, and other profile details."
      },
      {
        id: "acc3",
        question: "Can I have multiple accounts?",
        answer: "No, our terms of service prohibit users from creating multiple accounts. Each user should have only one account on the platform."
      }
    ],
    "projects": [
      {
        id: "proj1",
        question: "How do I post a project?",
        answer: "To post a project, click on the 'Post a Project' button in the navigation menu. Fill out the project details including title, description, budget, and required skills, then submit your project for freelancers to view and apply."
      },
      {
        id: "proj2",
        question: "How many projects can I apply to?",
        answer: "The number of projects you can apply to depends on your membership level. Basic members can apply to a limited number of projects per month, while Premium and Pro members have higher or unlimited application allowances."
      },
      {
        id: "proj3",
        question: "What happens after I submit a proposal?",
        answer: "After submitting a proposal, the client will review it along with other proposals. If they're interested, they may contact you for more information or directly offer you the project. You'll receive notifications for any updates on your proposals."
      }
    ],
    "payments": [
        {
          id: "pay1",
          question: "How do payments work?",
          answer: "Our platform uses a secure payment system. Clients fund projects before work begins, and the payment is held in escrow. Once the work is completed and approved, the funds are released to the freelancer, minus our service fee."
        },
        {
          id: "pay2",
          question: "What are the platform fees?",
          answer: "Our platform charges a service fee that varies based on your membership level. Basic members pay 10% of the project value, Premium members pay 7%, and Pro members pay 5%."
        },
        {
          id: "pay3",
          question: "How do I withdraw my earnings?",
          answer: "To withdraw your earnings, go to the Payments section of your dashboard and click on 'Withdraw Funds'. You can choose your preferred payment method such as bank transfer or PayPal, and the funds will be transferred within 3-5 business days."
        }
      ],
      "membership": [
        {
          id: "mem1",
          question: "What membership plans are available?",
          answer: "We offer three membership tiers: Basic (free), Premium, and Pro. Each tier offers different benefits such as reduced commission rates, more project bids, and featured profile placement."
        },
        {
          id: "mem2",
          question: "How do I upgrade my membership?",
          answer: "To upgrade your membership, go to the Memberships page from your dashboard, select your desired plan, choose a billing cycle (monthly, quarterly, semi-annual, or annual), and complete the payment process."
        },
        {
          id: "mem3",
          question: "Can I cancel my membership?",
          answer: "Yes, you can cancel your membership at any time from the Membership Management page. Your benefits will continue until the end of your current billing period, after which you'll be downgraded to the Basic plan."
        }
      ]
    };
  
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Help Center</h1>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">How can we help you?</h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for help topics..."
                  className="w-full p-3 pl-10 border border-gray-300 rounded-md"
                />
                <svg
                  className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/4">
              <div className="bg-white shadow-md rounded-lg overflow-hidden sticky top-4">
                <div className="p-4">
                  <h3 className="font-semibold mb-3">Categories</h3>
                  <ul className="space-y-2">
                    {categories.map(category => (
                      <li key={category.id}>
                        <button
                          onClick={() => setActiveCategory(category.id)}
                          className={`w-full text-left px-3 py-2 rounded-md transition ${
                            activeCategory === category.id
                              ? "bg-blue-100 text-blue-700"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          {category.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="md:w-3/4">
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">
                    {categories.find(c => c.id === activeCategory)?.name} FAQs
                  </h2>
                  
                  <div className="space-y-4">
                    {faqs[activeCategory]?.map(faq => (
                      <div key={faq.id} className="border border-gray-200 rounded-md overflow-hidden">
                        <button
                          onClick={() => toggleFaq(faq.id)}
                          className="w-full flex justify-between items-center p-4 text-left bg-gray-50 hover:bg-gray-100 transition"
                        >
                          <span className="font-medium">{faq.question}</span>
                          <svg
                            className={`h-5 w-5 transform transition-transform ${
                              expandedFaqs[faq.id] ? "rotate-180" : ""
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                        
                        {expandedFaqs[faq.id] && (
                          <div className="p-4 border-t border-gray-200">
                            <p>{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-3">Still need help?</h3>
                <p className="mb-4">
                  If you couldn't find the answer to your question, feel free to contact our support team.
                </p>
                <Link
                  to="/contact"
                  className="inline-block py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Help;
  
