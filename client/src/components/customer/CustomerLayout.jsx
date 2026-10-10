import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../common/Navbar';
import { Footer } from '../common/Footer';
import { AnnouncementBar } from '../common/AnnouncementBar';
import { InquiryDrawer } from './InquiryDrawer';
import { useSettings } from '../../context/SettingsContext';
import { MessageCircle } from 'lucide-react';

export const CustomerLayout = () => {
  const { generateWhatsAppUrl } = useSettings();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AnnouncementBar />
      <Navbar />
      <main style={{ flexGrow: 1 }}>
        <Outlet />
      </main>
      <Footer />
      <InquiryDrawer />

      {/* Floating WhatsApp Action Button */}
      <a
        href={generateWhatsAppUrl('Hello Shriji Namkeen, I have an inquiry about your products.')}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Order on WhatsApp"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#25D366',
          color: '#FFFFFF',
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 6px 16px rgba(37, 211, 102, 0.4)',
          zIndex: 35,
          cursor: 'pointer',
          transition: 'transform 0.2s ease',
          textDecoration: 'none'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      >
        <MessageCircle size={30} />
      </a>
    </div>
  );
};
