import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useExpenseStore } from '../../stores/expenseStore';
import { X, DollarSign, Calendar, Tag, Users } from 'lucide-react';
import { useGroupStore } from '../../stores/groupStore';

const AddExpenseModal = ({ isOpen, onClose }) => {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
  const { createExpense, isLoading } = useExpenseStore();
  const [success, setSuccess] = useState(false);
  const { groups, getGroups } = useGroupStore();

  useEffect(() => {
    if (isOpen) {
      getGroups();
    }
  }, [isOpen, getGroups]);

  const categories = [
    'food', 'transport', 'shopping', 'entertainment',
    'bills', 'healthcare', 'education', 'other'
  ];

  const onSubmit = async (data) => {
    try {
      console.log('📝 Form data received:', data);
      
      // Map data.group from your dropdown field safely
      const targetGroupId = data.group && data.group !== "solo" && data.group !== "" ? data.group : null;

      const expenseData = {
        description: data.description.trim(),
        amount: parseFloat(data.amount),
        category: data.category,
        date: data.date || new Date().toISOString().split('T')[0],
        groupId: targetGroupId,
        group: targetGroupId 
      };

      console.log('📤 Sending processed payload to API:', expenseData);

      const result = await createExpense(expenseData);
      
      if (result && (result.success || result.data)) {
        console.log('✅ Expense created successfully!');
        setSuccess(true);
        reset();
        
        // Refresh the single group calculations instantly
        if (targetGroupId && useGroupStore.getState().getGroup) {
          await useGroupStore.getState().getGroup(targetGroupId);
        }

        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 1500);
      } else {
        alert(result?.error || 'Failed to create expense. Please try again.');
      }
    } catch (error) {
      console.error('❌ Error in onSubmit:', error);
      alert('Error processing submission: ' + error.message);
    }
  };

  const handleClose = () => {
    reset();
    setSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem'
    }}>
      <div style={{
        background: 'white', borderRadius: '8px', padding: '2rem',
        width: '100%', maxWidth: '500px', maxHeight: '90vh', overflow: 'auto', position: 'relative'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>Add New Expense</h2>
          <button onClick={handleClose} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {success && (
          <div style={{ background: '#e6f4ea', color: '#137333', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #137333' }}>
            Expense added successfully!
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Description */}
          <div className="form-group mb-3">
            <label className="form-label fw-semibold small">Description *</label>
            <input
              {...register('description', { required: 'Description is required' })}
              type="text" className={`form-control ${errors.description ? 'is-invalid' : ''}`}
              placeholder="What did you spend on?" disabled={isLoading}
            />
          </div>

          {/* Amount */}
          <div className="form-group mb-3">
            <label className="form-label fw-semibold small">Amount *</label>
            <div style={{ position: 'relative' }}>
              <DollarSign size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
              <input
                {...register('amount', { required: 'Amount is required' })}
                type="number" step="0.01" className="form-control" style={{ paddingLeft: '35px' }} placeholder="0.00" disabled={isLoading}
              />
            </div>
          </div>

          {/* Category */}
          <div className="form-group mb-3">
            <label className="form-label fw-semibold small">Category *</label>
            <div style={{ position: 'relative' }}>
              <Tag size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
              <select {...register('category', { required: 'Category is required' })} className="form-select" style={{ paddingLeft: '35px' }} disabled={isLoading}>
                <option value="">Select a category</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat.toUpperCase()}</option>)}
              </select>
            </div>
          </div>

          {/* 🌟 FIXED: Group Selection Input Elements added back to layout */}
          <div className="form-group mb-3">
            <label className="form-label fw-semibold small">Group (Optional)</label>
            <div style={{ position: 'relative' }}>
              <Users size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
              <select {...register('group')} className="form-select" style={{ paddingLeft: '35px' }} defaultValue="solo" disabled={isLoading}>
                <option value="solo">Personal Expense (No Group)</option>
                {groups && groups.length > 0 && groups.map((g) => (
                  <option key={g._id} value={g._id}>{g.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Date */}
          <div className="form-group mb-4">
            <label className="form-label fw-semibold small">Date</label>
            <div style={{ position: 'relative' }}>
              <Calendar size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
              <input {...register('date')} type="date" className="form-control" style={{ paddingLeft: '35px' }} disabled={isLoading} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100 fw-bold py-2" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Expense'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;
