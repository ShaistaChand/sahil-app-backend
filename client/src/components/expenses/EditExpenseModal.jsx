import React from 'react';
import { useForm } from 'react-hook-form';
import { useExpenseStore } from '../../stores/expenseStore';
import { X, DollarSign, Calendar, Tag } from 'lucide-react';

const EditExpenseModal = ({ isOpen, onClose }) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
  const { editingExpense, updateExpense, isLoading, clearEditingExpense } = useExpenseStore();

  // Pre-fill form when expense data is available
  React.useEffect(() => {
    if (editingExpense) {
      setValue('description', editingExpense.description);
      setValue('amount', editingExpense.amount);
      setValue('category', editingExpense.category);
      setValue('date', new Date(editingExpense.date).toISOString().split('T')[0]);
    }
  }, [editingExpense, setValue]);

  const categories = [
    'food', 'transport', 'shopping', 'entertainment',
    'bills', 'healthcare', 'education', 'other'
  ];

  const onSubmit = async (data) => {
    if (!editingExpense) return;
    
    const result = await updateExpense(editingExpense._id, {
      ...data,
      amount: parseFloat(data.amount)
    });
    
    if (result.success) {
      handleClose();
    }
  };

  const handleClose = () => {
    reset();
    clearEditingExpense();
    onClose();
  };

  if (!isOpen || !editingExpense) return null;

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
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>Edit Expense</h2>
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

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description</label>
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
            <label className="form-label">Amount</label>
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

          {/* Category */}
          <div className="form-group">
            <label className="form-label">Category</label>
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
              >
                <option value="">Select a category</option>
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
              {isLoading ? 'Updating...' : 'Update Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditExpenseModal;