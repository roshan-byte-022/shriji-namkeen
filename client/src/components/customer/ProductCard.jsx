import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Plus, Check } from 'lucide-react';
import { useInquiryCart } from '../../context/InquiryCartContext';
import { useSettings } from '../../context/SettingsContext';

export const ProductCard = ({ product }) => {
  const { addToCart } = useInquiryCart();
  const { generateWhatsAppUrl, settings } = useSettings();

  const options = product.packagingOptions || [];
  const defaultOption = options.find((p) => p.isDefault) || options[0] || { weight: 'Standard', price: product.basePrice || 0 };
  const [selectedPack, setSelectedPack] = useState(defaultOption);
  const [addedAnimation, setAddedAnimation] = useState(false);

  useEffect(() => {
    const opts = product.packagingOptions || [];
    const def = opts.find((p) => p.isDefault) || opts[0] || { weight: 'Standard', price: product.basePrice || 0 };
    setSelectedPack(def);
  }, [product]);

  const mainImage = product.images?.[0] || '/assets/placeholders/sample-product.svg';
  const currentPrice = selectedPack?.discountPrice || selectedPack?.price || product.basePrice || 0;
  const originalPrice = selectedPack?.discountPrice ? selectedPack.price : null;

  const handleAddToCart = () => {
    if (selectedPack) {
      addToCart(product, selectedPack, 1);
      setAddedAnimation(true);
      setTimeout(() => setAddedAnimation(false), 1200);
    }
  };

  const getWhatsAppMessage = () => {
    return `Hello Shriji Namkeen! I would like to order:
• ${product.name}
• Pack Size: ${selectedPack?.weight || 'Standard'}
• Price: ₹${currentPrice}
Please share availability and delivery options.`;
  };

  return (
    <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Product Image Container */}
      <div style={{
        position: 'relative',
        backgroundColor: 'var(--color-bg-secondary)',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        aspectRatio: '4/3',
        overflow: 'hidden'
      }}>
        <Link to={`/products/${product.slug}`} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src={mainImage}
            alt={product.name}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = '/assets/placeholders/sample-product.svg';
            }}
            style={{
              maxHeight: '100%',
              maxWidth: '100%',
              objectFit: 'contain',
              transition: 'transform 0.3s ease'
            }}
          />
        </Link>

        {/* Top Badges */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          display: 'flex',
          gap: '6px',
          flexWrap: 'wrap'
        }}>
          {product.isFeatured && (
            <span className="badge badge-orange" style={{ fontWeight: 700, fontSize: '10px' }}>
              Bestseller
            </span>
          )}
          {product.category?.name && (
            <span className="badge badge-grey" style={{ fontSize: '10px' }}>
              {product.category.name}
            </span>
          )}
        </div>

        {/* Veg icon */}
        <div style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: '#FFFFFF', padding: '3px', borderRadius: '4px', boxShadow: 'var(--shadow-sm)' }}>
          <div className="veg-indicator" title="100% Vegetarian" />
        </div>
      </div>

      {/* Product Body */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
          <Link to={`/products/${product.slug}`}>
            <h3 style={{
              fontSize: '1.05rem',
              color: 'var(--color-text-primary)',
              fontWeight: 700,
              lineHeight: 1.3
            }}>
              {product.name}
            </h3>
          </Link>
        </div>

        <p style={{
          fontSize: 'var(--font-size-xs)',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.5,
          marginBottom: '14px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {product.shortDescription}
        </p>

        {/* Packaging Selector */}
        {options.length > 1 && (
          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: '6px' }}>
              Pack Size:
            </label>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {options.map((opt, i) => {
                const isSelected = selectedPack.weight === opt.weight;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedPack(opt)}
                    style={{
                      border: `1px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      backgroundColor: isSelected ? 'var(--color-primary-light)' : '#FFFFFF',
                      color: isSelected ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                      fontSize: '11px',
                      fontWeight: isSelected ? 700 : 500,
                      padding: '4px 8px',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer'
                    }}
                  >
                    {opt.weight}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Pricing Area */}
        <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid var(--color-border-light)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
            <span style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              color: 'var(--color-primary)',
              fontFamily: 'var(--font-family-display)'
            }}>
              {settings.currency || '₹'}{currentPrice}
            </span>
            {originalPrice && (
              <span style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-text-muted)',
                textDecoration: 'line-through'
              }}>
                ₹{originalPrice}
              </span>
            )}
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginLeft: 'auto' }}>
              ({selectedPack.weight})
            </span>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              onClick={handleAddToCart}
              className={`btn btn-sm ${addedAnimation ? 'btn-secondary' : 'btn-outline'}`}
              style={{ width: '100%' }}
            >
              {addedAnimation ? <Check size={14} /> : <Plus size={14} />}
              <span>{addedAnimation ? 'Added!' : 'Add to Bag'}</span>
            </button>

            <a
              href={generateWhatsAppUrl(getWhatsAppMessage())}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp btn-sm"
              style={{ width: '100%', textDecoration: 'none' }}
              title="Order on WhatsApp"
            >
              <MessageCircle size={14} />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
