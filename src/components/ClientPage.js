// src/pages/ClientPage.js
import React from 'react';
import ClientManagement from '../components/ClientManagement'; // Your custom component
import Header from '../components/Header';
import Footer from '../components/Footer';

function ClientPage() {
  return (
    <div className="WelcomeDashboard">
      <Header />
      <main className="main-content">
        <ClientManagement />
      </main>
      <Footer />
    </div>
  );
}

export default ClientPage;
