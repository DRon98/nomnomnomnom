import React from 'react';
import InventoryDropdowns from '../InventoryDropdowns';
import './styles.css';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <h1>nomnomnomnom</h1>
      </div>
      <div className="header-actions">
        <InventoryDropdowns />
        <button className="profile-button">👤</button>
      </div>
    </header>
  );
};

export default Header;