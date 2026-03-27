// client/src/components/payment/SubscriptionPlans.jsx
import React, { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { Check, Crown, Loader } from 'lucide-react';
import { toast } from 'react-hot-toast';

const SubscriptionPlans = ({ onClose }) => {
  const user = useAuthStore((s) => s.user);
  const [loading, setLoading] = useState(false);

  const plans = {
    UAE: { currency: 'AED', monthly: 35, features: ['3 groups maximum','5 members per group','Unlimited personal expenses','1.5% transaction fee','Email support'] },
    India: { currency: '₹', monthly: 249, features: ['3 groups maximum','5 members per group','Unlimited personal expenses','1.5% transaction fee','Email support'] }
  };

  const currentPlan = plans[user?.country || 'UAE'];

  const handleSubscribe = async () => {
    setLoading(true);
    toast.success('🎉 Free trial active! Payment integration coming soon.');
    setLoading(false);
    onClose();
  };

  return (
    <div className="card" style={{ maxWidth: 450, margin: '0.5rem' }}>
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

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button className="btn btn-outline" onClick={onClose}>Maybe Later</button>
        <button className="btn btn-primary" onClick={handleSubscribe} disabled={loading}>{loading ? 'Processing...' : 'Subscribe Now'}</button>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
