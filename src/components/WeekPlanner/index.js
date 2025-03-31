import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  addWeekFeeling, 
  removeWeekFeeling, 
  updateWeekFeelingDays, 
  setHasSeenWeekViewTooltip 
} from '../../store/userSlice';
import StateSelector from '../StateSelector';
import { CURRENT_STATES, DESIRED_STATES } from '../../utils/constants';
import './styles.css';

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const DaySelector = ({ feeling, selectedDays, onDayToggle }) => {
  return (
    <div className="day-selector">
      <div className="day-selector-label">Which days do you want to prioritize this feeling?</div>
      <div className="day-bubbles">
        {DAYS_OF_WEEK.map((day) => (
          <button
            key={day}
            className={`day-bubble ${selectedDays.includes(day) ? 'selected' : ''}`}
            onClick={() => onDayToggle(day)}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
};

const FeelingAssignment = ({ feeling, days, onRemove, onDaysChange, allAssignedDays }) => {
  const handleDayToggle = (day) => {
    const newDays = days.includes(day)
      ? days.filter(d => d !== day)
      : [...days, day];
    onDaysChange(feeling, newDays);
  };

  return (
    <div className="feeling-assignment">
      <div className="feeling-header">
        <div className="feeling-bubble">{feeling}</div>
        <button 
          className="remove-feeling" 
          onClick={() => onRemove(feeling)}
          aria-label={`Remove ${feeling}`}
        >
          ×
        </button>
      </div>
      <DaySelector 
        feeling={feeling} 
        selectedDays={days} 
        onDayToggle={handleDayToggle} 
      />
    </div>
  );
};

const WeekPlanner = () => {
  const dispatch = useDispatch();
  const weekFeelings = useSelector(state => state.user.weekFeelings);
  const hasSeenTooltip = useSelector(state => state.user.hasSeenWeekViewTooltip);
  const [selectedDay, setSelectedDay] = useState('Mon');

  useEffect(() => {
    if (!hasSeenTooltip) {
      dispatch(setHasSeenWeekViewTooltip());
    }
  }, [dispatch, hasSeenTooltip]);

  const handleAddFeeling = (feeling) => {
    if (!weekFeelings.some(f => f.feeling === feeling)) {
      dispatch(addWeekFeeling({ feeling, days: [] }));
    }
  };

  const handleRemoveFeeling = (feeling) => {
    dispatch(removeWeekFeeling(feeling));
  };

  const handleUpdateDays = (feeling, days) => {
    dispatch(updateWeekFeelingDays({ feeling, days }));
  };

  // Get all days that have any feeling assigned
  const allAssignedDays = weekFeelings.reduce((acc, { days }) => {
    days.forEach(day => {
      if (!acc.includes(day)) acc.push(day);
    });
    return acc;
  }, []);

  // Get feelings assigned to the selected day
  const feelingsForSelectedDay = weekFeelings
    .filter(({ days }) => days.includes(selectedDay))
    .map(({ feeling }) => feeling);

  return (
    <div className="week-planner">
      <div className="week-state-selectors">
        <StateSelector
          type="current"
          options={CURRENT_STATES}
          question="How do you feel entering this week?"
        />
        <StateSelector
          type="desired"
          options={DESIRED_STATES}
          question="How do you want to feel this week?"
        />
      </div>

      <div className="week-feelings-section">
        {weekFeelings.map(({ feeling, days }) => (
          <FeelingAssignment
            key={feeling}
            feeling={feeling}
            days={days}
            onRemove={handleRemoveFeeling}
            onDaysChange={handleUpdateDays}
            allAssignedDays={allAssignedDays}
          />
        ))}
      </div>

      <div className="recommendations-filter">
        <label htmlFor="day-selector">Recommendations for: </label>
        <select 
          id="day-selector" 
          value={selectedDay} 
          onChange={(e) => setSelectedDay(e.target.value)}
          className="day-dropdown"
        >
          {DAYS_OF_WEEK.map(day => (
            <option key={day} value={day}>
              {day} {feelingsForSelectedDay.length > 0 && `(${feelingsForSelectedDay.join(', ')})`}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default WeekPlanner;