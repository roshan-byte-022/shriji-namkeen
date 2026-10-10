import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Plus, Edit, Trash2, Layers, AlertCircle, X } from 'lucide-react';

export const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editCatId, setEditCatId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    displayOrder: 0,
    isActive: true
  });

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories?all=true');
      if (res.data?.categories) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      console.error('Failed to load categories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setEditCatId(null);
    setFormData({ name: '', description: '', displayOrder: categories.length + 1, isActive: true });
    setErrorMsg('');
    setModalOpen(true);
  };

  const openEditModal = (cat) => {
    setIsEditing(true);
    setEditCatId(cat._id);
    setFormData({
      name: cat.name,
      description: cat.description || '',
      displayOrder: cat.displayOrder || 0,
      isActive: cat.isActive !== undefined ? cat.isActive : true
    });
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMsg('Category name is required.');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      if (isEditing) {
        await api.put(`/categories/${editCatId}`, formData);
      } else {
        await api.post('/categories', formData);
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to save category.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) return;

    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not delete category.');
    }
  };

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)' }}>Product Categories</h1>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            Organize namkeens, sweets, and wholesale carton groupings.
          </p>
        </div>

        <button onClick={openAddModal} className="btn btn-primary btn-sm">
          <Plus size={16} />
          <span>Add Category</span>
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            No categories defined yet.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>Order</th>
                  <th>Category Name</th>
                  <th>Slug URL</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c._id}>
                    <td style={{ fontWeight: 700 }}>{c.displayOrder}</td>
                    <td>
                      <div style={{ fontWeight: 700 }}>{c.name}</div>
                    </td>
                    <td>
                      <code style={{ fontSize: '11px', color: 'var(--color-primary)' }}>/{c.slug}</code>
                    </td>
                    <td style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                      {c.description || '-'}
                    </td>
                    <td>
                      <span className={`badge ${c.isActive ? 'badge-green' : 'badge-danger'}`}>
                        {c.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => openEditModal(c)}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '5px' }}
                          title="Edit Category"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(c._id, c.name)}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '5px', color: 'var(--color-danger)' }}
                          title="Delete Category"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
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
            maxWidth: '500px',
            boxShadow: 'var(--shadow-lg)',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'var(--color-bg-secondary)'
            }}>
              <h3 style={{ fontSize: 'var(--font-size-md)' }}>
                {isEditing ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {errorMsg && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'var(--color-danger-bg)',
                  color: 'var(--color-danger)',
                  padding: '10px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-size-xs)'
                }}>
                  <AlertCircle size={16} />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Traditional Mixtures"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Description (Optional)</label>
                <textarea
                  rows="2"
                  placeholder="Short note about the flavours or types..."
                  className="form-textarea"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Display Order Number</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                />
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: 'var(--font-size-sm)' }}>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                <span>Active & Visible in Public Navigation</span>
              </label>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn btn-outline btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary btn-sm"
                >
                  {isSubmitting ? 'Saving...' : isEditing ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
