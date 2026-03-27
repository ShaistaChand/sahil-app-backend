// client/src/components/expenses/CreateExpense.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useExpenseStore } from '../../stores/expenseStrore'; // your file name, ensure this matches actual filename
import { useGroupStore } from '../../stores/groupStore';
import { useAuthStore } from '../../stores/authStore';
import { toast } from 'react-hot-toast';

const CreateExpense = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const groupId = searchParams.get('group') || '';
  const createExpense = useExpenseStore((s) => s.createExpense);
  const isLoading = useExpenseStore((s) => s.isLoading);
  const groups = useGroupStore((s) => s.groups);
  const getGroups = useGroupStore((s) => s.getGroups);
  const notifyExpenseAdded = useGroupStore((s) => s.notifyExpenseAdded);
  const user = useAuthStore((s) => s.user);

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'food',
    date: new Date().toISOString().split('T')[0],
    group: groupId || '',
    paidBy: user?.id || '',
    splitType: 'equal'
  });

  useEffect(() => {
    getGroups();
    // eslint-disable-next-line
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) {
      toast.error('Please fill required fields');
      return;
    }
    try {
      const expenseData = {
        ...formData,
        amount: parseFloat(formData.amount),
        paidBy: user?.id || user?._id
      };
      const res = await createExpense(expenseData);
      if (res?.success) {
        if (formData.group) {
          await notifyExpenseAdded(formData.group, {
            description: formData.description,
            amount: formData.amount,
            paidByName: user?.name,
            paidBy: user?.id || user?._id
          });
          toast.success('Expense added and notified');
        } else {
          toast.success('Expense added successfully');
        }
        navigate(formData.group ? `/groups/${formData.group}` : '/dashboard');
      } else {
        toast.error(res?.error || 'Failed to add expense');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to add expense');
    }
  };

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  return (
    <div className="container">
      <div className="card">
        <h2>Add Expense</h2>
        <form onSubmit={handleSubmit} style={{ maxWidth: 600 }}>
          <div className="form-group">
            <label className="form-label">Description</label>
            <input name="description" value={formData.description} onChange={handleChange} className="form-input" required />
          </div>

          <div className="form-group">
            <label className="form-label">Amount</label>
            <input name="amount" value={formData.amount} onChange={handleChange} type="number" step="0.01" className="form-input" required />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="form-input">
              {['food','transport','shopping','entertainment','bills','healthcare','education','other'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Group (optional)</label>
            <select name="group" value={formData.group} onChange={handleChange} className="form-input">
              <option value="">Personal</option>
              {groups?.map(g => <option key={g._id} value={g._id}>{g.name}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>{isLoading ? 'Adding...' : 'Add Expense'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateExpense;
