import React from "react";
import { Link } from "react-router-dom";

const TermsOfService = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <p className="mb-4">Last Updated: {new Date().toLocaleDateString()}</p>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
            <p className="mb-3">
              By accessing and using this platform, you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">2. Description of Service</h2>
            <p className="mb-3">
              Our platform provides a marketplace connecting freelancers with clients seeking their services. 
              We provide the tools and environment to facilitate these connections but are not a party to any agreements between users.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">3. Registration Obligations</h2>
            <p className="mb-3">
              In consideration of your use of the platform, you agree to:
            </p>
            <ul className="list-disc pl-6 mb-3">
              <li>Provide true, accurate, current, and complete information about yourself as prompted by the registration form</li>
              <li>Maintain and promptly update your registration data to keep it true, accurate, current, and complete</li>
              <li>Create only one account per person</li>
            </ul>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">4. User Conduct</h2>
            <p className="mb-3">
              You agree not to use the service to:
            </p>
            <ul className="list-disc pl-6 mb-3">
              <li>Upload, post, email, transmit, or otherwise make available any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable</li>
              <li>Impersonate any person or entity</li>
              <li>Forge headers or otherwise manipulate identifiers in order to disguise the origin of any content transmitted through the service</li>
              <li>Upload, post, email, transmit, or otherwise make available any content that you do not have a right to make available</li>
              <li>Interfere with or disrupt the service or servers or networks connected to the service</li>
              <li>Collect or store personal data about other users without their explicit consent</li>
            </ul>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">5. Payments and Fees</h2>
            <p className="mb-3">
              We charge fees for certain services provided through our platform. All fees are listed on our website and are subject to change.
              We collect a commission on projects completed through our platform as specified in our fee schedule.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">6. Intellectual Property Rights</h2>
            <p className="mb-3">
              The platform and its original content, features, and functionality are owned by us and are protected by international copyright, 
              trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">7. Termination</h2>
            <p className="mb-3">
              We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, 
              under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">8. Limitation of Liability</h2>
            <p className="mb-3">
              In no event shall we, our directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, 
              special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, 
              resulting from your access to or use of or inability to access or use the service.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">9. Governing Law</h2>
            <p className="mb-3">
              These Terms shall be governed and construed in accordance with the laws, without regard to its conflict of law provisions.
            </p>
          </section>
        </div>
        
        <div className="text-center">
          <Link to="/privacy-policy" className="text-blue-600 hover:underline mr-4">
            Privacy Policy
          </Link>
          <Link to="/" className="text-blue-600 hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
