import React from 'react';
import { Link, NavLink } from 'react-router-dom';
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
        <NavLink to="/profile" className={({ isActive }) => isActive ? "profile-button active" : "profile-button"}>
          👤
        </NavLink>
      </div>
    </header>
  );
};

export default Header;