// client/src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Plus, PieChart, Edit, Trash2, IndianRupee } from 'lucide-react';
import AddExpenseModal from '../components/expenses/AddExpenseModal';
import EditExpenseModal from '../components/expenses/EditExpenseModal';
import { useExpenseStore } from '../stores/expenseStore';
import { useGroupStore } from '../stores/groupStore';
import { useAuthStore } from '../stores/authStore';
import { Link } from 'react-router-dom';
import SubscriptionPlans from '../components/payment/SubscriptionPlans';
import { useLanguage } from '../contexts/LanguageContext';
import SEO from './SEO';
import SubscriptionPopup from '../components/payment/SubscriptionPopup';

const Dashboard = () => {
  const user = useAuthStore((s) => s.user);
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const expenses = useExpenseStore((s) => s.expenses);
  const fetchExpenses = useExpenseStore((s) => s.fetchExpenses);
  const deleteExpense = useExpenseStore((s) => s.deleteExpense);
  const setEditingExpense = useExpenseStore((s) => s.setEditingExpense);
  const groups = useGroupStore((s) => s.groups);
  const getGroups = useGroupStore((s) => s.getGroups);
  const [showSubscription, setShowSubscription] = useState(false);
  const [trialStatus, setTrialStatus] = useState(null);
  const [showTrialAlert, setShowTrialAlert] = useState(false);

  useEffect(() => { fetchExpenses(); getGroups(); }, [fetchExpenses, getGroups]);

  useEffect(() => {
    if (user?.subscription?.currentPeriodEnd) {
      const trialEnd = new Date(user.subscription.currentPeriodEnd);
      const now = new Date();
      const daysRemaining = Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24));
      setTrialStatus({ isTrial: daysRemaining > 0, daysRemaining: Math.max(0, daysRemaining), trialEndDate: trialEnd, shouldShowWarning: daysRemaining <= 3 });
      setShowTrialAlert(daysRemaining <= 3);
    }
  }, [user]);

  const handleEdit = (expense) => { setEditingExpense(expense); setIsEditModalOpen(true); };
  const handleDelete = async (id) => { if (window.confirm('Delete this expense?')) await deleteExpense(id); };

  const totalExpenses = (expenses || []).reduce((s, e) => s + (e.amount || 0), 0);
  const thisMonthTotal = (expenses || []).reduce((sum, expense) => {
    const expenseDate = new Date(expense.date);
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return (expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear) ? sum + expense.amount : sum;
  }, 0);
  const categoryCount = new Set((expenses || []).map(exp => exp.category)).size;

  const stats = [
    { label: 'Total Spent', value: user?.country === 'India' ? `₹${totalExpenses.toFixed(2)}` : `AED ${totalExpenses.toFixed(2)}`, change: '+12%', icon: IndianRupee, trend: 'up' },
    { label: 'This Month', value: user?.country === 'India' ? `₹${thisMonthTotal.toFixed(2)}` : `AED ${thisMonthTotal.toFixed(2)}`, change: '-5%', icon: PieChart, trend: 'down' },
    { label: 'Categories', value: categoryCount.toString(), change: '+2', icon: PieChart, trend: 'up' },
  ];

  return (
    <>
      <SEO title="Dashboard - Manage Your Expenses" description="Your expense dashboard" />
      <div className="container">
        {trialStatus && (
          <div style={{ background: trialStatus.isTrial ? 'var(--success-light)' : 'var(--warning-light)', padding: 12, borderRadius: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <strong>{trialStatus.isTrial ? `🎉 ${trialStatus.daysRemaining} days free trial remaining` : '⚠️ Trial ended'}</strong>
                <div style={{ fontSize: 13 }}>{trialStatus.isTrial ? 'Enjoy all features for free!' : 'Subscribe to continue'}</div>
              </div>
              <div>
                {(showTrialAlert || !trialStatus.isTrial) && <button className="btn btn-primary btn-sm" onClick={() => setShowSubscription(true)}>Upgrade</button>}
              </div>
            </div>
          </div>
        )}

        {trialStatus?.shouldShowWarning && <SubscriptionPopup trialStatus={trialStatus} onClose={() => setShowTrialAlert(false)} onUpgrade={() => setShowSubscription(true)} />}

        <AddExpenseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        <EditExpenseModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />

        {/* 🌟 FIXED: Renders the subscription overlay popup safely when showSubscription is true */}
        {showSubscription && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
            <SubscriptionPlans onClose={() => setShowSubscription(false)} />
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <h1 className="text-3xl font-bold">{t('dashboard')}</h1>
            <p style={{ color: 'var(--text-light)' }}>{t('welcome')}! Here is your spending overview</p>
          </div>

          {/* 🌟 FIXED: Placed your custom premium button directly inside your main active header tools layout */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button 
              className="btn btn-outline" 
              style={{ borderColor: 'var(--primary)', color: 'var(--primary)', fontWeight: 600 }}
              onClick={() => setShowSubscription(true)}
            >
              👑 Premium Upgrade
            </button>
            <Link to="/groups/create" className="btn btn-outline"><Plus /> {t('createGroup')}</Link>
            <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}><Plus /> {t('addExpense')}</button>
          </div>
        </div>

        <div className="stats-grid">
          {stats.map((s, i) => (
            <div key={i} className="stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <s.icon size={24} />
                <span style={{ color: s.trend === 'up' ? 'var(--success)' : 'var(--danger)' }}>{s.change}</span>
              </div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Recent Expenses</h2>
            <div />
          </div>

          {(expenses || []).length === 0 ? (
            <div style={{ padding: 24, textAlign: 'center' }}>
              <PieChart size={48} />
              <h3>No expenses yet</h3>
              <p>Start tracking</p>
              <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>Add Expense</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(expenses || []).slice(0,5).map(exp => (
                <div key={exp._id} style={{ display: 'flex', justifyContent: 'space-between', padding: 12, border: '1px solid var(--border-light)', borderRadius: 8 }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{exp.description}</div>
                    <div style={{ color: 'var(--text-light)' }}>{new Date(exp.date).toLocaleDateString()}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <div style={{ textAlign: 'right' }}>{user?.country === 'India' ? `₹${exp.amount.toFixed(2)}` : `AED ${exp.amount.toFixed(2)}`}</div>
                    <button onClick={() => handleEdit(exp)} className="btn btn-outline"><Edit size={14} /></button>
                    <button onClick={() => handleDelete(exp._id)} className="btn btn-outline"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Clean & Simple Dashboard Navigation Portal */}
        <div className="container mt-4 px-0">
          <div className="card p-3 border-0 bg-light shadow-sm">
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center">
              <div>
                <h5 className="fw-bold mb-1">Shared Group Ledgers</h5>
                <p className="text-muted small mb-0">Track shared bills, split expenses, and settle balances with friends.</p>
              </div>
              <div className="mt-3 mt-sm-0">
                <a href="/groups" className="btn btn-primary fw-semibold px-4">View Active Groups ({groups?.length || 0})</a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default Dashboard;
