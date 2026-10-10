import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const defaultSettings = {
  businessName: 'SHRIJI NAMKEEN',
  tagline: 'Authentic Indian Taste & Fresh Savouries',
  businessType: 'Namkeen manufacturing, retail, and wholesale',
  whatsappNumber: '+91 63931 01490',
  phoneNumber: '+91 63931 01490',
  email: 'contact@shrijinamkeen.com',
  address: 'Near Police Booth, Sarimeer, Azamgarh, Uttar Pradesh 276305, India',
  landmark: 'Near Police Booth',
  city: 'Sarimeer, Azamgarh',
  state: 'Uttar Pradesh',
  pincode: '276305',
  country: 'India',
  currency: '₹',
  businessHours: 'Monday to Sunday: 8:00 AM - 9:00 PM',
  announcementText: 'Welcome to SHRIJI NAMKEEN! Fresh batches made daily. Direct wholesale & retail orders available.',
  isAnnouncementActive: true,
  wholesaleNotice: 'Special wholesale rates for grocery stores, sweet shops, wedding caterers, and bulk distributors.',
  minimumWholesaleOrder: 'Minimum ₹3,000 for wholesale pricing',
  aboutStory: 'SHRIJI NAMKEEN is a premier namkeen and savoury manufacturer based in Sarimeer, Azamgarh (Uttar Pradesh). Rooted in traditional recipes and authentic spices, we take pride in preparing freshly fried and roasted namkeens with 100% pure ingredients, zero adulteration, and top hygienic standards. Serving retail snack lovers and wholesale distributors with unmatched crispness and taste.'
};

const SettingsContext = createContext({
  settings: defaultSettings,
  loading: true,
  refreshSettings: async () => {},
  getCleanWhatsAppNumber: () => '916393101490',
  generateWhatsAppUrl: (msg) => ''
});

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      if (res.data && res.data.settings) {
        setSettings({ ...defaultSettings, ...res.data.settings });
      }
    } catch (err) {
      console.warn('Could not fetch remote settings, using defaults.', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const getCleanWhatsAppNumber = () => {
    const raw = settings.whatsappNumber || '+91 63931 01490';
    return raw.replace(/[^0-9]/g, '');
  };

  const generateWhatsAppUrl = (message) => {
    const cleanNum = getCleanWhatsAppNumber();
    const encoded = encodeURIComponent(message || 'Hello Shriji Namkeen, I would like to inquire about your products.');
    return `https://wa.me/${cleanNum}?text=${encoded}`;
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        refreshSettings: fetchSettings,
        getCleanWhatsAppNumber,
        generateWhatsAppUrl
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
