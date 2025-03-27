import React from 'react';
import './styles.css';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <h1>nomnomnomnom</h1>
      </div>
      <div className="profile">
        <button className="profile-button">👤</button>
      </div>
    </header>
  );
};

export default Header; 