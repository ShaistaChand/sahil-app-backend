import React from 'react';
import SEO from '../components/SEO';

const Terms = () => {
  return (
    <div className="container" style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
      <SEO 
        title="Terms & Conditions - Sahil App"
        description="Terms of service for Sahil App - Read our terms, conditions, and revenue model for expense splitting services in UAE and India."
      />
      
      <div className="card">
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem' }}>
          Terms & Conditions
        </h1>
        
        <div style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '2rem' }}>
          Last updated: {new Date().toLocaleDateString()}
        </div>

        <div style={{ lineHeight: '1.6' }}>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using Sahil App ("the Service"), you accept and agree to be bound by 
            these Terms & Conditions. The Service is provided as an MVP (Minimum Viable Product) 
            for testing and validation purposes.
          </p>

          <h2>2. Service Description</h2>
          <p>
            Sahil App provides expense splitting and payment collection services for individuals 
            and groups in the United Arab Emirates and India. The Service facilitates financial 
            transactions between users.
            {/* but is not a licensed financial institution. */}
          </p>

          <h2>3. Revenue Model & Fees</h2>
          <p>
            <strong>3.1 Subscription Fees:</strong> Monthly subscription fees vary by country:
          </p>
          <ul>
            <li>United Arab Emirates: AED 35 per month</li>
            <li>India: ₹249 per month</li>
          </ul>
          <p>
            <strong>3.2 Transaction Fees:</strong> A 1.5% founder fee is applied to all settlement 
            transactions to support platform development and maintenance.
          </p>
          <p>
            <strong>3.3 Pricing Justification:</strong> Different pricing for different regions 
            reflects local market conditions, purchasing power parity, payment processing costs, 
            and operational expenses specific to each country.
          </p>

          <h2>4. User Responsibilities</h2>
          <p>
            You are solely responsible for all transactions conducted through the Service. 
            Sahil App acts as a technology platform facilitating transactions between users 
            and is not liable for disputes between users.
          </p>

          {/* <h2>5. MVP Disclaimer</h2>
          <p>
            This Service is provided as an MVP for testing purposes. Features may change, 
            and the Service may be discontinued without notice. Users participate in this 
            testing phase acknowledging these limitations.
          </p> */}

          <h2>6. Governing Law & Dispute Resolution</h2>
          <p>
            <strong>6.1 Primary Jurisdiction:</strong> These Terms shall be governed by and 
            construed in accordance with the laws of the United Arab Emirates, without regard 
            to its conflict of law provisions.
          </p>
          <p>
            <strong>6.2 Secondary Jurisdiction:</strong> For users primarily residing in India, 
            these Terms may also be interpreted under Indian law to the extent necessary for 
            local compliance.
          </p>
          <p>
            <strong>6.3 Dispute Resolution:</strong> Any disputes shall first be attempted to 
            be resolved through mutual discussion. Unresolved disputes may be subject to the 
            jurisdiction of courts in Dubai, UAE, or at the user's option for Indian residents, 
            courts in Mumbai, India.
          </p>
          <p>
            <strong>6.4 Regulatory Compliance:</strong> As an MVP testing platform, Sahil App 
            operates under regulatory frameworks that allow for innovation and testing of 
            financial technology products. The platform will seek appropriate licenses as 
            it scales beyond MVP stage.
          </p>

          <h2>7. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Sahil App shall not be liable for any 
            indirect, incidental, special, consequential, or punitive damages resulting from 
            your use of the Service.
          </p>

          <h2>8. Contact Information</h2>
          <p>
            For questions about these Terms, please contact us at:
            <br />
            {/* Email: legal@sahilapp.com */}
            <br />
            Support: shaisthachand06@gmail.com
            {/* Support: support@sahilapp.com */}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;