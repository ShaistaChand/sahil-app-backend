import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/logo.svg';

const Footer = () => {
  return (
    <footer style={{
      background: 'var(--surface)',
      borderTop: '1px solid var(--border)',
      padding: '2rem 1rem',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          {/* Company Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
    {/* <img src={Logo} alt="Sahil App" style={{ height: '24px' }} /> */}
            <h4 style={{ marginBottom: '1rem', color: 'var(--text)' }}>Sahil App</h4>
              </div>

            <p style={{ color: 'var(--text-light)', fontSize: '0.875rem', lineHeight: '1.5' }}>
              Making group expenses simple and stress-free. Perfect for UAE brunches, 
              Indian trips, and any group gathering.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ marginBottom: '1rem', color: 'var(--text)' }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link to="/dashboard" style={{ color: 'var(--text-light)', fontSize: '0.875rem', textDecoration: 'none' }}>
                Dashboard
              </Link>
              <Link to="/groups" style={{ color: 'var(--text-light)', fontSize: '0.875rem', textDecoration: 'none' }}>
                Groups
              </Link>
              <Link to="/expenses" style={{ color: 'var(--text-light)', fontSize: '0.875rem', textDecoration: 'none' }}>
                Expenses
              </Link>
            </div>
          </div>

          {/* Legal */}
           <div>
            <h4 style={{ marginBottom: '1rem', color: 'var(--text)' }}>Legal</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link to="/terms" style={{ color: 'var(--text-light)', fontSize: '0.875rem', textDecoration: 'none' }}>
                Terms & Conditions
              </Link>
              <Link to="/privacy" style={{ color: 'var(--text-light)', fontSize: '0.875rem', textDecoration: 'none' }}>
                Privacy Policy
              </Link>
              <Link to="/refunds" style={{ color: 'var(--text-light)', fontSize: '0.875rem', textDecoration: 'none' }}>
                Refund Policy
              </Link>
            </div>
          </div> 

          {/* Revenue Info */}
          <div>
            <h4 style={{ marginBottom: '1rem', color: 'var(--text)' }}>Pricing</h4>
            <div style={{ color: 'var(--text-light)', fontSize: '0.875rem', lineHeight: '1.5' }}>
              <div>UAE: AED 35/month</div>
              <div>India: ₹ 249/month</div>
              <div style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
                +1.5% transaction fee on settlements
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid var(--border-light)',
          paddingTop: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>
            © 2024 Sahil App. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-light)' }}>
            <span>Made with 💚 for UAE & India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;