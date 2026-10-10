import React, { useState } from 'react';
import { useInquiryCart } from '../../context/InquiryCartContext';
import { useSettings } from '../../context/SettingsContext';
import api from '../../api';
import { X, Trash2, Plus, Minus, MessageCircle, Send, CheckCircle2 } from 'lucide-react';

export const InquiryDrawer = () => {
  const {
    cartItems,
    totalItemsCount,
    totalCartAmount,
    updateQuantity,
    removeFromCart,
    clearCart,
    isDrawerOpen,
    setIsDrawerOpen
  } = useInquiryCart();

  const { settings, generateWhatsAppUrl } = useSettings();

  const [checkoutMode, setCheckoutMode] = useState(false); // form view
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);
  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    addressLine: '',
    city: 'Sarimeer, Azamgarh',
    pincode: '',
    customerNotes: ''
  });
  const [errorMsg, setErrorMsg] = useState('');

  if (!isDrawerOpen) return null;

  const handleWhatsAppCheckout = () => {
    let msg = `*NEW ORDER INQUIRY - SHRIJI NAMKEEN*\n\n`;
    cartItems.forEach((item, idx) => {
      msg += `${idx + 1}. *${item.productName}* (${item.weight})\n`;
      msg += `   Qty: ${item.quantity} × ₹${item.unitPrice} = ₹${item.subtotal}\n`;
    });
    msg += `\n*Total Estimated Amount: ₹${totalCartAmount}*\n\n`;
    msg += `Please confirm availability and dispatch details.`;

    const url = generateWhatsAppUrl(msg);
    window.open(url, '_blank');
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.phoneNumber) {
      setErrorMsg('Please enter your full name and phone number.');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const payload = {
        customerName: formData.customerName,
        phoneNumber: formData.phoneNumber,
        whatsappNumber: formData.phoneNumber,
        orderType: 'retail_order',
        items: cartItems,
        deliveryAddress: {
          addressLine: formData.addressLine,
          city: formData.city,
          state: 'Uttar Pradesh',
          pincode: formData.pincode
        },
        customerNotes: formData.customerNotes,
        source: 'website_form'
      };

      const res = await api.post('/orders', payload);
      if (res.data && res.data.success) {
        setSuccessOrder(res.data.order);
        clearCart();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit order. Please try again or use WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsDrawerOpen(false);
    setCheckoutMode(false);
    setSuccessOrder(null);
    setErrorMsg('');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 50,
      display: 'flex',
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0, 0, 0, 0.45)',
      backdropFilter: 'blur(2px)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '460px',
        height: '100%',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-lg)'
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 20px',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--color-bg-secondary)'
        }}>
          <div>
            <h3 style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text-primary)' }}>
              {successOrder ? 'Order Confirmed!' : checkoutMode ? 'Enter Delivery Details' : 'Your Order Bag'}
            </h3>
            {!successOrder && !checkoutMode && (
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                {totalItemsCount} item{totalItemsCount !== 1 ? 's' : ''} selected
              </p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="btn btn-outline btn-sm"
            style={{ padding: '6px', borderRadius: '50%' }}
            aria-label="Close Order Bag"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Area */}
        <div style={{ flexGrow: 1, overflowY: 'auto', padding: '20px' }}>
          {successOrder ? (
            <div style={{ textAlign: 'center', padding: '30px 10px' }}>
              <div style={{ color: 'var(--color-secondary)', display: 'inline-flex', marginBottom: '16px' }}>
                <CheckCircle2 size={54} />
              </div>
              <h4 style={{ fontSize: 'var(--font-size-xl)', marginBottom: '8px' }}>
                Thank You, {successOrder.customerName}!
              </h4>
              <p style={{ fontSize: 'var(--font-size-sm)', marginBottom: '16px' }}>
                Your order has been recorded with Shriji Namkeen. We will contact you at <strong>{successOrder.phoneNumber}</strong> shortly to confirm dispatch.
              </p>
              <div style={{
                backgroundColor: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '14px',
                marginBottom: '24px',
                fontSize: 'var(--font-size-sm)'
              }}>
                <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}>Order Tracking Reference:</div>
                <div style={{ fontWeight: 800, color: 'var(--color-primary)', fontSize: '1.1rem' }}>
                  {successOrder.orderNumber}
                </div>
              </div>
              <button
                onClick={handleClose}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                Continue Browsing
              </button>
            </div>
          ) : cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 10px' }}>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', marginBottom: '20px' }}>
                Your order bag is currently empty.
              </p>
              <button onClick={handleClose} className="btn btn-primary btn-sm">
                Explore Fresh Namkeens
              </button>
            </div>
          ) : checkoutMode ? (
            /* Checkout Form */
            <form onSubmit={handleSubmitOrder} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {errorMsg && (
                <div style={{
                  backgroundColor: 'var(--color-danger-bg)',
                  color: 'var(--color-danger)',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-size-xs)'
                }}>
                  {errorMsg}
                </div>
              )}

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
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
                  placeholder="e.g. 9876543210"
                  className="form-input"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Delivery Address / Street</label>
                <input
                  type="text"
                  placeholder="Shop or House No., Area"
                  className="form-input"
                  value={formData.addressLine}
                  onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Pincode</label>
                  <input
                    type="text"
                    placeholder="276305"
                    className="form-input"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Order Notes / Preferences (Optional)</label>
                <textarea
                  rows="2"
                  placeholder="e.g. Extra spicy, wedding packing, or morning delivery"
                  className="form-textarea"
                  value={formData.customerNotes}
                  onChange={(e) => setFormData({ ...formData, customerNotes: e.target.value })}
                />
              </div>

              <div style={{
                backgroundColor: 'var(--color-bg-secondary)',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                marginTop: '6px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
                  <span>Total Payable:</span>
                  <strong style={{ color: 'var(--color-primary)', fontSize: '1.1rem' }}>
                    ₹{totalCartAmount}
                  </strong>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                  Payment can be done via Cash on Delivery or UPI upon confirmation.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setCheckoutMode(false)}
                  className="btn btn-outline"
                  style={{ flex: 1 }}
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{ flex: 2 }}
                >
                  <Send size={16} />
                  <span>{isSubmitting ? 'Submitting...' : 'Confirm Order'}</span>
                </button>
              </div>
            </form>
          ) : (
            /* Items List */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {cartItems.map((item) => (
                <div
                  key={`${item.productId}-${item.weight}`}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    paddingBottom: '14px',
                    borderBottom: '1px solid var(--color-border-light)'
                  }}
                >
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    onError={(e) => { e.currentTarget.src = '/assets/placeholders/sample-product.svg'; }}
                    style={{
                      width: '64px',
                      height: '64px',
                      objectFit: 'contain',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--color-bg-secondary)',
                      padding: '4px'
                    }}
                  />

                  <div style={{ flexGrow: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>
                      {item.productName}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                      Pack: {item.weight} • ₹{item.unitPrice} each
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                      {/* Quantity Selector */}
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-sm)'
                      }}>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.weight, item.quantity - 1)}
                          style={{ border: 'none', background: 'none', padding: '4px 8px', cursor: 'pointer' }}
                        >
                          <Minus size={12} />
                        </button>
                        <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, minWidth: '20px', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.weight, item.quantity + 1)}
                          style={{ border: 'none', background: 'none', padding: '4px 8px', cursor: 'pointer' }}
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontWeight: 700, fontSize: 'var(--font-size-sm)', color: 'var(--color-primary)' }}>
                          ₹{item.subtotal}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.productId, item.weight)}
                          style={{ border: 'none', background: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
                          title="Remove item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions (Only when items exist and not in success mode) */}
        {!successOrder && cartItems.length > 0 && !checkoutMode && (
          <div style={{
            padding: '18px 20px',
            borderTop: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-bg-secondary)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              marginBottom: '14px'
            }}>
              <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                Total (Excl. Shipping):
              </span>
              <span style={{
                fontSize: '1.4rem',
                fontWeight: 800,
                color: 'var(--color-primary)',
                fontFamily: 'var(--font-family-display)'
              }}>
                ₹{totalCartAmount}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                onClick={handleWhatsAppCheckout}
                className="btn btn-whatsapp"
                style={{ width: '100%' }}
              >
                <MessageCircle size={18} />
                <span>Order Directly on WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => setCheckoutMode(true)}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                <Send size={18} />
                <span>Submit Order Online</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
