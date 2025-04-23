import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaChartBar, FaLifeRing, FaCog, FaStar, FaMoon, FaSignOutAlt, FaCalendarAlt } from 'react-icons/fa';
import InventoryDropdowns from '../InventoryDropdowns';
import Register from '../../pages/Register';
import Login from '../../pages/Login';
import supabase from '../../utils/supabaseClient';
import './styles.css';

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Check initial auth state
    const checkUser = async () => {
      const { data: { user: initialUser } } = await supabase.auth.getUser();
      setUser(initialUser);
    };
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsProfileOpen(false);
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h1>nomnomnomnom</h1>
          </Link>
        </div>
        <div className="header-actions">
          <InventoryDropdowns type="both" showHeader={true} />
          {/* <Link to="/recipe-generator" className="recipe-button">
            🥘
          </Link>
          <Link to="/weekly-calendar" className="calendar-button">
            <FaCalendarAlt />
          </Link> */}
          {user ? (
            <div className="welcome-message">
              Welcome, {user.email?.split('@')[0]}
            </div>
          ) : (
            <>
              <button className="auth-button login" onClick={() => setIsLoginModalOpen(true)}>
                Login
              </button>
              <button className="auth-button signup" onClick={() => setIsSignupModalOpen(true)}>
                Sign Up
              </button>
            </>
          )}
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
                <button className="dropdown-item text-danger" onClick={handleLogout}>
                  <FaSignOutAlt /> Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="modal-overlay" onClick={() => setIsLoginModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsLoginModalOpen(false)}>×</button>
            <div className="modal-body">
              <Login onRegisterClick={() => {
                setIsLoginModalOpen(false);
                setIsSignupModalOpen(true);
              }} />
            </div>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {isSignupModalOpen && (
        <div className="modal-overlay" onClick={() => setIsSignupModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsSignupModalOpen(false)}>×</button>
            <div className="modal-body">
              <Register onLoginClick={() => {
                setIsSignupModalOpen(false);
                setIsLoginModalOpen(true);
              }} />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;