import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import { ProductCard } from '../../components/customer/ProductCard';
import { useSettings } from '../../context/SettingsContext';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  ShoppingBag,
  Store,
  MessageCircle,
  Award
} from 'lucide-react';

import { initialProducts } from '../../data/initialData';

export const HomePage = () => {
  const { settings, generateWhatsAppUrl } = useSettings();
  const [featuredProducts, setFeaturedProducts] = useState(() => initialProducts.filter(p => p.isFeatured));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/products?featured=true');
        if (res.data && res.data.products && res.data.products.length > 0) {
          setFeaturedProducts(res.data.products);
        }
      } catch (err) {
        // Fallback to initialProducts already loaded
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        backgroundColor: 'var(--color-bg-secondary)',
        borderBottom: '1px solid var(--color-border)',
        padding: '48px 0 56px 0'
      }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          alignItems: 'center',
          gap: '40px'
        }}>
          {/* Left Column: Headlines & CTAs */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
              <span className="section-tag">Authentic Taste of Azamgarh</span>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                • Sarimeer, U.P.
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              color: 'var(--color-text-primary)',
              lineHeight: 1.15,
              marginBottom: '16px',
              fontFamily: 'var(--font-family-display)'
            }}>
              Pure Ingredients. <br />
              <span style={{ color: 'var(--color-primary)' }}>Uncompromising Crunch.</span>
            </h1>

            <p style={{
              fontSize: 'var(--font-size-base)',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.7,
              marginBottom: '28px',
              maxWidth: '520px'
            }}>
              Welcome to <strong>SHRIJI NAMKEEN</strong>. We craft traditional Indian namkeens, spicy crunchy sticks, and celebratory sweets using pure gram flour, natural spices, and hygienic small-batch frying.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <Link to="/products" className="btn btn-primary btn-lg">
                <ShoppingBag size={18} />
                <span>Explore Products</span>
              </Link>
              <Link to="/wholesale" className="btn btn-outline btn-lg">
                <Store size={18} />
                <span>Bulk & Wholesale</span>
              </Link>
            </div>

            {/* Quick Trust Badges */}
            <div style={{
              display: 'flex',
              gap: '20px',
              marginTop: '32px',
              paddingTop: '20px',
              borderTop: '1px solid var(--color-border)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={20} color="var(--color-secondary)" />
                <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600 }}>100% Shuddh Besan</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={20} color="var(--color-primary)" />
                <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600 }}>No Artificial Fillers</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Truck size={20} color="var(--color-secondary)" />
                <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600 }}>Pan-India Supply</span>
              </div>
            </div>
          </div>

          {/* Right Column: Authentic Visual Hero Card with Original Logo & Image collage */}
          <div style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center'
          }}>
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              padding: '24px',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--color-border)',
              maxWidth: '440px',
              width: '100%',
              textAlign: 'center'
            }}>
              <img
                src="/assets/branding/logo.png"
                alt="SHRIJI NAMKEEN Official Logo"
                style={{
                  height: '140px',
                  width: 'auto',
                  margin: '0 auto 16px auto',
                  objectFit: 'contain'
                }}
              />
              <div style={{
                backgroundColor: 'var(--color-bg-secondary)',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                marginBottom: '16px'
              }}>
                <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  Fresh Batches Made Daily in Sarimeer
                </div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                  Available in 200g, 400g, 1kg pouches & 20kg wholesale cartons
                </div>
              </div>

              <a
                href={generateWhatsAppUrl('Hello Shriji Namkeen, I want to inquire about your product prices and wholesale rates.')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
                style={{ width: '100%' }}
              >
                <MessageCircle size={18} />
                <span>Instant WhatsApp Order (+91 63931 01490)</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Namkeens Section */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Handcrafted Specialities</span>
            <h2 className="section-title">Customer Favourite Namkeens</h2>
            <p className="section-subtitle">
              Prepared with our secret family blend of whole roasted spices and unadulterated edible oils.
            </p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>Loading delicious products...</div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '24px'
            }}>
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to="/products" className="btn btn-outline btn-lg">
              <span>View Full Namkeen Catalogue</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Wholesale & Commercial Highlight Strip */}
      <section style={{
        backgroundColor: 'var(--color-secondary-light)',
        borderTop: '1px solid var(--color-secondary-border)',
        borderBottom: '1px solid var(--color-secondary-border)',
        padding: '48px 0'
      }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px',
          alignItems: 'center'
        }}>
          <div>
            <span style={{
              backgroundColor: 'var(--color-secondary)',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              padding: '2px 8px',
              borderRadius: 'var(--radius-sm)'
            }}>
              Business & Wholesale
            </span>
            <h2 style={{
              fontSize: 'var(--font-size-2xl)',
              color: 'var(--color-secondary)',
              marginTop: '10px',
              marginBottom: '12px'
            }}>
              Are You a Grocery Store, Caterer, or Distributor?
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-base)', lineHeight: 1.6 }}>
              Get direct factory wholesale pricing on master cartons (5kg, 10kg, 20kg & 50kg consignments). We serve retail snack counters, wedding caterers, and supermarkets with reliable door delivery across eastern Uttar Pradesh and neighbouring states.
            </p>
          </div>

          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h4 style={{ fontSize: 'var(--font-size-md)', marginBottom: '8px' }}>
              Wholesale Supply Highlights:
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: 'var(--font-size-sm)', marginBottom: '20px' }}>
              <li>✔ Direct factory pricing without middleman markups</li>
              <li>✔ Air-tight moisture-proof bulk packaging</li>
              <li>✔ High retail margin for shop owners and kirana stores</li>
              <li>✔ Minimum order starting from just ₹3,000</li>
            </ul>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <Link to="/wholesale" className="btn btn-secondary" style={{ flex: 1 }}>
                Send Wholesale Inquiry
              </Link>
              <a
                href={generateWhatsAppUrl('Hello, I am interested in wholesale namkeen supply for my store/event.')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
              >
                <MessageCircle size={16} />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Heritage Snippet */}
      <section className="section-padding">
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '40px',
          alignItems: 'center'
        }}>
          <div>
            <span className="section-tag">Our Heritage</span>
            <h2 className="section-title">Rooted in Tradition, Prepared with Purity</h2>
            <p style={{ marginBottom: '16px', lineHeight: 1.7 }}>
              {settings.aboutStory}
            </p>
            <p style={{ marginBottom: '24px', lineHeight: 1.7 }}>
              Located right near the Police Booth in Sarimeer, Azamgarh, our kitchen upholds rigorous safety guidelines. From handpicked spices to strict oil monitoring, we believe authentic taste comes only from honest preparation.
            </p>
            <Link to="/about" className="btn btn-outline">
              <span>Read Our Full Story</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px'
          }}>
            <div style={{
              backgroundColor: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              textAlign: 'center'
            }}>
              <div style={{
                fontFamily: 'var(--font-family-display)',
                fontSize: '2rem',
                fontWeight: 800,
                color: 'var(--color-primary)'
              }}>
                100%
              </div>
              <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', marginTop: '4px' }}>
                Pure Vegetarian
              </div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                Fresh oils & spices
              </div>
            </div>

            <div style={{
              backgroundColor: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              textAlign: 'center'
            }}>
              <div style={{
                fontFamily: 'var(--font-family-display)',
                fontSize: '2rem',
                fontWeight: 800,
                color: 'var(--color-secondary)'
              }}>
                Daily
              </div>
              <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', marginTop: '4px' }}>
                Fresh Batches
              </div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                Crispness guaranteed
              </div>
            </div>

            <div style={{
              backgroundColor: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              textAlign: 'center'
            }}>
              <div style={{
                fontFamily: 'var(--font-family-display)',
                fontSize: '2rem',
                fontWeight: 800,
                color: 'var(--color-primary)'
              }}>
                Azamgarh
              </div>
              <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', marginTop: '4px' }}>
                Authentic Taste
              </div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                Sarimeer kitchen
              </div>
            </div>

            <div style={{
              backgroundColor: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              textAlign: 'center'
            }}>
              <div style={{
                fontFamily: 'var(--font-family-display)',
                fontSize: '2rem',
                fontWeight: 800,
                color: 'var(--color-secondary)'
              }}>
                ₹3,000
              </div>
              <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', marginTop: '4px' }}>
                Min. Wholesale
              </div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                Low threshold for retailers
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
