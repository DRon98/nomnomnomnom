import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaChartBar, FaLifeRing, FaCog, FaStar, FaMoon, FaSignOutAlt } from 'react-icons/fa';
import InventoryDropdowns from '../InventoryDropdowns';

import './styles.css';

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="header">
      <div className="logo">
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h1>nomnomnomnom</h1>
        </Link>
      </div>
      <div className="header-actions">
        <InventoryDropdowns />

        <Link to="/recipe-generator" className="recipe-button">
          🥘
        </Link>
        <div className="profile-dropdown" ref={dropdownRef}>
          <button 
            className={`profile-button ${isProfileOpen ? 'active' : ''}`}
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            👤
          </button>
          {isProfileOpen && (
            <div className="dropdown-menu">
              <Link to="/profile" className="dropdown-item">
                <FaUser /> View Profile
              </Link>
              <Link to="/food-journal" className="dropdown-item">
                <FaChartBar /> Food Journal
              </Link>
              <Link to="/kitchen-appliances" className="dropdown-item">
                <FaCog /> Kitchen Appliances
              </Link>
              <Link to="/food-survey" className="dropdown-item">
                <FaChartBar /> Food Preferences
              </Link>
              <Link to="/analytics" className="dropdown-item">
                <FaChartBar /> Analytics & Data
              </Link>
              <Link to="/help" className="dropdown-item">
                <FaLifeRing /> Help Center
              </Link>
              <Link to="/settings" className="dropdown-item">
                <FaCog /> Account Settings
              </Link>
              <Link to="/lifestyle-survey" className="dropdown-item">
                <FaLifeRing /> Lifestyle Survey
              </Link>
              <div className="dropdown-divider"></div>
              <Link to="/upgrade" className="dropdown-item">
                <FaStar /> Upgrade Plan
              </Link>
              <button className="dropdown-item">
                <FaMoon /> Dark Mode
                <div className="toggle-switch">
                  <input type="checkbox" id="dark-mode-toggle" />
                  <label htmlFor="dark-mode-toggle"></label>
                </div>
              </button>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item text-danger">
                <FaSignOutAlt /> Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;