import React from 'react';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';

function Home() {
  const [refreshKey, setRefreshKey] = React.useState(0);

  return (
    <div>
      <TransactionForm onTransactionAdded={() => setRefreshKey(prev => prev + 1)} />
      <TransactionList refresh={refreshKey} />
    </div>
  );
}

export default Home;