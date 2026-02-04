import React, { useState, useEffect, useCallback } from 'react';
import { transactionAPI } from '../services/api';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar, Wallet } from 'lucide-react';
import { format, subMonths } from 'date-fns';

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a', '#fee140', '#30cfd0'];

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('month');

  useEffect(() => {
    loadSummary();
  }, [dateRange]);

  const getDateRange =  useCallback(() => {
    const endDate = new Date();
    let startDate;

    switch (dateRange) {
      case 'week':
        startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - 7);
        break;
      case 'month':
        startDate = subMonths(endDate, 1);
        break;
      case 'year':
        startDate = subMonths(endDate, 12);
        break;
      default:
        startDate = subMonths(endDate, 1);
    }

    return {
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
    };
  }, [dateRange]);

  const loadSummary = useCallback(async () => {
    setLoading(true);
    try {
      const { startDate, endDate } = getDateRange();
      const response = await transactionAPI.getSummary(startDate, endDate);
      setSummary(response.data);
    } catch (error) {
      console.error('Error loading summary:', error);
    } finally {
      setLoading(false);
    }
  }, [getDateRange]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const prepareCategoryData = () => {
    if (!summary?.categoryBreakdown) return [];
    return Object.entries(summary.categoryBreakdown).map(([name, value]) => ({
      name,
      value: parseFloat(value),
    }));
  };

  const preparePaymentData = () => {
    if (!summary?.paymentMethodBreakdown) return [];
    return Object.entries(summary.paymentMethodBreakdown).map(([name, value]) => ({
      name,
      value: parseFloat(value),
    }));
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Dashboard</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => setDateRange('week')}
              className={`btn ${dateRange === 'week' ? 'btn-primary' : 'btn-secondary'} btn-small`}
            >
              Week
            </button>
            <button 
              onClick={() => setDateRange('month')}
              className={`btn ${dateRange === 'month' ? 'btn-primary' : 'btn-secondary'} btn-small`}
            >
              Month
            </button>
            <button 
              onClick={() => setDateRange('year')}
              className={`btn ${dateRange === 'year' ? 'btn-primary' : 'btn-secondary'} btn-small`}
            >
              Year
            </button>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3><TrendingUp size={20} style={{ display: 'inline', marginRight: '8px' }} />Total Spending</h3>
            <div className="value">{formatCurrency(summary?.totalSpending || 0)}</div>
          </div>
          <div className="stat-card">
            <h3><Calendar size={20} style={{ display: 'inline', marginRight: '8px' }} />Transactions</h3>
            <div className="value">{summary?.transactionCount || 0}</div>
          </div>
          <div className="stat-card">
            <h3><Wallet size={20} style={{ display: 'inline', marginRight: '8px' }} />Avg per Transaction</h3>
            <div className="value">
              {formatCurrency((summary?.totalSpending || 0) / (summary?.transactionCount || 1))}
            </div>
          </div>
        </div>
      </div>

      {prepareCategoryData().length > 0 && (
        <div className="card">
          <h2>Spending by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={prepareCategoryData()}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {prepareCategoryData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {preparePaymentData().length > 0 && (
        <div className="card">
          <h2>Spending by Payment Method</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={preparePaymentData()}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="value" fill="#667eea" name="Amount" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
