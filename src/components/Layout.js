import React from 'react';
import Navbar from './Navbar';
import './Layout.css';

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main className="layout-main">
        {children}
      </main>
      <footer className="layout-footer">
        <p>&copy; {new Date().getFullYear()} VBR. All rights reserved.</p>
      </footer>
    </>
  );
}

export default Layout;
