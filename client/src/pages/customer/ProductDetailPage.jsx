import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api';
import { useInquiryCart } from '../../context/InquiryCartContext';
import { useSettings } from '../../context/SettingsContext';
import {
  ArrowLeft,
  MessageCircle,
  Plus,
  Minus,
  Check,
  ShieldCheck,
  Package,
  Calendar,
  Sparkles
} from 'lucide-react';

export const ProductDetailPage = () => {
  const { slug } = useParams();
  const { addToCart } = useInquiryCart();
  const { settings, generateWhatsAppUrl } = useSettings();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedPack, setSelectedPack] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/${slug}`);
        if (res.data && res.data.product) {
          setProduct(res.data.product);
          const defaultOpt =
            res.data.product.packagingOptions?.find((p) => p.isDefault) ||
            res.data.product.packagingOptions?.[0] ||
            null;
          setSelectedPack(defaultOpt);
        }
      } catch (err) {
        setError('Product not found or unavailable.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-secondary)' }}>Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2>Product Not Found</h2>
        <p style={{ margin: '16px 0 24px 0', color: 'var(--color-text-secondary)' }}>
          {error || 'The requested namkeen item does not exist.'}
        </p>
        <Link to="/products" className="btn btn-primary">
          Back to Catalogue
        </Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : ['/assets/placeholders/sample-product.svg'];
  const activeImage = images[activeImageIndex] || images[0];
  const unitPrice = selectedPack?.discountPrice || selectedPack?.price || 0;
  const originalPrice = selectedPack?.discountPrice ? selectedPack.price : null;
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    if (!selectedPack) return;
    addToCart(product, selectedPack, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const getWhatsAppMessage = () => {
    return `Hello Shriji Namkeen, I want to order:
• Product: ${product.name}
• Pack Size: ${selectedPack?.weight || 'Standard'}
• Quantity: ${quantity}
• Total: ₹${totalPrice}
Please advise delivery time and payment details.`;
  };

  return (
    <div style={{ backgroundColor: 'var(--color-bg-primary)', padding: '36px 0 64px 0' }}>
      <div className="container">
        {/* Back Link */}
        <Link
          to="/products"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-secondary)',
            marginBottom: '24px'
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to All Products</span>
        </Link>

        {/* Main Details Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px',
          alignItems: 'start'
        }}>
          {/* Left Column: Image Gallery */}
          <div>
            <div style={{
              backgroundColor: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              aspectRatio: '1/1',
              overflow: 'hidden',
              marginBottom: '12px'
            }}>
              <img
                src={activeImage}
                alt={product.name}
                onError={(e) => { e.currentTarget.src = '/assets/placeholders/sample-product.svg'; }}
                style={{
                  maxHeight: '100%',
                  maxWidth: '100%',
                  objectFit: 'contain'
                }}
              />
            </div>

            {/* Thumbnail selector (if multiple images) */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    style={{
                      border: `2px solid ${activeImageIndex === idx ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-bg-secondary)',
                      padding: '4px',
                      width: '64px',
                      height: '64px',
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                  >
                    <img
                      src={imgUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      onError={(e) => { e.currentTarget.src = '/assets/placeholders/sample-product.svg'; }}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Information & Actions */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div className="veg-indicator" title="100% Pure Vegetarian" />
              <span className="badge badge-orange">{product.category?.name || 'Namkeen'}</span>
              {product.dietaryInfo?.spiceLevel && (
                <span className="badge badge-grey">Spice: {product.dietaryInfo.spiceLevel}</span>
              )}
            </div>

            <h1 style={{
              fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
              color: 'var(--color-text-primary)',
              marginBottom: '12px',
              fontFamily: 'var(--font-family-display)'
            }}>
              {product.name}
            </h1>

            <p style={{
              fontSize: 'var(--font-size-base)',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.6,
              marginBottom: '24px'
            }}>
              {product.shortDescription}
            </p>

            {/* Packaging Selector */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                marginBottom: '8px'
              }}>
                Choose Packaging Size:
              </label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {product.packagingOptions?.map((pack, idx) => {
                  const isSelected = selectedPack?.weight === pack.weight;
                  const price = pack.discountPrice || pack.price;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedPack(pack)}
                      style={{
                        border: `1.5px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                        backgroundColor: isSelected ? 'var(--color-primary-light)' : '#FFFFFF',
                        borderRadius: 'var(--radius-md)',
                        padding: '8px 14px',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <div style={{
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: 700,
                        color: isSelected ? 'var(--color-primary)' : 'var(--color-text-primary)'
                      }}>
                        {pack.weight}
                      </div>
                      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                        ₹{price}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price and Quantity */}
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '12px',
              marginBottom: '24px',
              paddingBottom: '20px',
              borderBottom: '1px solid var(--color-border-light)'
            }}>
              <span style={{
                fontFamily: 'var(--font-family-display)',
                fontSize: '2rem',
                fontWeight: 800,
                color: 'var(--color-primary)'
              }}>
                ₹{totalPrice}
              </span>
              {originalPrice && (
                <span style={{
                  fontSize: 'var(--font-size-base)',
                  color: 'var(--color-text-muted)',
                  textDecoration: 'line-through'
                }}>
                  ₹{originalPrice * quantity}
                </span>
              )}
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                ({selectedPack?.weight} × {quantity})
              </span>

              {/* Quantity Stepper */}
              <div style={{
                marginLeft: 'auto',
                display: 'inline-flex',
                alignItems: 'center',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#FFFFFF'
              }}>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ border: 'none', background: 'none', padding: '6px 12px', cursor: 'pointer' }}
                >
                  <Minus size={14} />
                </button>
                <span style={{ minWidth: '28px', textAlign: 'center', fontWeight: 700, fontSize: 'var(--font-size-sm)' }}>
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ border: 'none', background: 'none', padding: '6px 12px', cursor: 'pointer' }}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '32px' }}>
              <button
                type="button"
                onClick={handleAdd}
                className={`btn btn-lg ${addedAnimation ? 'btn-secondary' : 'btn-outline'}`}
                style={{ width: '100%' }}
              >
                {addedAnimation ? <Check size={18} /> : <Plus size={18} />}
                <span>{addedAnimation ? 'Added to Bag!' : 'Add to Order Bag'}</span>
              </button>

              <a
                href={generateWhatsAppUrl(getWhatsAppMessage())}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp btn-lg"
                style={{ width: '100%', textDecoration: 'none' }}
              >
                <MessageCircle size={18} />
                <span>Order on WhatsApp</span>
              </a>
            </div>

            {/* Wholesale Box */}
            {product.wholesaleInfo && (
              <div style={{
                backgroundColor: 'var(--color-secondary-light)',
                border: '1px solid var(--color-secondary-border)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                marginBottom: '28px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <Package size={16} color="var(--color-secondary)" />
                  <strong style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-secondary)' }}>
                    Bulk / Wholesale Information
                  </strong>
                </div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                  <div>• Min Order Quantity: <strong>{product.wholesaleInfo.minOrderQty}</strong></div>
                  <div>• Wholesale Rate: <strong>{product.wholesaleInfo.wholesalePrice}</strong></div>
                  <div>• Bulk Packing: <strong>{product.wholesaleInfo.packagingType}</strong></div>
                  {product.wholesaleInfo.notes && <div>• {product.wholesaleInfo.notes}</div>}
                </div>
              </div>
            )}

            {/* Ingredients and Shelf Life */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: 'var(--font-size-sm)' }}>
              {product.ingredients?.length > 0 && (
                <div>
                  <strong style={{ color: 'var(--color-text-primary)' }}>Key Ingredients:</strong>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                    {product.ingredients.map((ing, i) => (
                      <span key={i} className="badge badge-grey" style={{ fontSize: '11px' }}>
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {product.shelfLife && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={16} color="var(--color-primary)" />
                  <span>Shelf Life: <strong>{product.shelfLife}</strong></span>
                </div>
              )}

              {product.storageInstructions && (
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                  Storage: {product.storageInstructions}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Description */}
        {product.fullDescription && (
          <div style={{
            marginTop: '56px',
            paddingTop: '36px',
            borderTop: '1px solid var(--color-border)'
          }}>
            <h3 style={{ fontSize: 'var(--font-size-xl)', marginBottom: '16px' }}>
              Product Story & Preparation
            </h3>
            <p style={{
              fontSize: 'var(--font-size-base)',
              lineHeight: 1.8,
              color: 'var(--color-text-secondary)',
              maxWidth: '800px'
            }}>
              {product.fullDescription}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
