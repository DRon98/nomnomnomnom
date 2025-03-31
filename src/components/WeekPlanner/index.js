import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  addWeekFeeling, 
  removeWeekFeeling, 
  updateWeekFeelingDays, 
  setHasSeenWeekViewTooltip,
  removeDesiredState 
} from '../../store/userSlice';
import StateSelector from '../StateSelector';
import { CURRENT_STATES, DESIRED_STATES } from '../../utils/constants';
import './styles.css';

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Color palette for emotions
const EMOTION_COLORS = [
  '#3498db', // Blue
  '#27ae60', // Dark Green
  '#8e44ad', // Purple
  '#e67e22', // Orange
  '#c0392b', // Red
  '#16a085', // Teal
];

const DaySelector = ({ feeling, selectedDays, onDayToggle, emotionColor }) => {
  return (
    <div className="day-selector">
      <div className="day-selector-label">Which days do you wish to prioritize feeling {feeling.toLowerCase()}?</div>
      <div className="day-bubbles">
        {DAYS_OF_WEEK.map((day) => (
          <button
            key={day}
            className={`day-bubble ${selectedDays.includes(day) ? 'selected' : ''}`}
            onClick={() => onDayToggle(day)}
            style={{
              '--emotion-color': emotionColor,
              backgroundColor: selectedDays.includes(day) ? emotionColor : '#e9ecef'
            }}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
};

const EmotionToggle = ({ feelings, activeFeeling, onToggle, onRemove }) => {
  return (
    <div className="emotion-toggle">
      {feelings.map((feeling, index) => (
        <div key={feeling.feeling} className="emotion-button-container">
          <button
            className={`emotion-button ${activeFeeling === feeling.feeling ? 'active' : ''}`}
            onClick={() => onToggle(feeling.feeling)}
            style={{
              backgroundColor: activeFeeling === feeling.feeling ? EMOTION_COLORS[index] : 'transparent',
              color: activeFeeling === feeling.feeling ? 'white' : EMOTION_COLORS[index],
              borderColor: EMOTION_COLORS[index]
            }}
          >
            {feeling.feeling}
          </button>
          <button 
            className="remove-emotion"
            onClick={() => onRemove(feeling.feeling)}
            aria-label={`Remove ${feeling.feeling}`}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

const WeekPlanner = () => {
  const dispatch = useDispatch();
  const weekFeelings = useSelector(state => state.user.weekFeelings);
  const hasSeenTooltip = useSelector(state => state.user.hasSeenWeekViewTooltip);
  const [activeFeeling, setActiveFeeling] = useState(null);

  useEffect(() => {
    if (!hasSeenTooltip) {
      dispatch(setHasSeenWeekViewTooltip());
    }
  }, [dispatch, hasSeenTooltip]);

  useEffect(() => {
    // Set active feeling to the first one when feelings change
    if (weekFeelings.length > 0 && !activeFeeling) {
      setActiveFeeling(weekFeelings[0].feeling);
    }
  }, [weekFeelings, activeFeeling]);

  const handleAddFeeling = (feeling) => {
    if (!weekFeelings.some(f => f.feeling === feeling)) {
      dispatch(addWeekFeeling({ feeling, days: DAYS_OF_WEEK })); // Default select all days
      setActiveFeeling(feeling);
    }
  };

  const handleRemoveFeeling = (feeling) => {
    dispatch(removeWeekFeeling(feeling));
    dispatch(removeDesiredState(feeling)); // Also remove from desired states
    if (activeFeeling === feeling) {
      setActiveFeeling(weekFeelings.length > 1 ? weekFeelings[0].feeling : null);
    }
  };

  const handleUpdateDays = (feeling, days) => {
    dispatch(updateWeekFeelingDays({ feeling, days }));
  };

  const handleToggleFeeling = (feeling) => {
    setActiveFeeling(feeling);
  };

  const activeFeelingData = weekFeelings.find(f => f.feeling === activeFeeling);
  const activeFeelingIndex = weekFeelings.findIndex(f => f.feeling === activeFeeling);

  return (
    <div className="week-planner">
      <div className="week-state-selectors">
        <StateSelector
          type="current"
          options={CURRENT_STATES}
          question="How do you feel entering this week?"
          showSelectedStates={true}
        />
        <StateSelector
          type="desired"
          options={DESIRED_STATES}
          question="How do you want to feel this week?"
          onStateSelect={handleAddFeeling}
          showSelectedStates={false}
        />
      </div>

      {weekFeelings.length > 0 && (
        <div className="week-feelings-section">
          <EmotionToggle 
            feelings={weekFeelings}
            activeFeeling={activeFeeling}
            onToggle={handleToggleFeeling}
            onRemove={handleRemoveFeeling}
          />
          {activeFeelingData && (
            <DaySelector
              feeling={activeFeelingData.feeling}
              selectedDays={activeFeelingData.days}
              onDayToggle={(day) => {
                const newDays = activeFeelingData.days.includes(day)
                  ? activeFeelingData.days.filter(d => d !== day)
                  : [...activeFeelingData.days, day];
                handleUpdateDays(activeFeelingData.feeling, newDays);
              }}
              emotionColor={EMOTION_COLORS[activeFeelingIndex]}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default WeekPlanner;