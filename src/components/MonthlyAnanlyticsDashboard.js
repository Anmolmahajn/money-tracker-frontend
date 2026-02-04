import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function MonthlyAnalyticsDashboard() {
  const [analytics, setAnalytics] = useState([]);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const currentMonth = new Date().toISOString().slice(0, 7);
      const response = await analyticsAPI.getMonthly(currentMonth);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const chartData = analytics.map(month => ({
    month: month.yearMonth,
    expenses: Number(month.totalExpenses),
  }));

  return (
    <div className="card">
      <h2>Monthly Spending Trends</h2>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="expenses" strokeWidth={3} name="Total Expenses" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MonthlyAnalyticsDashboard;
