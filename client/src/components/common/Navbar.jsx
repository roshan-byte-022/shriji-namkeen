import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import { useInquiryCart } from '../../context/InquiryCartContext';
import {
  ShoppingBag,
  MessageCircle,
  Menu,
  X,
  PhoneCall,
  ShieldCheck
} from 'lucide-react';

export const Navbar = () => {
  const { settings, generateWhatsAppUrl } = useSettings();
  const { totalItemsCount, setIsDrawerOpen } = useInquiryCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products & Namkeens', path: '/products' },
    { name: 'Bulk & Wholesale', path: '/wholesale' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact Store', path: '/contact' }
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 40,
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid var(--color-border-light)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 'var(--header-height)'
      }}>
        {/* Official Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src="/assets/branding/logo.png"
            alt="SHRIJI NAMKEEN Logo"
            style={{
              height: '56px',
              width: 'auto',
              objectFit: 'contain'
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{
              fontFamily: 'var(--font-family-display)',
              fontWeight: 'var(--font-weight-extrabold)',
              fontSize: '1.25rem',
              color: 'var(--color-primary)',
              lineHeight: 1.1,
              letterSpacing: '-0.02em'
            }}>
              SHRIJI NAMKEEN
            </span>
            <span style={{
              fontSize: '0.7rem',
              color: 'var(--color-secondary)',
              fontWeight: 600,
              letterSpacing: '0.04em',
              textTransform: 'uppercase'
            }}>
              Sarimeer • Azamgarh
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '24px' }} className="desktop-nav">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              style={({ isActive }) => ({
                fontSize: 'var(--font-size-sm)',
                fontWeight: isActive ? 'var(--font-weight-bold)' : 'var(--font-weight-medium)',
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                borderBottom: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
                padding: '6px 0',
                transition: 'color var(--transition-fast)'
              })}
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Direct WhatsApp Ordering */}
          <a
            href={generateWhatsAppUrl('Hello Shriji Namkeen, I would like to place an order or inquire about your products.')}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp btn-sm"
            style={{ display: 'none' }}
            id="desktop-whatsapp-btn"
          >
            <MessageCircle size={16} />
            <span>Order on WhatsApp</span>
          </a>

          {/* Cart / Inquiry Drawer Trigger */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="btn btn-outline"
            style={{
              position: 'relative',
              padding: '8px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            aria-label="View Order Inquiry"
          >
            <ShoppingBag size={18} color="var(--color-primary)" />
            <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600 }} className="cart-label">
              Order Bag
            </span>
            {totalItemsCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                backgroundColor: 'var(--color-primary)',
                color: '#FFFFFF',
                fontSize: '11px',
                fontWeight: 700,
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-sm)'
              }}>
                {totalItemsCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn btn-outline mobile-menu-toggle"
            style={{ padding: '8px', display: 'flex' }}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid var(--color-border)',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: 'var(--font-size-base)',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                padding: '8px 0',
                borderBottom: '1px solid var(--color-border-light)'
              }}
            >
              {link.name}
            </Link>
          ))}

          <a
            href={generateWhatsAppUrl('Hello Shriji Namkeen, I would like to inquire about your products.')}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp"
            style={{ width: '100%', marginTop: '8px' }}
          >
            <MessageCircle size={18} />
            <span>Chat on WhatsApp ({settings.whatsappNumber})</span>
          </a>

          <a
            href={`tel:${settings.phoneNumber}`}
            className="btn btn-outline"
            style={{ width: '100%' }}
          >
            <PhoneCall size={18} />
            <span>Call Store: {settings.phoneNumber}</span>
          </a>
        </div>
      )}

      {/* Responsive Inline CSS */}
      <style>{`
        @media (min-width: 900px) {
          .desktop-nav {
            display: flex !important;
          }
          #desktop-whatsapp-btn {
            display: inline-flex !important;
          }
          .mobile-menu-toggle {
            display: none !important;
          }
        }
        @media (max-width: 500px) {
          .cart-label {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};
