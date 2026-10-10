import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import { MapPin, Phone, MessageCircle, Mail, Clock, Lock, CheckCircle2 } from 'lucide-react';

export const Footer = () => {
  const { settings, generateWhatsAppUrl } = useSettings();

  return (
    <footer style={{
      backgroundColor: 'var(--color-bg-secondary)',
      borderTop: '1px solid var(--color-border)',
      marginTop: 'auto'
    }}>
      {/* Purity Guarantee Ribbon */}
      <div style={{
        borderBottom: '1px solid var(--color-border-light)',
        padding: '24px 0',
        backgroundColor: '#FFFFFF'
      }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              backgroundColor: 'var(--color-primary-light)',
              padding: '10px',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-primary)'
            }}>
              <CheckCircle2 size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 'var(--font-size-sm)' }}>100% Pure Ingredients</div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Authentic gram flour & pure edible oils</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              backgroundColor: 'var(--color-secondary-light)',
              padding: '10px',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-secondary)'
            }}>
              <Clock size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 'var(--font-size-sm)' }}>Fresh Daily Batches</div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Made daily in Sarimeer for ultimate crunch</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              backgroundColor: 'var(--color-primary-light)',
              padding: '10px',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-primary)'
            }}>
              <MessageCircle size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 'var(--font-size-sm)' }}>Wholesale & Bulk Supply</div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Direct factory rates across UP & India</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container" style={{ padding: '48px 16px 36px 16px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '36px'
        }}>
          {/* Brand Info & Logo */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <img
                src="/assets/branding/logo.png"
                alt="SHRIJI NAMKEEN"
                style={{ height: '60px', width: 'auto', objectFit: 'contain' }}
              />
              <div>
                <div style={{
                  fontFamily: 'var(--font-family-display)',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  color: 'var(--color-primary)',
                  letterSpacing: '-0.02em'
                }}>
                  {settings.businessName}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', fontWeight: 600 }}>
                  Sarimeer • Azamgarh (U.P.)
                </div>
              </div>
            </div>
            <p style={{ fontSize: 'var(--font-size-sm)', lineHeight: 1.6, marginBottom: '16px' }}>
              Manufacturing, wholesale, and retail of premium Indian namkeens and festive sweets. Freshly prepared with traditional recipes and zero compromise on hygiene.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <a
                href={generateWhatsAppUrl('Hello Shriji Namkeen, I would like to place an order or inquire about wholesale.')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp btn-sm"
              >
                <MessageCircle size={14} />
                <span>WhatsApp: {settings.whatsappNumber}</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: 'var(--font-size-base)', marginBottom: '16px', color: 'var(--color-text-primary)' }}>
              Quick Navigation
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: 'var(--font-size-sm)' }}>
              <li>
                <Link to="/" style={{ color: 'var(--color-text-secondary)', transition: 'color 0.2s' }}>
                  Home Page
                </Link>
              </li>
              <li>
                <Link to="/products" style={{ color: 'var(--color-text-secondary)' }}>
                  All Namkeens & Catalogue
                </Link>
              </li>
              <li>
                <Link to="/wholesale" style={{ color: 'var(--color-text-secondary)' }}>
                  Wholesale & Bulk Cartons
                </Link>
              </li>
              <li>
                <Link to="/about" style={{ color: 'var(--color-text-secondary)' }}>
                  About Our Heritage & Kitchen
                </Link>
              </li>
              <li>
                <Link to="/contact" style={{ color: 'var(--color-text-secondary)' }}>
                  Store Location & Directions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Location Details */}
          <div>
            <h4 style={{ fontSize: 'var(--font-size-base)', marginBottom: '16px', color: 'var(--color-text-primary)' }}>
              Factory & Retail Counter
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: 'var(--font-size-sm)' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <MapPin size={18} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{settings.address}</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Phone size={18} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                <a href={`tel:${settings.phoneNumber}`} style={{ fontWeight: 600 }}>
                  {settings.phoneNumber}
                </a>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Clock size={18} color="var(--color-secondary)" style={{ flexShrink: 0 }} />
                <span>{settings.businessHours}</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Mail size={18} color="var(--color-text-muted)" style={{ flexShrink: 0 }} />
                <span>{settings.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Admin Link */}
        <div style={{
          marginTop: '36px',
          paddingTop: '20px',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          fontSize: 'var(--font-size-xs)',
          color: 'var(--color-text-muted)'
        }}>
          <div>
            © {new Date().getFullYear()} <strong>{settings.businessName}</strong>. All rights reserved. Made in Sarimeer, Azamgarh.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span>Pure Indian Vegetarian (100% शाकाहारी)</span>
            <Link
              to="/admin/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                color: 'var(--color-text-muted)',
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(0,0,0,0.03)'
              }}
            >
              <Lock size={12} />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
