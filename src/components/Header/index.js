import React from 'react';
import { Link } from 'react-router-dom';
import InventoryDropdowns from '../InventoryDropdowns';
import FoodJournal from '../FoodJournal';
import './styles.css';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h1>nomnomnomnom</h1>
        </Link>
      </div>
      <div className="header-actions">
        <InventoryDropdowns />
        <FoodJournal />
        <Link to="/recipe-builder" className="recipe-button">
          🥘
        </Link>
        <Link to="/food-survey" className="survey-button">
          📋
        </Link>
        <Link to="/profile" className="profile-button">
          👤
        </Link>
      </div>
    </header>
  );
};

export default Header;