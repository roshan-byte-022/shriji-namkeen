import React, { useState, useEffect, useRef } from 'react';
import api from '../../api';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Star,
  Check,
  X,
  Upload,
  Image as ImageIcon,
  AlertCircle
} from 'lucide-react';

export const AdminProductsPage = () => {
  const fileInputRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState('all');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');

  // Form State
  const initialForm = {
    name: '',
    category: '',
    shortDescription: '',
    fullDescription: '',
    images: ['/assets/placeholders/sample-product.svg'],
    packagingOptions: [
      { weight: '200g', price: 60, discountPrice: 55, stock: 100, isDefault: true },
      { weight: '400g', price: 110, discountPrice: 100, stock: 80, isDefault: false },
      { weight: '1kg', price: 260, discountPrice: 240, stock: 40, isDefault: false }
    ],
    wholesaleInfo: {
      minOrderQty: '5 kg',
      wholesalePrice: 'Contact for quote',
      packagingType: '5kg Sealed Polybag / 20kg Master Carton'
    },
    ingredientsText: 'Gram Flour (Besan), Edible Vegetable Oil, Salt, Spices',
    shelfLife: '4 Months from manufacturing',
    spiceLevel: 'Medium',
    isFeatured: false,
    isAvailable: true
  };

  const [formData, setFormData] = useState(initialForm);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchProductsAndCategories = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get('/products?adminView=true'),
        api.get('/categories?all=true')
      ]);
      if (prodRes.data?.products) setProducts(prodRes.data.products);
      if (catRes.data?.categories) setCategories(catRes.data.categories);
    } catch (err) {
      console.error('Failed to load data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndCategories();
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setEditProductId(null);
    setFormData({
      ...initialForm,
      category: categories[0]?._id || ''
    });
    setModalError('');
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setIsEditing(true);
    setEditProductId(product._id);
    setFormData({
      name: product.name || '',
      category: product.category?._id || product.category || '',
      shortDescription: product.shortDescription || '',
      fullDescription: product.fullDescription || '',
      images: product.images?.length > 0 ? product.images : ['/assets/placeholders/sample-product.svg'],
      packagingOptions: product.packagingOptions || initialForm.packagingOptions,
      wholesaleInfo: product.wholesaleInfo || initialForm.wholesaleInfo,
      ingredientsText: (product.ingredients || []).join(', '),
      shelfLife: product.shelfLife || '4 Months from manufacturing',
      spiceLevel: product.dietaryInfo?.spiceLevel || 'Medium',
      isFeatured: !!product.isFeatured,
      isAvailable: product.isAvailable !== undefined ? product.isAvailable : true
    });
    setModalError('');
    setModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Immediately read file as Data URL for instant guaranteed visual preview
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const previewUrl = uploadEvent.target.result;
      setFormData((prev) => {
        const clean = prev.images.filter((img) => !img.includes('sample-product.svg'));
        return {
          ...prev,
          images: clean.length === 0 ? [previewUrl] : [...clean, previewUrl]
        };
      });
    };
    reader.readAsDataURL(file);

    // 2. Upload file to backend server
    const data = new FormData();
    data.append('image', file);
    setUploadingImage(true);

    try {
      // Modern Axios automatically sets multipart/form-data with boundary when Content-Type is undefined
      const res = await api.post('/upload', data);
      if (res.data && res.data.url) {
        // Upgrade temporary Data URL to persistent server upload path
        setFormData((prev) => {
          const clean = prev.images.filter(
            (img) => !img.includes('sample-product.svg') && !img.startsWith('data:image')
          );
          return {
            ...prev,
            images: [...clean, res.data.url]
          };
        });
      }
    } catch (err) {
      console.warn('Backend image upload notice:', err.response?.data?.message || err.message);
      // Local preview is safely kept in state so the image is not lost even if offline
    } finally {
      setUploadingImage(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleSelectExistingPhoto = (photoUrl) => {
    setFormData((prev) => {
      const clean = prev.images.filter((img) => !img.includes('sample-product.svg'));
      if (clean.includes(photoUrl)) return prev;
      return {
        ...prev,
        images: [...clean, photoUrl]
      };
    });
  };

  const removeImage = (indexToRemove) => {
    setFormData((prev) => {
      const updated = prev.images.filter((_, idx) => idx !== indexToRemove);
      return {
        ...prev,
        images: updated.length > 0 ? updated : ['/assets/placeholders/sample-product.svg']
      };
    });
  };

  const handlePackChange = (index, field, value) => {
    const updated = [...formData.packagingOptions];
    updated[index][field] = field === 'price' || field === 'discountPrice' || field === 'stock' ? Number(value) : value;
    setFormData({ ...formData, packagingOptions: updated });
  };

  const setDefaultPack = (index) => {
    const updated = formData.packagingOptions.map((pack, idx) => ({
      ...pack,
      isDefault: idx === index
    }));
    setFormData({ ...formData, packagingOptions: updated });
  };

  const addPackRow = () => {
    setFormData({
      ...formData,
      packagingOptions: [
        ...formData.packagingOptions,
        { weight: '500g', price: 120, discountPrice: null, stock: 50, isDefault: false }
      ]
    });
  };

  const removePackRow = (index) => {
    if (formData.packagingOptions.length <= 1) {
      alert('At least one packaging size is required.');
      return;
    }
    const updated = formData.packagingOptions.filter((_, idx) => idx !== index);
    if (!updated.some((p) => p.isDefault)) {
      updated[0].isDefault = true;
    }
    setFormData({ ...formData, packagingOptions: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.shortDescription) {
      setModalError('Product Name, Category, and Short Description are required.');
      return;
    }

    setIsSubmitting(true);
    setModalError('');

    try {
      const payload = {
        name: formData.name,
        category: formData.category,
        shortDescription: formData.shortDescription,
        fullDescription: formData.fullDescription,
        images: formData.images,
        packagingOptions: formData.packagingOptions,
        wholesaleInfo: formData.wholesaleInfo,
        ingredients: formData.ingredientsText
          .split(',')
          .map((i) => i.trim())
          .filter(Boolean),
        shelfLife: formData.shelfLife,
        dietaryInfo: {
          isVegetarian: true,
          spiceLevel: formData.spiceLevel
        },
        isFeatured: formData.isFeatured,
        isAvailable: formData.isAvailable
      };

      if (isEditing) {
        await api.put(`/products/${editProductId}`, payload);
      } else {
        await api.post('/products', payload);
      }

      setModalOpen(false);
      fetchProductsAndCategories();
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to save product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFeature = async (id) => {
    try {
      await api.patch(`/products/${id}/feature`);
      fetchProductsAndCategories();
    } catch (err) {
      alert('Failed to update featured status');
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }
    try {
      await api.delete(`/products/${id}`);
      fetchProductsAndCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete product.');
    }
  };

  const filteredProducts = products.filter((prod) => {
    const matchesCat =
      selectedCatFilter === 'all' ||
      prod.category?.slug === selectedCatFilter ||
      prod.category?._id === selectedCatFilter;
    const matchesSearch =
      !searchTerm.trim() ||
      prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div>
      {/* Title & Actions */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)' }}>Namkeen Products</h1>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            Manage product catalog, packaging sizes, authentic photos, and pricing.
          </p>
        </div>

        <button onClick={openAddModal} className="btn btn-primary btn-sm">
          <Plus size={16} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '14px 18px',
        marginBottom: '20px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: '380px' }}>
          <Search size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search products..."
            className="form-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '34px', fontSize: 'var(--font-size-xs)' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
            Category:
          </label>
          <select
            value={selectedCatFilter}
            onChange={(e) => setSelectedCatFilter(e.target.value)}
            className="form-select"
            style={{ width: 'auto', fontSize: 'var(--font-size-xs)', padding: '5px 10px' }}
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Table */}
      <div className="card">
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
            Loading catalogue...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            No products match the selected criteria.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>Image</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Pack Sizes & Rates</th>
                  <th>Wholesale Minimum</th>
                  <th>Featured</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => {
                  const img = p.images?.[0] || '/assets/placeholders/sample-product.svg';
                  return (
                    <tr key={p._id}>
                      <td>
                        <img
                          src={img}
                          alt={p.name}
                          onError={(e) => { e.currentTarget.src = '/assets/placeholders/sample-product.svg'; }}
                          style={{
                            width: '44px',
                            height: '44px',
                            objectFit: 'contain',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: 'var(--color-bg-secondary)',
                            padding: '2px'
                          }}
                        />
                      </td>
                      <td>
                        <div style={{ fontWeight: 700 }}>{p.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                          Slug: /{p.slug}
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-grey">{p.category?.name || 'Unassigned'}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '11px' }}>
                          {p.packagingOptions?.map((pack, idx) => (
                            <span key={idx}>
                              <strong>{pack.weight}:</strong> ₹{pack.discountPrice || pack.price} {pack.isDefault ? '(Default)' : ''}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td style={{ fontSize: 'var(--font-size-xs)' }}>
                        {p.wholesaleInfo?.minOrderQty || '5 kg'}
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => toggleFeature(p._id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: p.isFeatured ? '#E8631A' : '#D1D5DB'
                          }}
                          title="Toggle Featured"
                        >
                          <Star size={18} fill={p.isFeatured ? '#E8631A' : 'none'} />
                        </button>
                      </td>
                      <td>
                        <span className={`badge ${p.isAvailable ? 'badge-green' : 'badge-danger'}`}>
                          {p.isAvailable ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => openEditModal(p)}
                            className="btn btn-outline btn-sm"
                            style={{ padding: '5px' }}
                            title="Edit Product"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(p._id, p.name)}
                            className="btn btn-outline btn-sm"
                            style={{ padding: '5px', color: 'var(--color-danger)' }}
                            title="Delete Product"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-xl)',
            width: '100%',
            maxWidth: '720px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'var(--shadow-lg)',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '16px 24px',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'var(--color-bg-secondary)'
            }}>
              <h3 style={{ fontSize: 'var(--font-size-md)' }}>
                {isEditing ? 'Edit Namkeen Product' : 'Add New Namkeen Product'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', overflowY: 'auto', flexGrow: 1 }}>
              {modalError && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'var(--color-danger-bg)',
                  color: 'var(--color-danger)',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-size-xs)',
                  marginBottom: '16px'
                }}>
                  <AlertCircle size={16} />
                  <span>{modalError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} id="product-form" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Product Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Navratan Royal Dry Fruit Mixture"
                      className="form-input"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Category *</label>
                    <select
                      className="form-select"
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="">Select Category</option>
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Short Description (Summary) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Crispy blend of roasted lentils, cashews, and spices..."
                    className="form-input"
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Full Description (Preparation Story)</label>
                  <textarea
                    rows="3"
                    placeholder="Handcrafted in Sarimeer using traditional whole spices..."
                    className="form-textarea"
                    value={formData.fullDescription}
                    onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  />
                </div>

                {/* Images Manager */}
                <div style={{
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  backgroundColor: 'var(--color-bg-secondary)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <label style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                        Product Images
                      </label>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                        Upload custom photo or select from existing authentic products
                      </div>
                    </div>

                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/jpg"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        style={{ display: 'none' }}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="btn btn-primary btn-sm"
                        style={{ cursor: 'pointer' }}
                      >
                        <Upload size={14} />
                        <span>{uploadingImage ? 'Uploading...' : 'Choose Image File'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Existing Photos Quick Selector */}
                  <div style={{ marginBottom: '14px', backgroundColor: '#FFFFFF', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-light)' }}>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>
                      Or quick-select from authentic Shriji photos:
                    </span>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {[
                        { name: 'Navratan Mix', url: '/assets/products/navratan-mixture.jpg' },
                        { name: 'Kurkure Sticks', url: '/assets/products/masala-kurkure.jpg' },
                        { name: 'Khatta Meetha', url: '/assets/products/khatta-meetha.jpg' },
                        { name: 'Soan Papdi', url: '/assets/products/soan-papdi.jpg' }
                      ].map((item, idx) => {
                        const isChosen = formData.images.includes(item.url);
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSelectExistingPhoto(item.url)}
                            className="btn btn-outline btn-sm"
                            style={{
                              padding: '3px 8px',
                              fontSize: '11px',
                              backgroundColor: isChosen ? 'var(--color-primary-light)' : '#FFFFFF',
                              borderColor: isChosen ? 'var(--color-primary)' : 'var(--color-border)',
                              color: isChosen ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                              fontWeight: isChosen ? 700 : 500
                            }}
                          >
                            {isChosen ? '✓ ' : '+ '}
                            {item.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Selected Images List */}
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {formData.images.map((imgUrl, idx) => {
                      const isPlaceholder = imgUrl.includes('sample-product.svg');
                      return (
                        <div
                          key={idx}
                          style={{
                            position: 'relative',
                            width: '90px',
                            height: '90px',
                            border: `2px solid ${isPlaceholder ? 'var(--color-border)' : 'var(--color-primary)'}`,
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: '#FFFFFF',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden'
                          }}
                        >
                          <img
                            src={imgUrl}
                            alt="preview"
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                          />
                          {!isPlaceholder && idx === 0 && (
                            <span style={{
                              position: 'absolute',
                              bottom: '0',
                              left: '0',
                              right: '0',
                              backgroundColor: 'var(--color-primary)',
                              color: '#FFFFFF',
                              fontSize: '9px',
                              fontWeight: 700,
                              textAlign: 'center',
                              padding: '1px 0'
                            }}>
                              Primary
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            style={{
                              position: 'absolute',
                              top: '2px',
                              right: '2px',
                              backgroundColor: 'rgba(220, 38, 38, 0.9)',
                              color: '#FFFFFF',
                              border: 'none',
                              borderRadius: '50%',
                              width: '18px',
                              height: '18px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: 'var(--shadow-sm)'
                            }}
                            title="Remove image"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '8px' }}>
                    JPG, PNG, or WEBP. The first image is the primary photo shown on product cards and details.
                  </div>
                </div>

                {/* Packaging Sizes & Prices */}
                <div style={{
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <label style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                      Packaging Sizes & Retail Pricing
                    </label>
                    <button
                      type="button"
                      onClick={addPackRow}
                      className="btn btn-outline btn-sm"
                    >
                      <Plus size={14} />
                      <span>Add Pack Size</span>
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {formData.packagingOptions.map((pack, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1.2fr 1fr 1fr 1fr 0.8fr 40px',
                          gap: '8px',
                          alignItems: 'center'
                        }}
                      >
                        <input
                          type="text"
                          placeholder="Weight (e.g. 200g)"
                          className="form-input"
                          style={{ padding: '6px 8px', fontSize: '12px' }}
                          value={pack.weight}
                          onChange={(e) => handlePackChange(idx, 'weight', e.target.value)}
                        />
                        <input
                          type="number"
                          placeholder="Price (₹)"
                          className="form-input"
                          style={{ padding: '6px 8px', fontSize: '12px' }}
                          value={pack.price}
                          onChange={(e) => handlePackChange(idx, 'price', e.target.value)}
                        />
                        <input
                          type="number"
                          placeholder="Discount ₹ (Opt)"
                          className="form-input"
                          style={{ padding: '6px 8px', fontSize: '12px' }}
                          value={pack.discountPrice || ''}
                          onChange={(e) => handlePackChange(idx, 'discountPrice', e.target.value)}
                        />
                        <input
                          type="number"
                          placeholder="Stock Qty"
                          className="form-input"
                          style={{ padding: '6px 8px', fontSize: '12px' }}
                          value={pack.stock}
                          onChange={(e) => handlePackChange(idx, 'stock', e.target.value)}
                        />
                        <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', cursor: 'pointer' }}>
                          <input
                            type="radio"
                            name="defaultPack"
                            checked={pack.isDefault}
                            onChange={() => setDefaultPack(idx)}
                          />
                          <span>Default</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => removePackRow(idx)}
                          style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}
                          title="Remove row"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Wholesale Specifications */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Wholesale Min Order</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.wholesaleInfo.minOrderQty}
                      onChange={(e) => setFormData({
                        ...formData,
                        wholesaleInfo: { ...formData.wholesaleInfo, minOrderQty: e.target.value }
                      })}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Wholesale Rate Note</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.wholesaleInfo.wholesalePrice}
                      onChange={(e) => setFormData({
                        ...formData,
                        wholesaleInfo: { ...formData.wholesaleInfo, wholesalePrice: e.target.value }
                      })}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Bulk Packaging Type</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.wholesaleInfo.packagingType}
                      onChange={(e) => setFormData({
                        ...formData,
                        wholesaleInfo: { ...formData.wholesaleInfo, packagingType: e.target.value }
                      })}
                    />
                  </div>
                </div>

                {/* Ingredients & Specs */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Ingredients (Comma separated)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Gram Flour, Peanuts, Cashews, Spices"
                    value={formData.ingredientsText}
                    onChange={(e) => setFormData({ ...formData, ingredientsText: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Spice Level</label>
                    <select
                      className="form-select"
                      value={formData.spiceLevel}
                      onChange={(e) => setFormData({ ...formData, spiceLevel: e.target.value })}
                    >
                      <option value="Mild">Mild</option>
                      <option value="Medium">Medium</option>
                      <option value="Spicy">Spicy</option>
                      <option value="Sweet & Savory">Sweet & Savory</option>
                      <option value="Sweet">Sweet</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Shelf Life</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.shelfLife}
                      onChange={(e) => setFormData({ ...formData, shelfLife: e.target.value })}
                    />
                  </div>
                </div>

                {/* Toggles */}
                <div style={{ display: 'flex', gap: '24px', alignItems: 'center', paddingTop: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: 'var(--font-size-sm)' }}>
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    />
                    <span>Mark as Featured / Bestseller</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: 'var(--font-size-sm)' }}>
                    <input
                      type="checkbox"
                      checked={formData.isAvailable}
                      onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                    />
                    <span>Available in Stock</span>
                  </label>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid var(--color-border)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
              backgroundColor: 'var(--color-bg-secondary)'
            }}>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="btn btn-outline btn-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="product-form"
                disabled={isSubmitting}
                className="btn btn-primary btn-sm"
              >
                {isSubmitting ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
