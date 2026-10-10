import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import { useSettings } from '../../context/SettingsContext';
import {
  Package,
  ShoppingBag,
  Layers,
  TrendingUp,
  MessageCircle,
  Plus,
  ArrowRight,
  Clock,
  PhoneCall,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const { settings } = useSettings();
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    wholesaleInquiries: 0,
    totalRevenue: 0,
    recentOrders: []
  });
  const [productCount, setProductCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, productsRes, categoriesRes] = await Promise.all([
          api.get('/orders/stats/summary'),
          api.get('/products?adminView=true'),
          api.get('/categories?all=true')
        ]);

        if (statsRes.data?.stats) {
          setStats(statsRes.data.stats);
        }
        if (productsRes.data?.products) {
          setProductCount(productsRes.data.products.length);
        }
        if (categoriesRes.data?.categories) {
          setCategoryCount(categoriesRes.data.categories.length);
        }
      } catch (err) {
        console.error('Error fetching dashboard statistics', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const openCustomerWhatsApp = (phone, name, orderNum) => {
    const clean = phone.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(`Hello ${name}, regarding your order/inquiry (${orderNum}) with Shriji Namkeen.`);
    window.open(`https://wa.me/${clean}?text=${text}`, '_blank');
  };

  return (
    <div>
      {/* Page Title */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)' }}>Business Dashboard</h1>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            Real-time overview of products, customer orders, and wholesale inquiries.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/admin/products" className="btn btn-primary btn-sm">
            <Plus size={16} />
            <span>Add New Product</span>
          </Link>
          <Link to="/admin/settings" className="btn btn-outline btn-sm">
            <span>Edit Store Settings</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        {/* Products Count */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
              Active Products
            </span>
            <div style={{ backgroundColor: 'var(--color-primary-light)', padding: '8px', borderRadius: 'var(--radius-md)', color: 'var(--color-primary)' }}>
              <Package size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
            {productCount}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            Across {categoryCount} categories
          </div>
        </div>

        {/* Pending Inquiries */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
              Pending Inquiries
            </span>
            <div style={{ backgroundColor: '#FEF3C7', padding: '8px', borderRadius: 'var(--radius-md)', color: '#D97706' }}>
              <Clock size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: stats.pendingOrders > 0 ? 'var(--color-primary)' : 'var(--color-text-primary)' }}>
            {stats.pendingOrders}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            Needs call or confirmation
          </div>
        </div>

        {/* Wholesale Inquiries */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
              Wholesale Requests
            </span>
            <div style={{ backgroundColor: 'var(--color-secondary-light)', padding: '8px', borderRadius: 'var(--radius-md)', color: 'var(--color-secondary)' }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-secondary)' }}>
            {stats.wholesaleInquiries}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            Bulk & store inquiries
          </div>
        </div>

        {/* Total Orders */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
              Total Orders Logged
            </span>
            <div style={{ backgroundColor: '#EEF2FF', padding: '8px', borderRadius: 'var(--radius-md)', color: '#4F46E5' }}>
              <ShoppingBag size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
            {stats.totalOrders}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            All-time customer entries
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: 'var(--font-size-md)' }}>Recent Orders & Wholesale Leads</h2>
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
              Latest submissions received through the website
            </p>
          </div>
          <Link to="/admin/orders" className="btn btn-outline btn-sm">
            <span>View All Inquiries</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {stats.recentOrders && stats.recentOrders.length > 0 ? (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order No.</th>
                  <th>Customer / Store</th>
                  <th>Phone / WhatsApp</th>
                  <th>Type</th>
                  <th>Amount / Items</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => {
                  const isWholesale = order.orderType === 'wholesale_inquiry';
                  const isPending = order.status === 'pending';
                  return (
                    <tr key={order._id}>
                      <td style={{ fontWeight: 700, fontSize: 'var(--font-size-xs)' }}>
                        {order.orderNumber}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{order.customerName}</div>
                        {order.businessName && (
                          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                            {order.businessName}
                          </div>
                        )}
                      </td>
                      <td>
                        <a href={`tel:${order.phoneNumber}`} style={{ fontWeight: 500 }}>
                          {order.phoneNumber}
                        </a>
                      </td>
                      <td>
                        <span className={`badge ${isWholesale ? 'badge-green' : 'badge-orange'}`}>
                          {isWholesale ? 'Wholesale' : 'Retail'}
                        </span>
                      </td>
                      <td>
                        {order.totalAmount > 0 ? (
                          <span style={{ fontWeight: 700 }}>₹{order.totalAmount}</span>
                        ) : (
                          <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}>
                            Bulk Inquiry
                          </span>
                        )}
                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                          {order.items?.length || 0} item(s)
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${isPending ? 'badge-danger' : 'badge-green'}`} style={{ textTransform: 'capitalize' }}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => openCustomerWhatsApp(order.phoneNumber, order.customerName, order.orderNumber)}
                            className="btn btn-whatsapp btn-sm"
                            style={{ padding: '4px 8px' }}
                            title="WhatsApp Customer"
                          >
                            <MessageCircle size={14} />
                            <span>Chat</span>
                          </button>
                          <Link
                            to="/admin/orders"
                            className="btn btn-outline btn-sm"
                            style={{ padding: '4px 8px' }}
                          >
                            Details
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
            No customer orders recorded yet. Submissions from the website will appear here in real-time.
          </div>
        )}
      </div>
    </div>
  );
};
