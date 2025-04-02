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
        <NavLink to="/grocery-builder" className={({ isActive }) => isActive ? "grocery-button active" : "grocery-button"}>
          🛒
        </NavLink>
        <NavLink to="/recipe-builder" className={({ isActive }) => isActive ? "recipe-button active" : "recipe-button"}>
          🥘
        </NavLink>
        <NavLink to="/food-survey" className={({ isActive }) => isActive ? "survey-button active" : "survey-button"}>
          📋
        </NavLink>
        <NavLink to="/pantry" className={({ isActive }) => isActive ? "pantry-button active" : "pantry-button"}>
          🗄️
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => isActive ? "profile-button active" : "profile-button"}>
          👤
        </NavLink>
      </div>
    </header>
  );
};

export default Header;