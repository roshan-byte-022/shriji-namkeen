import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useSettings } from '../../context/SettingsContext';
import { Save, Check, AlertCircle, RefreshCw } from 'lucide-react';

export const AdminSettingsPage = () => {
  const { settings, refreshSettings } = useSettings();

  const [formData, setFormData] = useState({
    businessName: '',
    tagline: '',
    businessType: '',
    whatsappNumber: '',
    phoneNumber: '',
    email: '',
    address: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    businessHours: '',
    currency: '₹',
    announcementText: '',
    isAnnouncementActive: true,
    wholesaleNotice: '',
    minimumWholesaleOrder: '',
    aboutStory: ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (settings) {
      setFormData({
        businessName: settings.businessName || 'SHRIJI NAMKEEN',
        tagline: settings.tagline || '',
        businessType: settings.businessType || '',
        whatsappNumber: settings.whatsappNumber || '',
        phoneNumber: settings.phoneNumber || '',
        email: settings.email || '',
        address: settings.address || '',
        landmark: settings.landmark || '',
        city: settings.city || '',
        state: settings.state || '',
        pincode: settings.pincode || '',
        businessHours: settings.businessHours || '',
        currency: settings.currency || '₹',
        announcementText: settings.announcementText || '',
        isAnnouncementActive: settings.isAnnouncementActive !== undefined ? settings.isAnnouncementActive : true,
        wholesaleNotice: settings.wholesaleNotice || '',
        minimumWholesaleOrder: settings.minimumWholesaleOrder || '',
        aboutStory: settings.aboutStory || ''
      });
    }
  }, [settings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await api.put('/settings', formData);
      if (res.data?.success) {
        setSuccessMsg('Business settings updated successfully! All website components now display the updated details.');
        await refreshSettings();
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update business settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '840px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: 'var(--font-size-2xl)' }}>Business & Store Settings</h1>
        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
          Configure business name, WhatsApp ordering number, store address, and announcement banner.
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

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Basic Brand Info */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: 'var(--font-size-md)', marginBottom: '16px' }}>
            Brand Information
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Business Name *</label>
              <input
                type="text"
                required
                className="form-input"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Tagline</label>
              <input
                type="text"
                className="form-input"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '14px', marginBottom: 0 }}>
            <label className="form-label">Business Type / Subtitle</label>
            <input
              type="text"
              className="form-input"
              value={formData.businessType}
              onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
            />
          </div>
        </div>

        {/* Contact Numbers & WhatsApp */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: 'var(--font-size-md)', marginBottom: '16px' }}>
            Contact & WhatsApp Details
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">WhatsApp Ordering Number *</label>
              <input
                type="text"
                required
                className="form-input"
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
              />
              <span className="form-help">Include country code (e.g. +91 63931 01490)</span>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Primary Calling Phone</label>
              <input
                type="text"
                required
                className="form-input"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Support Email</label>
              <input
                type="email"
                className="form-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Physical Address */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: 'var(--font-size-md)', marginBottom: '16px' }}>
            Physical Store & Kitchen Address
          </h3>

          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label className="form-label">Full Address *</label>
            <input
              type="text"
              required
              className="form-input"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">City / Town</label>
              <input
                type="text"
                className="form-input"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">State</label>
              <input
                type="text"
                className="form-input"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Pincode</label>
              <input
                type="text"
                className="form-input"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginTop: '14px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Operating Hours</label>
              <input
                type="text"
                className="form-input"
                value={formData.businessHours}
                onChange={(e) => setFormData({ ...formData, businessHours: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Currency Symbol</label>
              <input
                type="text"
                className="form-input"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Announcement Banner */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: 'var(--font-size-md)', margin: 0 }}>
              Top Announcement Banner
            </h3>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--font-size-xs)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.isAnnouncementActive}
                onChange={(e) => setFormData({ ...formData, isAnnouncementActive: e.target.checked })}
              />
              <span style={{ fontWeight: 600 }}>Enable Banner on Public Site</span>
            </label>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <input
              type="text"
              placeholder="e.g. Welcome to Shriji Namkeen! Direct wholesale & retail orders available."
              className="form-input"
              value={formData.announcementText}
              onChange={(e) => setFormData({ ...formData, announcementText: e.target.value })}
            />
          </div>
        </div>

        {/* Wholesale & Story */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: 'var(--font-size-md)', marginBottom: '16px' }}>
            Wholesale Notice & Heritage Story
          </h3>

          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label className="form-label">Minimum Wholesale Order Threshold</label>
            <input
              type="text"
              className="form-input"
              value={formData.minimumWholesaleOrder}
              onChange={(e) => setFormData({ ...formData, minimumWholesaleOrder: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">About Us Story (Displayed on About page and Homepage)</label>
            <textarea
              rows="4"
              className="form-textarea"
              value={formData.aboutStory}
              onChange={(e) => setFormData({ ...formData, aboutStory: e.target.value })}
            />
          </div>
        </div>

        {/* Submit */}
        <div>
          <button
            type="submit"
            disabled={isSaving}
            className="btn btn-primary btn-lg"
          >
            {isSaving ? <RefreshCw size={18} className="spin" /> : <Save size={18} />}
            <span>{isSaving ? 'Saving Changes...' : 'Save Business Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
