import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../api';
import { ProductCard } from '../../components/customer/ProductCard';
import { Search, Filter, RefreshCw } from 'lucide-react';

export const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [sortBy, setSortBy] = useState('default');

  // Load categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data && res.data.categories) {
          setCategories(res.data.categories);
        }
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    fetchCats();
  }, []);

  // Load products based on filters
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `/products?category=${selectedCategory}`;
        if (searchTerm.trim()) {
          url += `&search=${encodeURIComponent(searchTerm.trim())}`;
        }
        if (sortBy === 'price-low') url += '&sort=price-low';
        if (sortBy === 'price-high') url += '&sort=price-high';
        if (sortBy === 'name-asc') url += '&sort=name-asc';

        const res = await api.get(url);
        if (res.data && res.data.products) {
          setProducts(res.data.products);
        }
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchTerm, sortBy]);

  const handleCategoryChange = (slug) => {
    setSelectedCategory(slug);
    if (slug === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    setSearchParams(searchParams);
  };

  return (
    <div style={{ backgroundColor: 'var(--color-bg-primary)', minHeight: '80vh', padding: '36px 0 64px 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <span className="section-tag">Fresh Savouries & Sweets</span>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', marginTop: '6px', marginBottom: '8px' }}>
            Product Catalogue
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
            Browse our wide selection of namkeens, crunchy snacks, and sweets. Available for both retail bag ordering and bulk wholesale dispatch.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div style={{
          backgroundColor: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 20px',
          marginBottom: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {/* Search and Sort controls */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            {/* Search Input */}
            <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '420px' }}>
              <Search
                size={18}
                color="var(--color-text-muted)"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                placeholder="Search by namkeen name or ingredient..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '38px', backgroundColor: '#FFFFFF' }}
              />
            </div>

            {/* Sort Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                Sort:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-select"
                style={{ width: 'auto', backgroundColor: '#FFFFFF', padding: '6px 12px' }}
              >
                <option value="default">Default Order</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-asc">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            <button
              onClick={() => handleCategoryChange('all')}
              style={{
                border: `1px solid ${selectedCategory === 'all' ? 'var(--color-primary)' : 'var(--color-border)'}`,
                backgroundColor: selectedCategory === 'all' ? 'var(--color-primary)' : '#FFFFFF',
                color: selectedCategory === 'all' ? '#FFFFFF' : 'var(--color-text-secondary)',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: 'var(--font-size-xs)',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              All Products
            </button>

            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.slug;
              return (
                <button
                  key={cat._id}
                  onClick={() => handleCategoryChange(cat.slug)}
                  style={{
                    border: `1px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    backgroundColor: isSelected ? 'var(--color-primary)' : '#FFFFFF',
                    color: isSelected ? '#FFFFFF' : 'var(--color-text-secondary)',
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: 'var(--font-size-xs)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Grid Area */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <RefreshCw size={28} className="spin" color="var(--color-primary)" style={{ margin: '0 auto 12px auto' }} />
            <p style={{ color: 'var(--color-text-secondary)' }}>Loading namkeen catalogue...</p>
          </div>
        ) : products.length === 0 ? (
          <div style={{
            textAlign: 'center',
            backgroundColor: 'var(--color-bg-secondary)',
            border: '1px dashed var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '48px 20px'
          }}>
            <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '8px' }}>
              No products found
            </h3>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
              We could not find any products matching your current category or search criteria.
            </p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchTerm(''); }}
              className="btn btn-primary btn-sm"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
              Showing {products.length} product{products.length !== 1 ? 's' : ''}
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '24px'
            }}>
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
