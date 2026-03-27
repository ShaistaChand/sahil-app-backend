import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGroupStore } from '../../stores/groupStore';
import { useExpenseStore } from '../../stores/expenseStore';
import GroupMembers from './GroupMembers';
import GroupBalances from './GroupBalances';
import { ArrowLeft, Plus, Users, DollarSign } from 'lucide-react';

const GroupDetails = () => {
  const { id } = useParams();
  const { currentGroup, getGroup, loading } = useGroupStore();
  const { expenses, fetchExpenses } = useExpenseStore();
  const [activeTab, setActiveTab] = useState('members');

  useEffect(() => {
    if (id) {
      getGroup(id);
      fetchExpenses(id); // Fetch expenses for this group
    }
  }, [id, getGroup, fetchExpenses]);

  const groupExpenses = expenses.filter(expense => expense.group === id);

  if (loading) {
    return <div className="loading-spinner">Loading group details...</div>;
  }

  if (!currentGroup) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>Group not found</p>
        <Link to="/groups" className="btn btn-primary mt-4">
          Back to Groups
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/groups" className="btn btn-outline btn-sm" style={{ marginBottom: '1rem' }}>
          <ArrowLeft size={16} />
          Back to Groups
        </Link>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="text-3xl font-bold">{currentGroup.name}</h1>
            <p style={{ color: 'var(--text-light)', marginTop: '0.5rem' }}>
              {currentGroup.description}
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.875rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Users size={14} />
                {currentGroup.members?.length || 0} members
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <DollarSign size={14} />
                {groupExpenses.length} expenses
              </span>
            </div>
          </div>

          <Link to={`/expenses/create?group=${currentGroup._id}`} className="btn btn-primary">
            <Plus size={20} />
            Add Expense
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ 
        display: 'flex', 
        borderBottom: '1px solid var(--border)',
        marginBottom: '2rem'
      }}>
        <button
          onClick={() => setActiveTab('members')}
          style={{
            padding: '0.75rem 1.5rem',
            borderBottom: activeTab === 'members' ? '2px solid var(--primary)' : '2px solid transparent',
            fontWeight: activeTab === 'members' ? '600' : '400',
            color: activeTab === 'members' ? 'var(--primary)' : 'var(--text)'
          }}
        >
          Group Members
        </button>
        <button
          onClick={() => setActiveTab('balances')}
          style={{
            padding: '0.75rem 1.5rem',
            borderBottom: activeTab === 'balances' ? '2px solid var(--primary)' : '2px solid transparent',
            fontWeight: activeTab === 'balances' ? '600' : '400',
            color: activeTab === 'balances' ? 'var(--primary)' : 'var(--text)'
          }}
        >
          Balances & Settlements
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'members' && (
        <GroupMembers 
          group={currentGroup} 
          onMembersUpdate={() => getGroup(id)} 
        />
      )}

      {activeTab === 'balances' && (
        <GroupBalances 
          group={currentGroup} 
          expenses={groupExpenses} 
        />
      )}
    </div>
  );
};

export default GroupDetails;