import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';
import vbrLogo from '../VBR_logo.png'; // Make sure the path is correct

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = JSON.parse(localStorage.getItem('role') || '[]');
  const name = localStorage.getItem('Name');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const isClientManagement = location.pathname.startsWith('/clients');

  return (
    <>
      <div className="navbar">
        <div className="navbar-left">
          <img src={vbrLogo} alt="VBR Logo" className="vbr-logo" />
        </div>

        <div className="navbar-center">
          <div className="vbr-title">VBR</div>
          <div className="vbr-subtitle">Defending Your Rights</div>
        </div>

        <div className="navbar-right">
          {name && <span className="username">{name}</span>}
          <button className="logout-btn" onClick={handleLogout}>Log out</button>
        </div>
      </div>

      <div className="navbar-menu">
        <a href="/#about">About</a>
        {role.includes('ADMIN') && (
          <>
            <Link to="/clients" className={isClientManagement && location.pathname === '/clients' ? 'active' : ''}>
              Manage Clients
            </Link>
            <Link to="/clients/add" className={isClientManagement && location.pathname === '/clients/add' ? 'active' : ''}>
              Add Client
            </Link>
          </>
        )}
      </div>
    </>
  );
}

export default Navbar;
