import React, { useState, useEffect, useCallback  } from 'react';
import { transactionAPI } from '../services/api';
import { format } from 'date-fns';
import { Edit2, Trash2, Calendar, CreditCard } from 'lucide-react';

function TransactionList({ refresh, onEdit }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    loadTransactions();
  }, [refresh, loadTransactions]);

  const loadTransactions = useCallback (async () => {
    setLoading(true);
    try {
      let response;
      if (startDate && endDate) {
        response = await transactionAPI.getByDateRange(startDate, endDate);
      } else {
        response = await transactionAPI.getAll();
      }
      setTransactions(response.data);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await transactionAPI.delete(id);
        loadTransactions();
      } catch (error) {
        console.error('Error deleting transaction:', error);
        alert('Error deleting transaction');
      }
    }
  };

  const handleFilter = () => {
    loadTransactions();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (loading) {
    return <div className="loading">Loading transactions...</div>;
  }

  return (
    <div className="card">
      <h2>Transactions</h2>
      
      <div className="date-filter">
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <button onClick={handleFilter} className="btn btn-primary">
          <Calendar size={20} /> Filter
        </button>
      </div>

      {transactions.length === 0 ? (
        <div className="empty-state">
          <CreditCard size={64} />
          <h3>No transactions found</h3>
          <p>Start by adding your first transaction above</p>
        </div>
      ) : (
        <div className="transaction-list">
          {transactions.map(transaction => (
            <div key={transaction.id} className="transaction-item">
              <div className="transaction-info">
                <h4>{transaction.description}</h4>
                <p>
                  {format(new Date(transaction.transactionDate), 'MMM dd, yyyy')} • {' '}
                  {transaction.paymentDetails || transaction.paymentMethod}
                  {transaction.notes && ` • ${transaction.notes}`}
                </p>
              </div>
              <div className="transaction-amount">
                {formatCurrency(transaction.amount)}
              </div>
              <div>
                <span className="transaction-category">
                  {transaction.categoryName}
                </span>
              </div>
              <div className="transaction-actions">
                <button 
                  onClick={() => onEdit(transaction)}
                  className="btn btn-secondary btn-small"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(transaction.id)}
                  className="btn btn-danger btn-small"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TransactionList;
