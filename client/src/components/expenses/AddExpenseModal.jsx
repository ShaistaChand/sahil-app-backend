import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useExpenseStore } from '../../stores/expenseStore';
import { X, DollarSign, Calendar, Tag } from 'lucide-react';
import { useGroupStore } from '../../stores/groupStore';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const AddExpenseModal = ({ isOpen, onClose }) => {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
  // const { createExpense, isLoading } = useExpenseStore();
  const { createExpense, isLoading } = useExpenseStore();
  const [success, setSuccess] = useState(false);
  const { groups, getGroups, isLoading: groupsLoading } = useGroupStore();

  // Watch category to debug
  const selectedCategory = watch('category');
  console.log('🔍 Selected category:', selectedCategory);

  useEffect(() => {
    if (isOpen) {
      getGroups();
    }
  }, [isOpen, getGroups]);

  const categories = [
    'food', 'transport', 'shopping', 'entertainment',
    'bills', 'healthcare', 'education', 'other'
  ];

  // const onSubmit = async (data) => {
  //   try {
  //     console.log('📝 Form data received:', data);
      
  //     // FIX: Build expense data properly
  //     const expenseData = {
  //       description: data.description.trim(),
  //       amount: parseFloat(data.amount),
  //       category: data.category,
  //       date: data.date || new Date().toISOString().split('T')[0],
  //       // Only include group if it has a value and is not empty
  //       ...(data.group && data.group !== '' && { group: data.group })
  //     };

  //     console.log('📤 Sending expense data to API:', expenseData);

  //     const result = await createExpense(expenseData);
      
  //     if (result.success) {
  //       console.log('✅ Expense created successfully');
  //       setSuccess(true);
  //       reset();
  //       setTimeout(() => {
  //         setSuccess(false);
  //         onClose();
  //       }, 1500);
  //     } else {
  //       console.error('❌ Expense creation failed:', result.error);
  //       toast.error(result.error || 'Failed to create expense');
  //     }
  //   } catch (error) {
  //     console.error('❌ Error in onSubmit:', error);
  //     toast.error('Failed to create expense');
  //   }
  // };

  const onSubmit = async (data) => {
  try {
    console.log('📝 Form data received:', data);
    
    // SIMPLE TEST - Remove all complex logic
    const expenseData = {
      description: data.description,
      amount: parseFloat(data.amount),
      category: data.category,
      date: data.date
    };

    console.log('📤 Sending SIMPLE expense data:', expenseData);

    // Try both function names
    const result = await createExpense(expenseData);
    // const result = await addExpense(expenseData); // Alternative
    
    console.log('🟡 Result from store:', result);
    
    if (result && result.success) {
      console.log('✅ Expense created successfully');
      setSuccess(true);
      reset();
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } else {
      console.error('❌ Expense creation failed:', result);
      alert(result?.error || 'Failed to create expense');
    }
  } catch (error) {
    console.error('❌ Error in onSubmit:', error);
    alert('Error: ' + error.message);
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
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        background: 'var(--surface)',
        borderRadius: 'var(--radius)',
        padding: '2rem',
        width: '100%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflow: 'auto',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>Add New Expense</h2>
          <button
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-light)',
              cursor: 'pointer',
              padding: '0.5rem'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {success && (
          <div style={{
            background: 'var(--success-light)',
            color: 'var(--success)',
            padding: '1rem',
            borderRadius: 'var(--radius)',
            marginBottom: '1rem',
            border: '1px solid var(--success)'
          }}>
            Expense added successfully!
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description *</label>
            <input
              {...register('description', {
                required: 'Description is required',
                minLength: {
                  value: 2,
                  message: 'Description must be at least 2 characters'
                }
              })}
              type="text"
              className={`form-input ${errors.description ? 'error' : ''}`}
              placeholder="What did you spend on?"
              disabled={isLoading}
            />
            {errors.description && (
              <div className="form-error">
                {errors.description.message}
              </div>
            )}
          </div>

          {/* Amount */}
          <div className="form-group">
            <label className="form-label">Amount *</label>
            <div style={{ position: 'relative' }}>
              <DollarSign size={20} style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-light)',
                pointerEvents: 'none'
              }} />
              <input
                {...register('amount', {
                  required: 'Amount is required',
                  min: {
                    value: 0.01,
                    message: 'Amount must be greater than 0'
                  },
                  pattern: {
                    value: /^\d+(\.\d{1,2})?$/,
                    message: 'Please enter a valid amount'
                  }
                })}
                type="number"
                step="0.01"
                className={`form-input ${errors.amount ? 'error' : ''}`}
                style={{ paddingLeft: '40px' }}
                placeholder="0.00"
                disabled={isLoading}
              />
            </div>
            {errors.amount && (
              <div className="form-error">
                {errors.amount.message}
              </div>
            )}
          </div>

          {/* Category - FIXED */}
          <div className="form-group">
            <label className="form-label">Category *</label>
            <div style={{ position: 'relative' }}>
              <Tag size={20} style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-light)',
                pointerEvents: 'none'
              }} />
              <select
                {...register('category', {
                  required: 'Category is required'
                })}
                className={`form-input ${errors.category ? 'error' : ''}`}
                style={{ paddingLeft: '40px', appearance: 'none' }}
                disabled={isLoading}
                defaultValue=""
              >
                <option value="" disabled>Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            {errors.category && (
              <div className="form-error">
                {errors.category.message}
              </div>
            )}
          </div>

          {/* Group Selection */}
          <div className="form-group">
            <label className="form-label">Group (Optional)</label>
            {groups && groups.length > 0 ? (
              <select
                {...register('group')}
                className="form-input"
                defaultValue=""
              >
                <option value="">Personal Expense (No Group)</option>
                {groups.map((group) => (
                  <option key={group._id} value={group._id}>
                    {group.name}
                  </option>
                ))}
              </select>
            ) : (
              <div style={{padding: '0.5rem', background: '#f3f4f6', borderRadius: '4px', fontSize: '0.875rem'}}>
                No groups created yet. <Link to="/groups/create" style={{color: 'var(--primary)'}}>Create a group first</Link>
              </div>
            )}
          </div>

          {/* Date */}
          <div className="form-group">
            <label className="form-label">Date</label>
            <div style={{ position: 'relative' }}>
              <Calendar size={20} style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-light)',
                pointerEvents: 'none'
              }} />
              <input
                {...register('date')}
                type="date"
                className="form-input"
                style={{ paddingLeft: '40px' }}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Debug info */}
          <div style={{ 
            fontSize: '0.75rem', 
            color: 'var(--text-light)', 
            marginTop: '1rem',
            padding: '0.5rem',
            background: 'var(--background)',
            borderRadius: 'var(--radius)'
          }}>
            Debug: Category = "{selectedCategory}"
          </div>

          {/* Buttons */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            marginTop: '2rem'
          }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleClose}
              disabled={isLoading}
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
              style={{ flex: 1 }}
            >
              {isLoading ? 'Adding...' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;