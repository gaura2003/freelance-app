import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  const teamMembers = [
    {
      name: "Jane Cooper",
      role: "CEO & Founder",
      image: "https://i.pravatar.cc/150?img=5",
      bio: "Jane has over 15 years of experience in the tech industry and founded our platform to revolutionize how freelancers and clients connect."
    },
    {
      name: "Robert Johnson",
      role: "CTO",
      image: "https://i.pravatar.cc/150?img=8",
      bio: "Robert leads our engineering team and ensures our platform is secure, scalable, and packed with innovative features."
    },
    {
      name: "Emily Chen",
      role: "Head of Product",
      image: "https://i.pravatar.cc/150?img=10",
      bio: "Emily oversees product development and is passionate about creating intuitive user experiences that help freelancers succeed."
    },
    {
      name: "Michael Rodriguez",
      role: "Marketing Director",
      image: "https://i.pravatar.cc/150?img=3",
      bio: "Michael drives our marketing strategy and is dedicated to growing our community of talented freelancers and clients."
    }
  ];

  const stats = [
    { value: "500K+", label: "Registered Users" },
    { value: "100K+", label: "Completed Projects" },
    { value: "$50M+", label: "Paid to Freelancers" },
    { value: "150+", label: "Countries" }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <section className="mb-16">
          <h1 className="text-3xl font-bold mb-6">About Us</h1>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="mb-4">
                Our mission is to empower freelancers and businesses by providing a platform that makes it easy to connect, 
                collaborate, and succeed together. We believe in creating opportunities for talented individuals around the world 
                and helping businesses find the perfect match for their projects.
              </p>
              <p>
                Founded in 2018, our platform has grown to become a trusted marketplace for freelancers and clients across the globe. 
                We're committed to innovation, quality, and creating a fair and transparent environment for all our users.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">For Freelancers</h2>
                <p className="mb-4">
                  We provide freelancers with the tools and resources they need to showcase their skills, find meaningful projects, 
                  and build successful careers. Our platform offers:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access to quality projects from clients worldwide</li>
                  <li>Secure payment protection</li>
                  <li>Profile tools to showcase your portfolio and skills</li>
                  <li>Networking opportunities with clients and other freelancers</li>
                  <li>Resources to help you grow your freelance business</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">For Clients</h2>
                <p className="mb-4">
                  We help businesses of all sizes find and work with skilled professionals from around the world. Our platform offers:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access to a global talent pool of verified freelancers</li>
                  <li>Tools to easily post projects and review proposals</li>
                  <li>Secure payment processing and milestone tracking</li>
                  <li>Communication tools for seamless collaboration</li>
                  <li>Support throughout the entire project lifecycle</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Our Impact</h2>
          
          <div className="bg-blue-600 text-white rounded-lg p-8 mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {stats.map((stat, index) => (
                <div key={index}>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-blue-100">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Our Values</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="flex items-center mb-2">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h4 className="font-medium">Innovation</h4>
                  </div>
                  <p className="text-gray-600">
                    We continuously improve our platform with new features and technologies to provide the best experience.
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h4 className="font-medium">Community</h4>
                  </div>
                  <p className="text-gray-600">
                    We foster a supportive community where freelancers and clients can connect, learn, and grow together.
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h4 className="font-medium">Trust & Security</h4>
                  </div>
                  <p className="text-gray-600">
                    We prioritize the safety and security of our users with robust systems for payments, privacy, and dispute resolution.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Our Team</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h3 className="font-semibold">{member.name}</h3>
                      <p className="text-blue-600">{member.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        <section>
          <div className="bg-blue-50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Join Our Community</h2>
            <p className="mb-6 max-w-2xl mx-auto">
              Whether you're a freelancer looking for your next opportunity or a business seeking talented professionals,
              our platform is designed to help you succeed.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/register"
                className="py-3 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Sign Up Now
              </Link>
              <Link
                to="/contact"
                className="py-3 px-6 bg-white text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
