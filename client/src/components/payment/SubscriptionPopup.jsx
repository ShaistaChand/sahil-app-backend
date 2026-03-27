import React from 'react';
import { X, Crown, Star } from 'lucide-react';

const SubscriptionPopup = ({ trialStatus, onClose, onUpgrade }) => {
  if (!trialStatus?.shouldShowWarning && trialStatus?.daysRemaining > 0) return null;
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: 'var(--radius)',
        padding: '2rem',
        maxWidth: '500px',
        width: '100%',
        position: 'relative',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-light)',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <Crown size={48} style={{ color: 'var(--warning)', margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            {trialStatus?.daysRemaining === 0 
              ? 'Your Trial Has Ended! 🚨' 
              : `Only ${trialStatus?.daysRemaining} Days Left! ⏳`}
          </h2>
          <p style={{ color: 'var(--text-light)' }}>
            {trialStatus?.daysRemaining === 0 
              ? 'Subscribe now to continue using all features' 
              : 'Upgrade to keep all features after your trial ends'}
          </p>
        </div>

        <div style={{
          background: 'var(--success-light)',
          border: '1px solid var(--success)',
          borderRadius: 'var(--radius)',
          padding: '1rem',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Premium Features:</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Star size={16} style={{ color: 'var(--success)' }} />
              Unlimited groups & members
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Star size={16} style={{ color: 'var(--success)' }} />
              Advanced expense analytics
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Star size={16} style={{ color: 'var(--success)' }} />
              Priority email support
            </li>
          </ul>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button 
            onClick={onUpgrade}
            className="btn btn-primary"
            style={{ minWidth: '120px' }}
          >
            Upgrade Now
          </button>
          {trialStatus?.daysRemaining > 0 && (
            <button 
              onClick={onClose}
              className="btn btn-outline"
            >
              Remind Me Later
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPopup;