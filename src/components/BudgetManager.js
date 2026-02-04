import React, { useState, useEffect } from 'react';
import { budgetAPI } from '../services/api';
import { Target, AlertCircle } from 'lucide-react';

function BudgetManager() {
  const [budgets, setBudgets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    periodType: 'MONTHLY',
    startDate: '',
    endDate: '',
    alertThreshold: 80,
    categoryId: null
  });

  useEffect(() => {
    loadBudgets();
  }, []);

  const loadBudgets = async () => {
    try {
      const response = await budgetAPI.getAll();
      setBudgets(response.data);
    } catch (error) {
      console.error('Error loading budgets:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await budgetAPI.create(formData);
      loadBudgets();
      setShowForm(false);
    } catch (error) {
      alert('Error creating budget');
    }
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>Budget Management</h2>
        <button onClick={() => setShowForm(true)} className="btn btn-primary">
          <Target size={20} /> Set Budget
        </button>
      </div>

      <div className="budget-list">
        {budgets.map(budget => (
          <div key={budget.id} className="budget-card">
            <h3>{budget.categoryName || 'Overall Budget'}</h3>
            <div className="budget-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${Math.min(budget.percentageUsed, 100)}%`,
                    backgroundColor: budget.percentageUsed > 100 ? '#ef4444' :
                                   budget.percentageUsed > 80 ? '#f59e0b' : '#10b981'
                  }}
                />
              </div>
              <p>₹{budget.currentSpending.toFixed(2)} / ₹{budget.amount.toFixed(2)}</p>
              <span className={budget.percentageUsed > budget.alertThreshold ? 'alert' : ''}>
                {budget.percentageUsed.toFixed(1)}% used
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BudgetManager;
