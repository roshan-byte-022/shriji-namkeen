import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import { Phone, MapPin } from 'lucide-react';

export const AnnouncementBar = () => {
  const { settings } = useSettings();

  if (!settings.isAnnouncementActive) return null;

  return (
    <div style={{
      backgroundColor: 'var(--color-secondary)',
      color: '#FFFFFF',
      fontSize: 'var(--font-size-xs)',
      padding: '6px 0',
      borderBottom: '1px solid rgba(255,255,255,0.1)'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{
            backgroundColor: 'var(--color-primary)',
            color: '#FFFFFF',
            fontWeight: 'var(--font-weight-bold)',
            padding: '1px 6px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '10px',
            textTransform: 'uppercase'
          }}>
            Notice
          </span>
          <span style={{ fontWeight: 'var(--font-weight-medium)' }}>
            {settings.announcementText}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#E2E8F0' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={12} />
            <span>{settings.city || 'Sarimeer, Azamgarh'}</span>
          </span>
          <a
            href={`tel:${settings.phoneNumber}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#FFFFFF', fontWeight: 600 }}
          >
            <Phone size={12} />
            <span>{settings.phoneNumber}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
