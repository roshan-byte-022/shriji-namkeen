import React, { useState } from 'react';
import api from '../../api';
import { useSettings } from '../../context/SettingsContext';
import {
  Store,
  Truck,
  PackageCheck,
  Percent,
  MessageCircle,
  Send,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';

export const WholesalePage = () => {
  const { settings, generateWhatsAppUrl } = useSettings();

  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    phoneNumber: '',
    email: '',
    city: 'Sarimeer, Azamgarh',
    state: 'Uttar Pradesh',
    estimatedQuantity: '20kg - 50kg',
    productsOfInterest: 'Assorted Best-Selling Namkeens',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.contactName || !formData.phoneNumber) {
      setErrorMessage('Please provide your name and contact phone number.');
      return;
    }
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const payload = {
        customerName: formData.contactName,
        businessName: formData.businessName,
        phoneNumber: formData.phoneNumber,
        whatsappNumber: formData.phoneNumber,
        email: formData.email,
        orderType: 'wholesale_inquiry',
        deliveryAddress: {
          city: formData.city,
          state: formData.state
        },
        customerNotes: `[Wholesale Requirement]: Est. Qty: ${formData.estimatedQuantity} | Products: ${formData.productsOfInterest} | Notes: ${formData.message}`,
        source: 'website_form'
      };

      const res = await api.post('/orders', payload);
      if (res.data && res.data.success) {
        setSuccessData(res.data.order);
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Unable to submit wholesale inquiry. Please try again or WhatsApp directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWhatsAppWholesaleLink = () => {
    const text = `*WHOLESALE INQUIRY - SHRIJI NAMKEEN*\n\n` +
      `Business: ${formData.businessName || 'Retail / Wholesale'}\n` +
      `Contact Person: ${formData.contactName}\n` +
      `Phone: ${formData.phoneNumber}\n` +
      `Location: ${formData.city}, ${formData.state}\n` +
      `Estimated Qty: ${formData.estimatedQuantity}\n` +
      `Products: ${formData.productsOfInterest}\n` +
      `Message: ${formData.message || 'Please send wholesale price catalog.'}`;
    return generateWhatsAppUrl(text);
  };

  return (
    <div style={{ backgroundColor: 'var(--color-bg-primary)', padding: '40px 0 72px 0' }}>
      <div className="container">
        {/* Page Header */}
        <div className="section-header" style={{ maxWidth: '700px' }}>
          <span className="section-tag">Direct Factory Supply</span>
          <h1 className="section-title">Wholesale & Commercial Distribution</h1>
          <p className="section-subtitle">
            Partner directly with SHRIJI NAMKEEN for factory-rate bulk supplies. Ideal for retail stores, supermarkets, wedding caterers, and regional distributors.
          </p>
        </div>

        {/* Benefits Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginBottom: '48px'
        }}>
          <div className="card" style={{ padding: '24px' }}>
            <Percent size={28} color="var(--color-primary)" style={{ marginBottom: '12px' }} />
            <h4 style={{ fontSize: 'var(--font-size-md)', marginBottom: '8px' }}>High Retail Margins</h4>
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              Direct manufacturing pricing allows your shop to offer competitive prices while enjoying lucrative profit margins.
            </p>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <PackageCheck size={28} color="var(--color-secondary)" style={{ marginBottom: '12px' }} />
            <h4 style={{ fontSize: 'var(--font-size-md)', marginBottom: '8px' }}>Air-Tight Master Cartons</h4>
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              Packaged in 5kg, 10kg, and 20kg heavy 5-ply cartons with moisture-barrier liners ensuring lasting freshness.
            </p>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <Truck size={28} color="var(--color-primary)" style={{ marginBottom: '12px' }} />
            <h4 style={{ fontSize: 'var(--font-size-md)', marginBottom: '8px' }}>Regional Dispatch Support</h4>
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              Convenient transport and bus service delivery across Azamgarh, Mau, Jaunpur, Varanasi, and broader Uttar Pradesh.
            </p>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <Store size={28} color="var(--color-secondary)" style={{ marginBottom: '12px' }} />
            <h4 style={{ fontSize: 'var(--font-size-md)', marginBottom: '8px' }}>Low Minimum Order</h4>
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              {settings.minimumWholesaleOrder || 'Minimum ₹3,000 for wholesale pricing'}. Start small and scale as your demand grows.
            </p>
          </div>
        </div>

        {/* Form and Direct WhatsApp Card */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px',
          alignItems: 'start'
        }}>
          {/* Inquiry Form */}
          <div className="card" style={{ padding: '32px' }}>
            {successData ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <CheckCircle2 size={54} color="var(--color-secondary)" style={{ margin: '0 auto 16px auto' }} />
                <h3 style={{ fontSize: 'var(--font-size-xl)', marginBottom: '10px' }}>
                  Wholesale Inquiry Received!
                </h3>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
                  Thank you, <strong>{successData.customerName}</strong>. Reference: <strong>{successData.orderNumber}</strong>. Our wholesale sales team will review your requirement and call you shortly.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <a
                    href={getWhatsAppWholesaleLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-whatsapp"
                  >
                    <MessageCircle size={18} />
                    <span>Also Send via WhatsApp</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => { setSuccessData(null); }}
                    className="btn btn-outline btn-sm"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '6px' }}>
                  Request Wholesale Quotation
                </h3>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
                  Fill in your store or event requirements below to receive wholesale pricing within hours.
                </p>

                {errorMessage && (
                  <div style={{
                    backgroundColor: 'var(--color-danger-bg)',
                    color: 'var(--color-danger)',
                    padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--font-size-xs)',
                    marginBottom: '16px'
                  }}>
                    {errorMessage}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Business / Shop Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Gupta Sweets & Provision"
                      className="form-input"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Contact Person *</label>
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      className="form-input"
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      placeholder="Mobile Number"
                      className="form-input"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email (Optional)</label>
                    <input
                      type="email"
                      placeholder="business@example.com"
                      className="form-input"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">City / Town *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Azamgarh, Mau, etc."
                      className="form-input"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Estimated Quantity</label>
                    <select
                      className="form-select"
                      value={formData.estimatedQuantity}
                      onChange={(e) => setFormData({ ...formData, estimatedQuantity: e.target.value })}
                    >
                      <option value="10kg - 20kg (Sample Order)">10kg - 20kg (Sample Bulk Order)</option>
                      <option value="20kg - 50kg (Standard Carton)">20kg - 50kg (Standard Carton)</option>
                      <option value="50kg - 100kg (Retail Supply)">50kg - 100kg (Retail Store Supply)</option>
                      <option value="100kg+ (Distributor Consignment)">100kg+ (Distributor Consignment)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Products of Interest</label>
                  <input
                    type="text"
                    placeholder="e.g. Navratan Mixture, Kurkure Sticks, Ratlami Sev, Soan Papdi"
                    className="form-input"
                    value={formData.productsOfInterest}
                    onChange={(e) => setFormData({ ...formData, productsOfInterest: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Additional Requirements / Notes</label>
                  <textarea
                    rows="3"
                    placeholder="Tell us about your business, delivery timeline, or packaging requirements..."
                    className="form-textarea"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-secondary btn-lg"
                  style={{ width: '100%' }}
                >
                  <Send size={18} />
                  <span>{isSubmitting ? 'Submitting Inquiry...' : 'Submit Wholesale Inquiry'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Direct WhatsApp Callout Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{
              backgroundColor: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '28px'
            }}>
              <h3 style={{ fontSize: 'var(--font-size-md)', marginBottom: '8px', color: 'var(--color-text-primary)' }}>
                Need Immediate Wholesale Assistance?
              </h3>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
                Speak directly with our factory sales desk in Sarimeer for instant stock confirmation, custom price negotiations, or sample packets.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <a
                  href={generateWhatsAppUrl('Hello Shriji Namkeen, I am a business buyer looking for direct wholesale supply. Please share your catalog.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp btn-lg"
                  style={{ textDecoration: 'none' }}
                >
                  <MessageCircle size={20} />
                  <span>Chat on WhatsApp ({settings.whatsappNumber})</span>
                </a>

                <a
                  href={`tel:${settings.phoneNumber}`}
                  className="btn btn-outline btn-lg"
                  style={{ textDecoration: 'none' }}
                >
                  <PhoneCall size={20} />
                  <span>Direct Call: {settings.phoneNumber}</span>
                </a>
              </div>
            </div>

            <div style={{
              border: '1px solid var(--color-border-light)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              backgroundColor: '#FFFFFF'
            }}>
              <h4 style={{ fontSize: 'var(--font-size-sm)', marginBottom: '8px' }}>
                Sample Packs for Shopkeepers
              </h4>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                Not sure which namkeens your local customers prefer? Request an assorted 5kg sample pack containing our top 5 bestsellers so you can test customer demand with minimal upfront cost.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
