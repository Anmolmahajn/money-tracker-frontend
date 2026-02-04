import React, { useState, useEffect } from 'react';
import { categoryAPI } from '../services/api';
import { Plus, Edit2, Trash2, Folder } from 'lucide-react';

function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    iconName: '',
    colorCode: '#667eea',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoryAPI.update(editingCategory.id, formData);
      } else {
        await categoryAPI.create(formData);
      }
      setFormData({ name: '', description: '', iconName: '', colorCode: '#667eea' });
      setShowForm(false);
      setEditingCategory(null);
      loadCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      alert(error.response?.data?.message || 'Error saving category');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      iconName: category.iconName || '',
      colorCode: category.colorCode || '#667eea',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure? This will delete all transactions in this category.')) {
      try {
        await categoryAPI.delete(id);
        loadCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Error deleting category. It may have associated transactions.');
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '', iconName: '', colorCode: '#667eea' });
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Categories</h2>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="btn btn-primary">
            <Plus size={20} /> Add Category
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '30px', padding: '20px', background: '#f9f9f9', borderRadius: '12px' }}>
          <h3 style={{ marginBottom: '15px' }}>
            {editingCategory ? 'Edit Category' : 'New Category'}
          </h3>
          <div className="form-row">
            <div className="form-group">
              <label>Category Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Food & Dining"
                required
              />
            </div>
            <div className="form-group">
              <label>Color</label>
              <input
                type="color"
                value={formData.colorCode}
                onChange={(e) => setFormData({ ...formData, colorCode: e.target.value })}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="What expenses does this category cover?"
            />
          </div>
          <div className="form-group">
            <label>Icon Name (optional)</label>
            <input
              type="text"
              value={formData.iconName}
              onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
              placeholder="e.g., shopping-cart, coffee"
            />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn btn-primary">
              {editingCategory ? 'Update' : 'Create'} Category
            </button>
            <button type="button" onClick={handleCancel} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      )}

      {categories.length === 0 ? (
        <div className="empty-state">
          <Folder size={64} />
          <h3>No categories yet</h3>
          <p>Create your first category to organize transactions</p>
        </div>
      ) : (
        <div className="category-grid">
          {categories.map(category => (
            <div 
              key={category.id} 
              className="category-card"
              style={{ borderLeftColor: category.colorCode, borderLeftWidth: '4px' }}
            >
              <h3>{category.name}</h3>
              {category.description && <p>{category.description}</p>}
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <button 
                  onClick={() => handleEdit(category)}
                  className="btn btn-secondary btn-small"
                >
                  <Edit2 size={16} /> Edit
                </button>
                <button 
                  onClick={() => handleDelete(category.id)}
                  className="btn btn-danger btn-small"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoryManager;
