import React, { useState } from 'react';
import ClientManagement from '../components/ClientManagement';
import AddClientForm from '../components/AddClientForm';

function ClientPage() {
  const [activeTab, setActiveTab] = useState('manage');

  return (
    <div>
      {activeTab === 'manage' ? <ClientManagement /> : <AddClientForm />}
    </div>
  );
}

export default ClientPage;
