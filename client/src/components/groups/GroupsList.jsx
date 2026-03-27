import React, { useEffect, useState } from 'react';
import { useGroupStore } from '../../stores/groupStore';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Plus, Users, Trash2, Eye } from 'lucide-react';

const GroupsList = () => {
  const { groups, isLoading, error, getGroups, deleteGroup } = useGroupStore();
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    getGroups();
  }, [getGroups]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleDelete = async (groupId) => {
    try {
      await deleteGroup(groupId);
      toast.success('Group deleted successfully');
      setDeleteConfirm(null);
    } catch (error) {
      toast.error('Failed to delete group');
    }
  };

  // FIX: Safe group filtering and mapping
  const validGroups = Array.isArray(groups) 
    ? groups.filter(group => group && group._id) // Filter out invalid groups
    : [];

  if (isLoading) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
          <p style={{ color: 'var(--text-light)', marginTop: '1rem' }}>Loading groups...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="dashboard-header">
        <div>
          <h1 className="text-3xl font-bold">Groups</h1>
          <p className="text-sm" style={{ color: 'var(--text-light)', marginTop: '0.5rem' }}>
            Manage your expense groups and track shared expenses
          </p>
        </div>
        <Link to="/groups/create" className="btn btn-primary">
          <Plus size={20} />
          Create Group
        </Link>
      </div>

      {validGroups.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Users size={48} style={{ margin: '0 auto 1rem', opacity: 0.5, color: 'var(--primary)' }} />
          <h3 className="text-lg font-semibold mb-2">No groups yet</h3>
          <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>
            Create your first group to start splitting expenses with friends, family, or colleagues!
          </p>
          <Link to="/groups/create" className="btn btn-primary">
            <Plus size={20} />
            Create Your First Group
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {validGroups.map((group) => (
            <div key={group._id} className="card hover-card">

              {/* FIX: Use optional chaining and safe checks */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text)', margin: 0 }}>
                    {group.name || 'Unnamed Group'}
                  </h3>
                  {/* FIX: Safe member check with optional chaining */}
                  {group.members?.find(m => 
                    m?.user?._id === group.createdBy?._id && m?.role === 'admin'
                  ) && (
                    <span style={{
                      background: 'var(--primary)',
                      color: 'white',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      Admin
                    </span>
                  )}
                </div>
                <span style={{
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '500'
                }}>
                  {(group.members?.length || 0)} member{(group.members?.length || 0) !== 1 ? 's' : ''}
                </span>
              </div>
              
              {group.description && (
                <p style={{ color: 'var(--text-light)', marginBottom: '1rem', fontSize: '0.875rem' }}>
                  {group.description}
                </p>
              )}
              
              {/* FIX: Safe createdBy check */}
              <div style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '1.5rem' }}>
                Created by {group.createdBy?.name || 'Unknown User'}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link
                  to={`/groups/${group._id}`}
                  className="btn btn-secondary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <Eye size={16} />
                  View Details
                </Link>
                
                {/* FIX: Safe admin check */}
                {group.members?.find(m => 
                  m?.user?._id === group.createdBy?._id && m?.role === 'admin'
                ) && (
                  <button
                    className="btn btn-danger"
                    onClick={() => setDeleteConfirm(group._id)}
                    style={{ minWidth: 'auto', padding: '0.5rem' }}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ maxWidth: '400px', width: '90%' }}>
            <h3 style={{ marginBottom: '1rem' }}>Confirm Delete</h3>
            <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>
              Are you sure you want to delete this group? This action cannot be undone and will delete all associated expenses.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button
                className="btn btn-secondary"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(deleteConfirm)}
              >
                Delete Group
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupsList;