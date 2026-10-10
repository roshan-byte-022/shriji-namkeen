import React, { useState } from 'react';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { Shield, KeyRound, Check, AlertCircle, RefreshCw } from 'lucide-react';

export const AdminSecurityPage = () => {
  const { admin, updateAdminState } = useAuth();

  const [name, setName] = useState(admin?.name || '');
  const [email, setEmail] = useState(admin?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (newPassword && newPassword !== confirmPassword) {
      setErrorMsg('New password and confirmation do not match.');
      return;
    }

    if (newPassword && newPassword.length < 8) {
      setErrorMsg('New password must be at least 8 characters long.');
      return;
    }

    setIsSaving(true);

    try {
      const payload = { name, email };
      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const res = await api.put('/auth/profile', payload);
      if (res.data?.success) {
        setSuccessMsg('Administrator profile and credentials updated successfully.');
        if (res.data.admin) {
          updateAdminState(res.data.admin);
        }
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update credentials.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '640px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: 'var(--font-size-2xl)' }}>Account Security & Credentials</h1>
        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
          Update administrator name, email login, or reset your secure password.
        </p>
      </div>

      {successMsg && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'var(--color-success-bg)',
          color: 'var(--color-success)',
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          fontSize: 'var(--font-size-sm)',
          marginBottom: '20px'
        }}>
          <Check size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'var(--color-danger-bg)',
          color: 'var(--color-danger)',
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          fontSize: 'var(--font-size-sm)',
          marginBottom: '20px'
        }}>
          <AlertCircle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: 'var(--font-size-md)', marginBottom: '16px' }}>
            Profile Details
          </h3>

          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label className="form-label">Administrator Full Name</label>
            <input
              type="text"
              required
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Email Address (Login Username)</label>
            <input
              type="email"
              required
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: 'var(--font-size-md)', marginBottom: '8px' }}>
            Change Password
          </h3>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
            Leave blank if you do not wish to change your password.
          </p>

          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label className="form-label">Current Password</label>
            <input
              type="password"
              placeholder="••••••••••••"
              className="form-input"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label className="form-label">New Password (Min. 8 characters)</label>
            <input
              type="password"
              placeholder="••••••••••••"
              className="form-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Confirm New Password</label>
            <input
              type="password"
              placeholder="••••••••••••"
              className="form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isSaving}
            className="btn btn-primary btn-lg"
          >
            {isSaving ? <RefreshCw size={18} className="spin" /> : <Shield size={18} />}
            <span>{isSaving ? 'Updating...' : 'Save Profile & Password'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
