import React, { useState, useEffect } from 'react';
import api from '../../api';
import {
  Search,
  Filter,
  MessageCircle,
  Phone,
  Eye,
  Check,
  Trash2,
  X,
  Clock,
  Calendar,
  Package
} from 'lucide-react';

export const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected Order Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusValue, setStatusValue] = useState('');
  const [notesValue, setNotesValue] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let url = `/orders?status=${statusFilter}&type=${typeFilter}`;
      if (searchTerm.trim()) {
        url += `&search=${encodeURIComponent(searchTerm.trim())}`;
      }
      const res = await api.get(url);
      if (res.data?.orders) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, typeFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  const openOrderModal = (order) => {
    setSelectedOrder(order);
    setStatusValue(order.status);
    setNotesValue(order.internalNotes || '');
  };

  const handleSaveStatus = async () => {
    if (!selectedOrder) return;
    setUpdatingStatus(true);
    try {
      const res = await api.patch(`/orders/${selectedOrder._id}/status`, {
        status: statusValue,
        internalNotes: notesValue
      });
      if (res.data?.order) {
        setSelectedOrder(res.data.order);
        // Update item in local list
        setOrders((prev) =>
          prev.map((o) => (o._id === res.data.order._id ? res.data.order : o))
        );
      }
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDeleteOrder = async (id, orderNum) => {
    if (!window.confirm(`Delete order ${orderNum}? This cannot be undone.`)) return;
    try {
      await api.delete(`/orders/${id}`);
      setSelectedOrder(null);
      fetchOrders();
    } catch (err) {
      alert('Failed to delete order');
    }
  };

  const openWhatsApp = (phone, name, orderNum) => {
    const clean = phone.replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(
      `Hello ${name}, this is SHRIJI NAMKEEN from Sarimeer, Azamgarh regarding your inquiry/order (${orderNum}).`
    );
    window.open(`https://wa.me/${clean}?text=${msg}`, '_blank');
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'badge-danger';
      case 'contacted': return 'badge-orange';
      case 'confirmed': return 'badge-green';
      case 'dispatched': return 'badge-orange';
      case 'delivered': return 'badge-green';
      default: return 'badge-grey';
    }
  };

  return (
    <div>
      {/* Title */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: 'var(--font-size-2xl)' }}>Orders & Wholesale Inquiries</h1>
        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
          Track and manage retail customer orders and wholesale commercial leads.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px 20px',
        marginBottom: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'space-between', alignItems: 'center' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', flex: '1 1 300px', maxWidth: '420px' }}>
            <input
              type="text"
              placeholder="Search by customer name, phone, order no..."
              className="form-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ fontSize: 'var(--font-size-xs)' }}
            />
            <button type="submit" className="btn btn-primary btn-sm">
              <Search size={14} />
              <span>Search</span>
            </button>
          </form>

          {/* Type Filter */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
              Type:
            </span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="form-select"
              style={{ width: 'auto', fontSize: 'var(--font-size-xs)', padding: '5px 10px' }}
            >
              <option value="all">All Types</option>
              <option value="retail_order">Retail Orders</option>
              <option value="wholesale_inquiry">Wholesale Inquiries</option>
              <option value="custom_inquiry">Custom Inquiries</option>
            </select>
          </div>
        </div>

        {/* Status Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {['all', 'pending', 'contacted', 'confirmed', 'dispatched', 'delivered', 'cancelled'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              style={{
                border: `1px solid ${statusFilter === st ? 'var(--color-primary)' : 'var(--color-border)'}`,
                backgroundColor: statusFilter === st ? 'var(--color-primary)' : '#FFFFFF',
                color: statusFilter === st ? '#FFFFFF' : 'var(--color-text-secondary)',
                fontSize: '11px',
                fontWeight: 600,
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                textTransform: 'capitalize',
                cursor: 'pointer'
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="card">
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            Loading inquiries...
          </div>
        ) : orders.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            No orders found matching the filter criteria.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order No.</th>
                  <th>Date & Time</th>
                  <th>Customer / Store</th>
                  <th>Contact</th>
                  <th>Type</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => {
                  const dateStr = new Date(o.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  });
                  return (
                    <tr key={o._id}>
                      <td style={{ fontWeight: 700, fontSize: 'var(--font-size-xs)' }}>
                        {o.orderNumber}
                      </td>
                      <td style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                        {dateStr}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{o.customerName}</div>
                        {o.businessName && (
                          <div style={{ fontSize: '11px', color: 'var(--color-secondary)' }}>
                            {o.businessName}
                          </div>
                        )}
                      </td>
                      <td>
                        <div style={{ fontSize: 'var(--font-size-xs)' }}>{o.phoneNumber}</div>
                        {o.deliveryAddress?.city && (
                          <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>
                            {o.deliveryAddress.city}
                          </div>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${o.orderType === 'wholesale_inquiry' ? 'badge-green' : 'badge-orange'}`} style={{ fontSize: '10px' }}>
                          {o.orderType === 'wholesale_inquiry' ? 'Wholesale' : 'Retail'}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700 }}>
                        {o.totalAmount > 0 ? `₹${o.totalAmount}` : 'Custom'}
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(o.status)}`} style={{ textTransform: 'capitalize', fontSize: '10px' }}>
                          {o.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => openWhatsApp(o.phoneNumber, o.customerName, o.orderNumber)}
                            className="btn btn-whatsapp btn-sm"
                            style={{ padding: '4px 8px' }}
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => openOrderModal(o)}
                            className="btn btn-outline btn-sm"
                            style={{ padding: '4px 8px' }}
                            title="View Details"
                          >
                            <Eye size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-xl)',
            width: '100%',
            maxWidth: '640px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'var(--shadow-lg)',
            overflow: 'hidden'
          }}>
            {/* Header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'var(--color-bg-secondary)'
            }}>
              <div>
                <h3 style={{ fontSize: 'var(--font-size-md)' }}>
                  Inquiry: {selectedOrder.orderNumber}
                </h3>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: '20px', overflowY: 'auto', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Customer Box */}
              <div style={{
                backgroundColor: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '14px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '12px'
              }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'block' }}>Customer Name</span>
                  <strong>{selectedOrder.customerName}</strong>
                  {selectedOrder.businessName && (
                    <div style={{ fontSize: '11px', color: 'var(--color-secondary)' }}>
                      Business: {selectedOrder.businessName}
                    </div>
                  )}
                </div>

                <div>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'block' }}>Phone & WhatsApp</span>
                  <a href={`tel:${selectedOrder.phoneNumber}`} style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                    {selectedOrder.phoneNumber}
                  </a>
                </div>

                {selectedOrder.email && (
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'block' }}>Email</span>
                    <span>{selectedOrder.email}</span>
                  </div>
                )}

                <div>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'block' }}>Delivery Location</span>
                  <span>
                    {[
                      selectedOrder.deliveryAddress?.addressLine,
                      selectedOrder.deliveryAddress?.city,
                      selectedOrder.deliveryAddress?.state,
                      selectedOrder.deliveryAddress?.pincode
                    ].filter(Boolean).join(', ') || 'Not specified'}
                  </span>
                </div>
              </div>

              {/* Items List */}
              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div>
                  <h4 style={{ fontSize: 'var(--font-size-sm)', marginBottom: '8px' }}>
                    Ordered Products ({selectedOrder.items.length})
                  </h4>
                  <div style={{ border: '1px solid var(--color-border-light)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                    {selectedOrder.items.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          borderBottom: idx < selectedOrder.items.length - 1 ? '1px solid var(--color-border-light)' : 'none',
                          fontSize: 'var(--font-size-xs)'
                        }}
                      >
                        <div>
                          <strong>{item.productName}</strong>
                          <span style={{ color: 'var(--color-text-muted)', marginLeft: '6px' }}>({item.weight})</span>
                        </div>
                        <div>
                          {item.quantity} × ₹{item.unitPrice} = <strong>₹{item.subtotal}</strong>
                        </div>
                      </div>
                    ))}
                    <div style={{
                      padding: '10px 14px',
                      backgroundColor: 'var(--color-bg-secondary)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontWeight: 800,
                      fontSize: 'var(--font-size-sm)'
                    }}>
                      <span>Total Amount:</span>
                      <span style={{ color: 'var(--color-primary)' }}>₹{selectedOrder.totalAmount}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Customer Notes */}
              {selectedOrder.customerNotes && (
                <div style={{
                  backgroundColor: '#FFFBEB',
                  border: '1px solid #FDE68A',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-size-xs)'
                }}>
                  <strong style={{ color: '#92400E', display: 'block', marginBottom: '2px' }}>
                    Customer Instructions / Message:
                  </strong>
                  <p style={{ color: '#78350F', margin: 0 }}>{selectedOrder.customerNotes}</p>
                </div>
              )}

              {/* Status & Internal Notes Form */}
              <div style={{
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '16px'
              }}>
                <h4 style={{ fontSize: 'var(--font-size-sm)', marginBottom: '12px' }}>
                  Update Processing Status
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Order Status</label>
                    <select
                      className="form-select"
                      value={statusValue}
                      onChange={(e) => setStatusValue(e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="contacted">Contacted Customer</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="dispatched">Dispatched</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={() => openWhatsApp(selectedOrder.phoneNumber, selectedOrder.customerName, selectedOrder.orderNumber)}
                      className="btn btn-whatsapp"
                      style={{ width: '100%' }}
                    >
                      <MessageCircle size={16} />
                      <span>Chat on WhatsApp</span>
                    </button>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Staff Internal Notes (Private)</label>
                  <textarea
                    rows="2"
                    placeholder="e.g. Spoke with client, wholesale quote of 50kg given at ₹220/kg"
                    className="form-textarea"
                    value={notesValue}
                    onChange={(e) => setNotesValue(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '14px 20px',
              borderTop: '1px solid var(--color-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'var(--color-bg-secondary)'
            }}>
              <button
                type="button"
                onClick={() => handleDeleteOrder(selectedOrder._id, selectedOrder.orderNumber)}
                className="btn btn-outline btn-sm"
                style={{ color: 'var(--color-danger)' }}
              >
                <Trash2 size={14} />
                <span>Delete Order</span>
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="btn btn-outline btn-sm"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleSaveStatus}
                  disabled={updatingStatus}
                  className="btn btn-primary btn-sm"
                >
                  <Check size={14} />
                  <span>{updatingStatus ? 'Saving...' : 'Save Updates'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
