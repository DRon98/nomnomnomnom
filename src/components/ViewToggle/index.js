import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveView } from '../../store/userSlice';
import './styles.css';

const ViewToggle = () => {
  const dispatch = useDispatch();
  const activeView = useSelector(state => state.user.activeView);
  const hasSeenWeekViewTooltip = useSelector(state => state.user.hasSeenWeekViewTooltip);

  const handleViewChange = (view) => {
    dispatch(setActiveView(view));
  };

  return (
    <div className="view-toggle">
      <div className="tabs-header">
        <button
          className={`tab-button ${activeView === 'day' ? 'active' : ''}`}
          onClick={() => handleViewChange('day')}
        >
          Day
        </button>
        <button
          className={`tab-button ${activeView === 'week' ? 'active' : ''}`}
          onClick={() => handleViewChange('week')}
        >
          Week
        </button>
      </div>
      {activeView === 'week' && !hasSeenWeekViewTooltip && (
        <div className="week-view-tooltip">
          New to weekly planning? Select a feeling and assign it to specific days to get tailored recommendations!
        </div>
      )}
    </div>
  );
};

export default ViewToggle;