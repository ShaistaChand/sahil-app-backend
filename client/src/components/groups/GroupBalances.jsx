import React from 'react';
import { DollarSign, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';

const GroupBalances = ({ group, expenses }) => {
  // Calculate balances from expenses
  const calculateBalances = () => {
    const balances = {};
    
    // Initialize all members with 0 balance
    group.members.forEach(member => {
      balances[member.user?._id] = {
        user: member,
        balance: 0,
        paid: 0,
        owed: 0
      };
    });

    // Calculate balances from expenses
    expenses.forEach(expense => {
      const payerId = expense.paidBy?._id;
      const totalAmount = expense.amount;
      const sharePerMember = totalAmount / expense.splitBetween.length;

      // Add to payer's paid amount
      if (balances[payerId]) {
        balances[payerId].paid += totalAmount;
        balances[payerId].balance += totalAmount; // They paid, so they're owed money
      }

      // Subtract from each member's share
      expense.splitBetween.forEach(memberId => {
        if (balances[memberId] && memberId !== payerId) {
          balances[memberId].owed += sharePerMember;
          balances[memberId].balance -= sharePerMember; // They owe money
        }
      });
    });

    return Object.values(balances);
  };

  const balances = calculateBalances();

  // Calculate settlements
  const calculateSettlements = () => {
    const creditors = balances.filter(b => b.balance > 0)
      .sort((a, b) => b.balance - a.balance);
    const debtors = balances.filter(b => b.balance < 0)
      .sort((a, b) => a.balance - b.balance);

    const settlements = [];
    let i = 0, j = 0;

    while (i < creditors.length && j < debtors.length) {
      const creditor = creditors[i];
      const debtor = debtors[j];
      const amount = Math.min(creditor.balance, -debtor.balance);

      if (amount > 0.01) { // Only show settlements above 1 cent
        settlements.push({
          from: debtor.user,
          to: creditor.user,
          amount: amount
        });
      }

      creditor.balance -= amount;
      debtor.balance += amount;

      if (Math.abs(creditor.balance) < 0.01) i++;
      if (Math.abs(debtor.balance) < 0.01) j++;
    }

    return settlements;
  };

  const settlements = calculateSettlements();

  const formatCurrency = (amount) => {
    const symbol = group.currency === 'INR' ? '₹' : 'AED ';
    return `${symbol}${Math.abs(amount).toFixed(2)}`;
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-lg font-semibold">Balances & Settlements</h3>
        <p className="text-sm text-gray-600">Who owes whom in this group</p>
      </div>

      {/* Current Balances */}
      <div style={{ marginBottom: '2rem' }}>
        <h4 className="font-semibold mb-3">Current Balances</h4>
        <div className="space-y-2">
          {balances.map((balance) => (
            <div
              key={balance.user._id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius)',
                background: balance.balance > 0 
                  ? 'var(--success-light)' 
                  : balance.balance < 0 
                  ? 'var(--danger-light)' 
                  : 'var(--surface)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {balance.balance > 0 ? (
                  <TrendingUp size={16} style={{ color: 'var(--success)' }} />
                ) : balance.balance < 0 ? (
                  <TrendingDown size={16} style={{ color: 'var(--danger)' }} />
                ) : (
                  <DollarSign size={16} style={{ color: 'var(--text-light)' }} />
                )}
                <div>
                  <div style={{ fontWeight: '600' }}>{balance.user.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                    Paid: {formatCurrency(balance.paid)} • Owed: {formatCurrency(balance.owed)}
                  </div>
                </div>
              </div>
              <div style={{ 
                fontWeight: '700',
                color: balance.balance > 0 
                  ? 'var(--success)' 
                  : balance.balance < 0 
                  ? 'var(--danger)' 
                  : 'var(--text)'
              }}>
                {balance.balance > 0 ? '+' : ''}{formatCurrency(balance.balance)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Settlements Needed */}
      {settlements.length > 0 && (
        <div>
          <h4 className="font-semibold mb-3">Settlements Needed</h4>
          <div className="space-y-3">
            {settlements.map((settlement, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius)',
                  background: 'var(--warning-light)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontWeight: '600' }}>{settlement.from.name}</div>
                  <ArrowRight size={16} style={{ color: 'var(--warning)' }} />
                  <div style={{ fontWeight: '600' }}>{settlement.to.name}</div>
                </div>
                <div style={{ fontWeight: '700', color: 'var(--warning-dark)' }}>
                  {formatCurrency(settlement.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {settlements.length === 0 && balances.some(b => b.balance !== 0) && (
        <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-light)' }}>
          <p>All balances are settled! 🎉</p>
        </div>
      )}
    </div>
  );
};

export default GroupBalances;