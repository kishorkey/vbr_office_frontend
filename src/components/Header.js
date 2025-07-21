import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('Name');
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <header className="header">
      <div className="headercard">
        <p className='usernameclass'>{localStorage.getItem('Name')}</p>
        <button className="button" onClick={handleLogout}>Log out</button>
      </div>
      <div className="navcard">
        <nav>
          <a href="/#about">About</a>
          <a href="/#features">Features</a>
          <a href="/#contact">Contact</a>
        </nav>
      </div>
    </header>
  );
}

export default Header;