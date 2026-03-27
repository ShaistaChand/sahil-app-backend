// client/src/components/groups/GroupMembers.jsx
import React, { useState } from 'react';
import { Plus, Mail, User, X } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useGroupStore } from '../../stores/groupStore';
import { sendEmailNotification } from '../../utils/emailService';

const GroupMembers = ({ group, onMembersUpdate }) => {
  const user = useAuthStore((s) => s.user);
  const addMember = useGroupStore((s) => s.addMember);
  const removeMember = useGroupStore((s) => s.removeMember);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newMember.name || !newMember.email) return;
    setLoading(true);
    try {
      const res = await addMember(group._id, { name: newMember.name, email: newMember.email });
      if (res?.success) {
        // optionally send email via utils (already done in store), but keep safe
        setNewMember({ name: '', email: '' });
        setShowAddMember(false);
        onMembersUpdate?.();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Remove this member?')) return;
    try {
      await removeMember(group._id, memberId);
      onMembersUpdate?.();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Group Members</h3>
        <button onClick={() => setShowAddMember(!showAddMember)} className="btn btn-primary btn-sm" disabled={(group.members || []).length >= 5}><Plus size={16} /> Add</button>
      </div>

      {showAddMember && (
        <div style={{ marginTop: 12, marginBottom: 12 }}>
          <form onSubmit={handleAddMember}>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input value={newMember.name} onChange={(e) => setNewMember({...newMember, name: e.target.value})} className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" value={newMember.email} onChange={(e) => setNewMember({...newMember, email: e.target.value})} className="form-input" required />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Adding...' : 'Add Member'}</button>
              <button type="button" className="btn btn-outline" onClick={() => setShowAddMember(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ marginTop: 12 }}>
        {(group.members || []).length === 0 && <div>No members yet</div>}
        {(group.members || []).map((member) => (
          <div key={member._id || member.user?._id} style={{ display: 'flex', justifyContent: 'space-between', padding: 12, border: '1px solid var(--border-light)', borderRadius: 8, marginBottom: 8 }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}><User size={16} /></div>
              <div>
                <div style={{ fontWeight: 600 }}>{member.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-light)' }}>{member.email}</div>
              </div>
            </div>
            {member.user?._id !== group.createdBy && <button onClick={() => handleRemoveMember(member._id || member.user?._id)} className="btn btn-danger btn-sm"><X size={14} /></button>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupMembers;
