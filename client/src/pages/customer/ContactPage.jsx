import React, { useState } from 'react';
import api from '../../api';
import { useSettings } from '../../context/SettingsContext';
import {
  MapPin,
  Phone,
  MessageCircle,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Navigation
} from 'lucide-react';

export const ContactPage = () => {
  const { settings, generateWhatsAppUrl } = useSettings();

  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.phoneNumber) {
      setErrorMsg('Please enter your name and phone number.');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const payload = {
        customerName: formData.customerName,
        phoneNumber: formData.phoneNumber,
        whatsappNumber: formData.phoneNumber,
        email: formData.email,
        orderType: 'custom_inquiry',
        customerNotes: `[Contact Form Message]: ${formData.message}`,
        source: 'website_form'
      };

      const res = await api.post('/orders', payload);
      if (res.data && res.data.success) {
        setSuccess(true);
        setFormData({ customerName: '', phoneNumber: '', email: '', message: '' });
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to send message. Please WhatsApp us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--color-bg-primary)', padding: '40px 0 72px 0' }}>
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <span className="section-tag">Get in Touch</span>
          <h1 className="section-title">Contact SHRIJI NAMKEEN</h1>
          <p className="section-subtitle">
            Visit our retail counter in Sarimeer or get in touch for retail orders, wholesale quotations, and distribution inquiries.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px',
          alignItems: 'start'
        }}>
          {/* Contact Details Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card" style={{ padding: '32px' }}>
              <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '20px', color: 'var(--color-text-primary)' }}>
                Manufacturing & Store Address
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{
                    backgroundColor: 'var(--color-primary-light)',
                    padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-primary)'
                  }}>
                    <MapPin size={22} />
                  </div>
                  <div>
                    <strong style={{ fontSize: 'var(--font-size-sm)', display: 'block', color: 'var(--color-text-primary)' }}>
                      Store & Kitchen Location
                    </strong>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                      {settings.address}
                    </p>
                    <div style={{ marginTop: '8px' }}>
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(settings.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: 'var(--color-primary)',
                          fontSize: 'var(--font-size-xs)',
                          fontWeight: 700
                        }}
                      >
                        <Navigation size={14} />
                        <span>Get Directions on Google Maps</span>
                      </a>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <div style={{
                    backgroundColor: 'var(--color-primary-light)',
                    padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-primary)'
                  }}>
                    <Phone size={22} />
                  </div>
                  <div>
                    <strong style={{ fontSize: 'var(--font-size-sm)', display: 'block' }}>Direct Calling</strong>
                    <a href={`tel:${settings.phoneNumber}`} style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-primary)', fontWeight: 700 }}>
                      {settings.phoneNumber}
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <div style={{
                    backgroundColor: '#EEF7F2',
                    padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    color: '#25D366'
                  }}>
                    <MessageCircle size={22} />
                  </div>
                  <div>
                    <strong style={{ fontSize: 'var(--font-size-sm)', display: 'block' }}>WhatsApp Orders Desk</strong>
                    <a
                      href={generateWhatsAppUrl('Hello Shriji Namkeen, I have an inquiry.')}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: 'var(--font-size-sm)', color: '#25D366', fontWeight: 700 }}
                    >
                      {settings.whatsappNumber}
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <div style={{
                    backgroundColor: 'var(--color-secondary-light)',
                    padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-secondary)'
                  }}>
                    <Clock size={22} />
                  </div>
                  <div>
                    <strong style={{ fontSize: 'var(--font-size-sm)', display: 'block' }}>Opening Hours</strong>
                    <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                      {settings.businessHours}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Map Placeholder Card */}
            <div className="card" style={{ padding: '24px', backgroundColor: 'var(--color-bg-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <MapPin size={18} color="var(--color-primary)" />
                <h4 style={{ fontSize: 'var(--font-size-sm)' }}>How to Reach Us</h4>
              </div>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                Located right near the landmark <strong>Police Booth in Sarimeer</strong>, Azamgarh. Easy parking available for tempo, pickup, and retail customer vehicles.
              </p>
            </div>
          </div>

          {/* Quick Message Form */}
          <div className="card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '8px' }}>
              Send Us a Quick Message
            </h3>
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
              Have questions about flavours, custom bulk packaging, or wedding orders? Drop us a note below.
            </p>

            {success ? (
              <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                <CheckCircle2 size={48} color="var(--color-secondary)" style={{ margin: '0 auto 14px auto' }} />
                <h4 style={{ fontSize: 'var(--font-size-md)', marginBottom: '6px' }}>
                  Message Sent Successfully!
                </h4>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
                  Our team has received your message and will reach out to your phone number shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="btn btn-primary btn-sm"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {errorMsg && (
                  <div style={{
                    backgroundColor: 'var(--color-danger-bg)',
                    color: 'var(--color-danger)',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--font-size-xs)'
                  }}>
                    {errorMsg}
                  </div>
                )}

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter full name"
                    className="form-input"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Phone / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 9876543210"
                    className="form-input"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Email Address (Optional)</label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    className="form-input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Your Message or Inquiry</label>
                  <textarea
                    rows="4"
                    required
                    placeholder="Ask about flavours, shelf life, or event orders..."
                    className="form-textarea"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', marginTop: '6px' }}
                >
                  <Send size={18} />
                  <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
