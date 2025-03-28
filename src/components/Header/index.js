import React from 'react';
import InventoryDropdowns from '../InventoryDropdowns';
import FoodJournal from '../FoodJournal';
import './styles.css';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <h1>nomnomnomnom</h1>
      </div>
      <div className="header-actions">
        <InventoryDropdowns />
        <FoodJournal />
        <button className="profile-button">👤</button>
      </div>
    </header>
  );
};

export default Header;