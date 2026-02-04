import React, { useState, useEffect, useCallback } from 'react';
import { categoryAPI, transactionAPI } from '../services/api';
import { Plus, X } from 'lucide-react';

const PAYMENT_METHODS = [
  { value: 'UPI', label: 'UPI Apps' },
  { value: 'CREDIT_CARD', label: 'Credit Card' },
  { value: 'DEBIT_CARD', label: 'Debit Card' },
  { value: 'WALLET', label: 'Digital Wallet' },
  { value: 'CASH', label: 'Cash' },
  { value: 'NET_BANKING', label: 'Net Banking' },
  { value: 'SUBSCRIPTION', label: 'Subscription' },
];

function TransactionForm({ onTransactionAdded, editingTransaction, onCancelEdit }) {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    transactionDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'UPI',
    paymentDetails: '',
    categoryId: '',
    notes: '',
    isRecurring: false,
  });


  const loadCategories = useCallback (async () => {
    try {
      const response = await categoryAPI.getAll();
      setCategories(response.data);
      if (response.data.length > 0 && !formData.categoryId) {
        setFormData(prev => ({ ...prev, categoryId: response.data[0].id }));
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }, [formData.categoryId]);

  useEffect(() => {
  if (editingTransaction) {
    setFormData({
      description: editingTransaction.description,
      amount: editingTransaction.amount,
      transactionDate: editingTransaction.transactionDate,
      paymentMethod: editingTransaction.paymentMethod,
      paymentDetails: editingTransaction.paymentDetails || '',
      categoryId: editingTransaction.categoryId,
      notes: editingTransaction.notes || '',
      isRecurring: editingTransaction.isRecurring || false,
    });
  }
}, [editingTransaction]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        amount: parseFloat(formData.amount),
        categoryId: parseInt(formData.categoryId),
      };

      if (editingTransaction) {
        await transactionAPI.update(editingTransaction.id, data);
      } else {
        await transactionAPI.create(data);
      }

      setFormData({
        description: '',
        amount: '',
        transactionDate: new Date().toISOString().split('T')[0],
        paymentMethod: 'UPI',
        paymentDetails: '',
        categoryId: categories[0]?.id || '',
        notes: '',
        isRecurring: false,
      });
      onTransactionAdded();
      if (onCancelEdit) onCancelEdit();
    } catch (error) {
      console.error('Error saving transaction:', error);
      alert('Error saving transaction. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>{editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}</h2>
        {editingTransaction && (
          <button onClick={onCancelEdit} className="btn btn-secondary btn-small">
            <X size={16} /> Cancel
          </button>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Description *</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g., Grocery shopping"
              required
            />
          </div>
          <div className="form-group">
            <label>Amount (₹) *</label>
            <input
              type="number"
              step="0.01"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Date *</label>
            <input
              type="date"
              name="transactionDate"
              value={formData.transactionDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Payment Method *</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              required
            >
              {PAYMENT_METHODS.map(method => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Payment Details</label>
            <input
              type="text"
              name="paymentDetails"
              value={formData.paymentDetails}
              onChange={handleChange}
              placeholder="e.g., GPay, HDFC Card"
            />
          </div>
          <div className="form-group">
            <label>Category *</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Additional notes..."
          />
        </div>

        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="checkbox"
              name="isRecurring"
              checked={formData.isRecurring}
              onChange={handleChange}
              style={{ width: 'auto' }}
            />
            Recurring Transaction
          </label>
        </div>

        <button type="submit" className="btn btn-primary">
          <Plus size={20} />
          {editingTransaction ? 'Update Transaction' : 'Add Transaction'}
        </button>
      </form>
    </div>
  );
}

export default TransactionForm;
