import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import {
  ShieldCheck,
  Award,
  Sparkles,
  MapPin,
  HeartHandshake,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const AboutPage = () => {
  const { settings, generateWhatsAppUrl } = useSettings();

  return (
    <div style={{ backgroundColor: 'var(--color-bg-primary)', padding: '40px 0 72px 0' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Header */}
        <div className="section-header">
          <span className="section-tag">Authentic Sarimeer Heritage</span>
          <h1 className="section-title">About SHRIJI NAMKEEN</h1>
          <p className="section-subtitle">
            Crafting pure, crisp, and unforgettable Indian savouries for tea tables and festive celebrations since our founding in Azamgarh.
          </p>
        </div>

        {/* Brand Story Banner */}
        <div style={{
          backgroundColor: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '36px',
          marginBottom: '48px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '32px',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ fontSize: 'var(--font-size-xl)', marginBottom: '14px', color: 'var(--color-primary)' }}>
              Our Story & Dedication to Purity
            </h2>
            <p style={{ fontSize: 'var(--font-size-base)', lineHeight: 1.8, color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
              {settings.aboutStory}
            </p>
            <p style={{ fontSize: 'var(--font-size-base)', lineHeight: 1.8, color: 'var(--color-text-secondary)' }}>
              In an era where market snacks are often loaded with artificial flavor enhancers, recycled frying oils, and cheap starch fillers, <strong>SHRIJI NAMKEEN</strong> was established to stand firmly for honest, pure, and wholesome Indian snacking.
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              display: 'inline-block',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--color-border-light)'
            }}>
              <img
                src="/assets/branding/logo.png"
                alt="SHRIJI NAMKEEN Emblem"
                style={{ height: '120px', width: 'auto', margin: '0 auto 12px auto' }}
              />
              <div style={{ fontWeight: 800, color: 'var(--color-primary)', fontSize: 'var(--font-size-base)' }}>
                100% Pure Shuddh Namkeen
              </div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                Sarimeer, Azamgarh (U.P.)
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars of Quality */}
        <div style={{ marginBottom: '56px' }}>
          <h2 style={{ fontSize: 'var(--font-size-xl)', textAlign: 'center', marginBottom: '32px' }}>
            The 4 Pillars of the Shriji Standard
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '24px'
          }}>
            <div className="card" style={{ padding: '24px' }}>
              <div style={{
                backgroundColor: 'var(--color-primary-light)',
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-primary)',
                marginBottom: '16px'
              }}>
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: 'var(--font-size-base)', marginBottom: '8px' }}>100% Pure Gram Flour</h3>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                We use high-grade chana dal besan without mixing maida or synthetic thickeners, ensuring authentic crispy texture and rich natural aroma.
              </p>
            </div>

            <div className="card" style={{ padding: '24px' }}>
              <div style={{
                backgroundColor: 'var(--color-secondary-light)',
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-secondary)',
                marginBottom: '16px'
              }}>
                <Award size={24} />
              </div>
              <h3 style={{ fontSize: 'var(--font-size-base)', marginBottom: '8px' }}>Authentic Ground Spices</h3>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                Whole black pepper, cloves, ajwain, hing, and amchur roasted and ground in-house to retain essential oils and distinctive flavors.
              </p>
            </div>

            <div className="card" style={{ padding: '24px' }}>
              <div style={{
                backgroundColor: 'var(--color-primary-light)',
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-primary)',
                marginBottom: '16px'
              }}>
                <Clock size={24} />
              </div>
              <h3 style={{ fontSize: 'var(--font-size-base)', marginBottom: '8px' }}>Daily Small-Batch Frying</h3>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                Rather than storing giant old inventories, we fry in controlled small batches daily so customers receive the freshest crunch possible.
              </p>
            </div>

            <div className="card" style={{ padding: '24px' }}>
              <div style={{
                backgroundColor: 'var(--color-secondary-light)',
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-secondary)',
                marginBottom: '16px'
              }}>
                <CheckCircle2 size={24} />
              </div>
              <h3 style={{ fontSize: 'var(--font-size-base)', marginBottom: '8px' }}>Airtight Hygienic Packing</h3>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                Every pouch and wholesale carton is heat-sealed in food-grade multilayer packaging to lock out moisture and maintain shelf life.
              </p>
            </div>
          </div>
        </div>

        {/* Location & Visit Callout */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '32px',
          textAlign: 'center'
        }}>
          <MapPin size={32} color="var(--color-primary)" style={{ margin: '0 auto 12px auto' }} />
          <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '8px' }}>
            Visit Our Store & Manufacturing Facility
          </h3>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', maxWidth: '520px', margin: '0 auto 20px auto' }}>
            Located conveniently {settings.address}. We welcome retail snack lovers and wholesale buyers to visit our counter and taste our fresh batches.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn btn-outline">
              View Store Location
            </Link>
            <Link to="/products" className="btn btn-primary">
              Order Fresh Namkeens
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
