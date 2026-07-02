import React, { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { Check, Crown, X } from 'lucide-react';

const SubscriptionPlans = ({ onClose }) => {
  const user = useAuthStore((s) => s.user);
  const [loading, setLoading] = useState(false);
  const [showWioQR, setShowWioQR] = useState(false); // Controls showing payment details

  const plans = {
    UAE: { currency: 'AED', monthly: 15, features: ['3 groups maximum','5 members per group','Unlimited personal expenses','Email support'] },
    India: { currency: '₹', monthly: 249, features: ['3 groups maximum','5 members per group','Unlimited personal expenses','Email support'] }
  };

  const currentPlan = plans[user?.country || 'UAE'];

  const handleSubscribe = async () => {
    setLoading(true);
    // THE SAAS SHORTCUT: Switches on manual payment instructions panel
    setShowWioQR(true); 
    setLoading(false);
  };

  return (
    <div className="card" style={{ 
      maxWidth: 450, 
      width: '95%',
      margin: '0.5rem', 
      maxHeight: '85vh', // 🌟 PREVENTS HIDDEN BUTTONS: Caps height to 85% of screen height
      overflowY: 'auto',  // 🌟 ADDS SCROLLBAR: Lets you scroll down inside the card smoothly!
      position: 'relative',
      padding: '2rem'
    }}>
      {/* 🌟 ADDED CLOSE OPTION: Close "X" button at top-right corner */}
      <button 
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          background: 'none',
          border: 'none',
          color: 'var(--text-light)',
          cursor: 'pointer',
          padding: '0.25rem'
        }}
        aria-label="Close modal"
      >
        <X size={20} />
      </button>

      <div style={{ textAlign: 'center' }}>
        <Crown size={40} style={{ color: 'var(--primary)' }} />
        <h2>Upgrade to Basic Plan</h2>
        <p style={{ color: 'var(--text-light)' }}>Start splitting like a pro</p>
      </div>

      <div style={{ border: '2px solid var(--primary)', borderRadius: 8, padding: 16, textAlign: 'center', marginTop: 12 }}>
        <div style={{ fontSize: '2rem', fontWeight: 700 }}>{currentPlan.currency}{currentPlan.monthly}<span style={{ fontSize: 14, color: 'var(--text-light)' }}>/month</span></div>
        <div style={{ color: 'var(--text-light)' }}>Billed monthly • Cancel anytime</div>

        <div style={{ textAlign: 'left', marginTop: 12 }}>
          {currentPlan.features.map((f, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Check size={16} /> <span>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ⚡ WIO & GPAY MANUAL PORTAL DETAILS PANEL */}
      {showWioQR && (
        <div style={{
          background: '#f8f9fa',
          border: '1px dashed var(--primary)',
          borderRadius: 8,
          padding: 12,
          marginTop: 12,
          fontSize: 13,
          textAlign: 'left'
        }}>
          <strong style={{ color: 'var(--primary)', display: 'block', marginBottom: 4 }}>
            ⚡ Instant Premium Activation:
          </strong>
          <p style={{ margin: '0 0 6px 0' }}>
            Please transfer your subscription fee directly via your banking terminal app:
          </p>
          <ul style={{ paddingLeft: 16, margin: '0 0 8px 0', listStyleType: 'disc' }}>
            <li>
              <strong>🇦🇪 Premium Upgrade Tier:</strong> Transfer <strong>AED 15</strong> via Wio to Account Name: <strong>Shaista Chand (Founder, Nu Ventures / Abu Turab Al Khamsa Najoom Trading)</strong> using Mobile Number: <strong>0503786385</strong>.
            </li>
          </ul>

          {/* 📸 FIXED IMAGE PATH: Uses direct access root link syntax */}
          <div style={{ textAlign: 'center', margin: '12px 0 8px 0' }}>
            <img 
              src="/wio-qr.png" 
              alt="Scan to Pay" 
              style={{ maxWidth: '140px', width: '100%', borderRadius: '4px', border: '1px solid #ddd' }} 
              onError={(e) => { e.target.style.display = 'none'; console.log('QR Image not found in client/public/'); }}
            />
            <span style={{ display: 'block', fontSize: '11px', color: '#666', marginTop: '4px' }}>Scan using Wio or any UAE Bank App</span>
          </div>

          <p style={{ fontSize: 11, color: 'var(--text-light)', margin: '8px 0 0 0', textAlign: 'center' }}>
            📧 Forward your payment receipt screenshot directly to <strong>shaisthachand06@gmail.com</strong>. Your premium dashboard state will be authorized within 10 minutes!
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button className="btn btn-outline" onClick={onClose}>Maybe Later</button>
        <button className="btn btn-primary" onClick={handleSubscribe} disabled={loading}>
          {showWioQR ? 'Refresh Status' : 'Subscribe Now'}
        </button>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
