import React from "react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <p className="mb-4">Last Updated: {new Date().toLocaleDateString()}</p>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
            <p className="mb-3">
              Welcome to our freelancing platform. We respect your privacy and are committed to protecting your personal data. 
              This privacy policy will inform you about how we look after your personal data when you visit our website and 
              tell you about your privacy rights and how the law protects you.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">2. Data We Collect</h2>
            <p className="mb-3">
              We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
            </p>
            <ul className="list-disc pl-6 mb-3">
              <li>Identity Data: includes first name, last name, username or similar identifier</li>
              <li>Contact Data: includes email address and telephone numbers</li>
              <li>Technical Data: includes internet protocol (IP) address, browser type and version, time zone setting and location, 
                browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website</li>
              <li>Profile Data: includes your username and password, projects posted or applied for, your interests, preferences, feedback and survey responses</li>
              <li>Usage Data: includes information about how you use our website, products and services</li>
            </ul>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">3. How We Use Your Data</h2>
            <p className="mb-3">
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            </p>
            <ul className="list-disc pl-6 mb-3">
              <li>Where we need to perform the contract we are about to enter into or have entered into with you</li>
              <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests</li>
              <li>Where we need to comply with a legal obligation</li>
            </ul>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">4. Data Security</h2>
            <p className="mb-3">
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, 
              altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a 
              business need to know.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">5. Your Legal Rights</h2>
            <p className="mb-3">
              Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:
            </p>
            <ul className="list-disc pl-6 mb-3">
              <li>Request access to your personal data</li>
              <li>Request correction of your personal data</li>
              <li>Request erasure of your personal data</li>
              <li>Object to processing of your personal data</li>
              <li>Request restriction of processing your personal data</li>
              <li>Request transfer of your personal data</li>
              <li>Right to withdraw consent</li>
            </ul>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">6. Cookies</h2>
            <p className="mb-3">
              Our website uses cookies to distinguish you from other users of our website. This helps us to provide you with a good experience when you browse our 
              website and also allows us to improve our site.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">7. Contact Us</h2>
            <p className="mb-3">
              If you have any questions about this privacy policy or our privacy practices, please contact us at:
            </p>
            <p className="mb-3">
              Email: privacy@freelanceplatform.com<br />
              Address: 123 Freelance Street, Digital City, 12345
            </p>
          </section>
        </div>
        
        <div className="text-center">
          <Link to="/terms-of-service" className="text-blue-600 hover:underline mr-4">
            Terms of Service
          </Link>
          <Link to="/" className="text-blue-600 hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
