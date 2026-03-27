// client/src/components/groups/CreateGroup.jsx
import React, { useState } from 'react';
import { useGroupStore } from '../../stores/groupStore';
import { useAuthStore } from '../../stores/authStore';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';

const CreateGroup = () => {
  const navigate = useNavigate();
  const createGroup = useGroupStore((s) => s.createGroup);
  const isLoading = useGroupStore((s) => s.isLoading);
  const user = useAuthStore((s) => s.user);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const hasReachedGroupLimit = user?.subscription?.plan === 'basic' && (user?.limits?.groupsCreated >= 3);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) { toast.error('Group name required'); return; }
    try {
      const res = await createGroup(formData);
      if (res?.success) {
        toast.success('Group created');
        navigate('/groups');
      } else {
        toast.error(res?.error || 'Failed');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to create group');
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <button onClick={() => navigate('/groups')} className="btn btn-outline"><ArrowLeft size={16} /> Back</button>
      </div>

      {hasReachedGroupLimit && (
        <div className="alert alert-error">Basic plan limit reached. Upgrade to create more groups.</div>
      )}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Group Name</label>
            <input name="name" value={formData.name} onChange={handleChange} className="form-input" required disabled={isLoading || hasReachedGroupLimit} />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="form-input" rows={3} disabled={isLoading || hasReachedGroupLimit} />
          </div>

          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => navigate('/groups')} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>{isLoading ? 'Creating...' : <><Save size={14} /> Create Group</>}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroup;
