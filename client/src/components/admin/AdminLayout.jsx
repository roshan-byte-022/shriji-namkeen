import React, { useState } from 'react';
import { NavLink, Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Settings,
  Shield,
  LogOut,
  ExternalLink,
  Menu,
  X
} from 'lucide-react';

export const AdminLayout = () => {
  const { admin, isAuthenticated, loading, logout } = useAuth();
  const { settings } = useSettings();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--color-text-secondary)' }}>Verifying administrator session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Products Management', path: '/admin/products', icon: Package },
    { name: 'Categories', path: '/admin/categories', icon: Layers },
    { name: 'Orders & Inquiries', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Business Settings', path: '/admin/settings', icon: Settings },
    { name: 'Security & Profile', path: '/admin/security', icon: Shield }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8F9FA' }}>
      {/* Sidebar Overlay on mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 40
          }}
        />
      )}

      {/* Admin Sidebar */}
      <aside style={{
        width: '260px',
        backgroundColor: '#FFFFFF',
        borderRight: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 50,
        transform: sidebarOpen ? 'translateX(0)' : undefined,
        transition: 'transform 0.25s ease'
      }} className="admin-sidebar">
        {/* Brand Header */}
        <div style={{
          padding: '20px 20px',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <img
            src="/assets/branding/logo.png"
            alt="SHRIJI NAMKEEN Logo"
            style={{ height: '44px', width: 'auto', objectFit: 'contain' }}
          />
          <div>
            <div style={{
              fontFamily: 'var(--font-family-display)',
              fontWeight: 800,
              fontSize: '1.05rem',
              color: 'var(--color-primary)'
            }}>
              {settings.businessName}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-secondary)', fontWeight: 600 }}>
              Admin Panel
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{ padding: '16px 12px', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                onClick={() => setSidebarOpen(false)}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: isActive ? 700 : 500,
                  backgroundColor: isActive ? 'var(--color-primary-light)' : 'transparent',
                  color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                  borderLeft: isActive ? '3px solid var(--color-primary)' : '3px solid transparent',
                  transition: 'all 0.15s ease'
                })}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom User Area */}
        <div style={{
          padding: '16px',
          borderTop: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-bg-secondary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div>
              <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                {admin?.name || 'Administrator'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                {admin?.email}
              </div>
            </div>
            <button
              onClick={logout}
              title="Log out"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-danger)',
                padding: '6px'
              }}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', marginLeft: '260px' }} className="admin-content-wrapper">
        {/* Top Bar */}
        <header style={{
          height: '64px',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          position: 'sticky',
          top: 0,
          zIndex: 30
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="btn btn-outline btn-sm mobile-sidebar-toggle"
              style={{ padding: '6px' }}
              aria-label="Toggle sidebar"
            >
              <Menu size={18} />
            </button>
            <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
              Business Management Portal
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <span>View Customer Site</span>
              <ExternalLink size={14} />
            </Link>

            <button
              onClick={logout}
              className="btn btn-outline btn-sm"
              style={{ color: 'var(--color-danger)' }}
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Nested Page View */}
        <main style={{ padding: '28px 28px 60px 28px', flexGrow: 1 }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .admin-sidebar {
            transform: translateX(-100%);
          }
          .admin-content-wrapper {
            margin-left: 0 !important;
          }
        }
        @media (min-width: 901px) {
          .mobile-sidebar-toggle {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
