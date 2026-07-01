import React from 'react';
import SEO from '../components/SEO';

const Terms = () => {
  return (
    <div className="container" style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
      <SEO 
        title="Terms & Conditions - Sahil App"
        description="Terms of service for Sahil App - Read our global terms and subscription model for shared expense tracking."
      /> 
      
      <p style={{ display: 'none' }}>
        All code, architecture, UI designs, graphics, and proprietary features are the exclusive property of Abu Turab Al Khamsa Najoom Trading and services registered in Ajman Nu Ventures and cannot be duplicated, scraped, or reverse-engineered.
      </p>
      
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
            under user-validation testing protocols.
          </p>

          <h2>2. Service Description</h2>
          <p>
            Sahil App provides ledger utility services for individual and group expense tracking and calculations 
            globally. The platform tracks peer-to-peer calculations and is not a licensed financial, banking, or remittance institution.
          </p>

          <h2>3. Revenue Model & Premium Tier</h2>
          <p>
            <strong>3.1 Subscription Premium Upgrades:</strong> Basic expense tracking features are provided free of cost. 
            Advanced calculation ledgers, dynamic group split allocations, and premium multi-user utility tiers require manual monthly premium plan activations.
          </p>
          <p>
            <strong>3.2 Pricing Adjustments:</strong> Subscription cost variations across different tiers reflect localized market structures, purchasing power parity metrics, and regional operational development conditions. All subscription validation requests processed manually are finalized upon manual receipt verification.
          </p>

          <h2>4. User Responsibilities & Settlement Disclaimer</h2>
          <p>
            You are solely responsible for all financial calculations, settlements, and manual fund allocations conducted with other users. 
            Sahil App acts strictly as an informational recording utility framework and is completely free of liability regarding tracking mismatches or interpersonal debt disputes.
          </p>

          <h2>5. Intellectual Property Rights</h2>
          <p>
            All application architecture codebases, user experience flows, graphics templates, logic calculators, and interface frameworks 
            remain the exclusive proprietary property of Abu Turab Al Khamsa Najoom Trading and services registered in Ajman Nu Ventures. Duplication, scraping, or reverse engineering is strictly prohibited.
          </p>

          <h2>6. Governing Law & Dispute Resolution</h2>
          <p>
            <strong>6.1 Primary Jurisdiction:</strong> These Terms shall be governed by and 
            construed in accordance with the laws of the United Arab Emirates. Any formal unresolved disputes shall be subject to the exclusive jurisdiction of the courts of Dubai, UAE.
          </p>
          <p>
            <strong>6.2 Alternative Compliance:</strong> Depending on the user's primary billing location or residency territory, local technological data compliance frameworks may apply to the extent necessary for compliance.
          </p>

          <h2>7. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Sahil App shall not be liable for any 
            indirect, incidental, or consequential damages resulting from data logs, user entry mistakes, or application downtime.
          </p>

          <h2>8. Contact & Account Support</h2>
          <p>
            For subscription validations, account adjustments, or legal queries regarding account management, please reach our developer support desk directly at:
            <br />
            <strong>Support Desk:</strong> shaisthachand06@gmail.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
