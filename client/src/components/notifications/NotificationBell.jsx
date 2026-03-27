import React, { useState } from 'react';
import { Bell, Receipt, Users, DollarSign } from 'lucide-react';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);

  const mockNotifications = [
    { id: 1, type: 'settlement_request', message: 'John requested ₹1,200 settlement', amount: 1200, fromUser: 'John', timestamp: new Date(), read: false },
    { id: 2, type: 'payment_received', message: 'Mike paid you ₹800', amount: 800, fromUser: 'Mike', timestamp: new Date(Date.now() - 300000), read: false },
    { id: 3, type: 'expense_added', message: 'Sarah added "Dinner - ₹2,500"', amount: 2500, fromUser: 'Sarah', timestamp: new Date(Date.now() - 600000), read: true }
  ];

  const unreadCount = mockNotifications.filter(n => !n.read).length;

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setIsOpen(!isOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
        <Bell size={20} />
        {unreadCount > 0 && (
          <span style={{ position: 'absolute', top: 0, right: 0, background: 'var(--danger)', color: 'white', borderRadius: '50%', width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div style={{ position: 'absolute', top: '100%', right: 0, width: 320, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, boxShadow: 'var(--shadow-lg)', zIndex: 1000 }}>
          <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)' }}>
            <strong>Notifications</strong>
          </div>
          <div>
            {mockNotifications.map(n => (
              <div key={n.id} style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-light)', display: 'flex', gap: 8 }}>
                <div style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {n.type === 'settlement_request' ? <DollarSign size={16} /> : n.type === 'payment_received' ? <Receipt size={16} /> : <Users size={16} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.9rem' }}>{n.message}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{n.timestamp.toLocaleTimeString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
