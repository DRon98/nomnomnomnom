import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './Profile.css';

function Profile() {
  const dietaryRestrictions = useSelector(state => state.user.dietaryRestrictions);
  const dispatch = useDispatch();

  // This is a placeholder for the actual implementation
  const handleToggleRestriction = (restriction) => {
    // This would dispatch an action to update the dietary restrictions
    console.log(`Toggle ${restriction}`);
  };

  return (
    <div className="profile-page">
      <h2>User Profile</h2>
      
      <div className="profile-section">
        <h3>Dietary Restrictions</h3>
        <div className="restrictions-list">
          {Object.entries(dietaryRestrictions).map(([restriction, isActive]) => (
            <div key={restriction} className="restriction-item">
              <label>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={() => handleToggleRestriction(restriction)}
                />
                {restriction}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="profile-section">
        <h3>Preferences</h3>
        <p>More user preferences will be added here.</p>
      </div>
    </div>
  );
}

export default Profile;