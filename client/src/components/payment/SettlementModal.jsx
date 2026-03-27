// client/src/components/payment/SettlementModal.jsx
import React, { useState } from 'react';
import { useExpenseStore } from '../../stores/expenseStrore'; // adjust name to your file
import { useAuthStore } from '../../stores/authStore';
import { X, Info } from 'lucide-react';

const SettlementModal = ({ isOpen, onClose, expense, participant }) => {
  const [loading, setLoading] = useState(false);
  const settleExpense = useExpenseStore((s) => s.settleExpense);
  const user = useAuthStore((s) => s.user);

  if (!isOpen || !expense || !participant) return null;

  const amount = Number(participant.share) || 0;
  const fee = amount * 0.015;
  const netAmount = amount - fee;

  const handleSettlement = async () => {
    setLoading(true);
    try {
      const res = await settleExpense(expense._id, participant._id, amount);
      if (res?.success) {
        onClose();
        alert('Payment settled successfully!');
      } else {
        alert(res?.error || 'Settlement failed');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: 'var(--surface)', padding: 24, borderRadius: 8, width: '100%', maxWidth: 520 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Settle Payment</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none' }}><X size={20} /></button>
        </div>

        <div style={{ padding: '1rem', border: '1px solid var(--border-light)', borderRadius: 8, marginTop: 12 }}>
          <div style={{ textAlign: 'center', marginBottom: 8 }}>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{user?.country === 'India' ? '₹' : 'AED '}{amount.toFixed(2)}</div>
            <div style={{ fontSize: 14, color: 'var(--text-light)' }}>for "{expense.description}"</div>
          </div>

          <div style={{ background: 'var(--warning-light)', padding: 12, borderRadius: 6, marginTop: 12 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Info size={16} /> <strong>Fee Breakdown</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <div>Amount to pay:</div>
              <div>{user?.country === 'India' ? '₹' : 'AED '}{amount.toFixed(2)}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              <div>Founder fee (1.5%):</div>
              <div>-{user?.country === 'India' ? '₹' : 'AED '}{fee.toFixed(2)}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontWeight: 600 }}>
              <div>Receiver gets:</div>
              <div>{user?.country === 'India' ? '₹' : 'AED '}{netAmount.toFixed(2)}</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button className="btn btn-outline" onClick={onClose} disabled={loading}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSettlement} disabled={loading}>{loading ? 'Processing...' : `Pay ${user?.country === 'India' ? '₹' : 'AED '}${amount.toFixed(2)}`}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettlementModal;
