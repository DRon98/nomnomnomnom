import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectWeeklySchedule } from '../../store/calendarSlice';
import { saveScheduleData } from '../../store/scheduleDataSlice';
import './styles.css';

const DAYS_OF_WEEK = [
  { name: 'Monday', color: '#FF6B6B' },
  { name: 'Tuesday', color: '#4ECDC4' },
  { name: 'Wednesday', color: '#45B7D1' },
  { name: 'Thursday', color: '#96CEB4' },
  { name: 'Friday', color: '#FFEEAD' },
  { name: 'Saturday', color: '#D4A5A5' },
  { name: 'Sunday', color: '#9B59B6' }
];

const TIME_OF_DAY = ['Morning', 'Afternoon', 'Evening', 'Night'];
const MEAL_TYPES = ['Breakfast', 'Lunch/Dinner', 'Snacks'];
const GROCERY_METHODS = ['Online', 'In Person', 'Combination'];

const CookingGroceryScheduler = () => {
  const [activeTab, setActiveTab] = useState('cooking');
  const dispatch = useDispatch();
  const weeklySchedule = useSelector(selectWeeklySchedule);
  const foodPreferences = useSelector(state => state.foodPreferences.responses);
  const pantryItems = useSelector(state => state.inventory.pantry);

  // Cooking Schedule State
  const [cookingSchedule, setCookingSchedule] = useState({
    totalFrequency: 0,
    mealFrequencies: {
      Breakfast: 0,
      'Lunch/Dinner': 0,
      Snacks: 0
    },
    eatingOutFrequency: 0,
    selectedDays: {},
    timeOfDay: {}
  });

  // Grocery Schedule State
  const [grocerySchedule, setGrocerySchedule] = useState({
    totalFrequency: 0,
    method: '',
    selectedDays: {},
    timeOfDay: {}
  });

  const handleCookingFrequencyChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setCookingSchedule(prev => ({
      ...prev,
      totalFrequency: value
    }));
  };

  const handleMealFrequencyChange = (mealType, value) => {
    const newValue = parseInt(value) || 0;
    setCookingSchedule(prev => ({
      ...prev,
      mealFrequencies: {
        ...prev.mealFrequencies,
        [mealType]: newValue
      }
    }));
  };

  const handleEatingOutFrequencyChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setCookingSchedule(prev => ({
      ...prev,
      eatingOutFrequency: value
    }));
  };

  const handleDaySelection = (schedule, setSchedule, day) => {
    setSchedule(prev => ({
      ...prev,
      selectedDays: {
        ...prev.selectedDays,
        [day]: !prev.selectedDays[day],
      },
      timeOfDay: prev.selectedDays[day] ? prev.timeOfDay : {
        ...prev.timeOfDay,
        [day]: []
      }
    }));
  };

  const handleTimeSelection = (schedule, setSchedule, day, time) => {
    setSchedule(prev => ({
      ...prev,
      timeOfDay: {
        ...prev.timeOfDay,
        [day]: prev.timeOfDay[day]?.includes(time)
          ? prev.timeOfDay[day].filter(t => t !== time)
          : [...(prev.timeOfDay[day] || []), time]
      }
    }));
  };

  const renderDayTimeSelection = (schedule, setSchedule) => (
    <div className="day-selection-container">
      <h3>When do you plan on {activeTab === 'cooking' ? 'cooking' : 'buying groceries'}?</h3>
      <div className="days-grid">
        <div className="day-bubbles-container">
          {DAYS_OF_WEEK.map(({ name, color }) => (
            <button
              key={name}
              className={`day-bubble ${schedule.selectedDays[name] ? 'selected' : ''}`}
              style={{ 
                '--bubble-color': color,
                '--bubble-hover-color': `${color}dd`,
                backgroundColor: schedule.selectedDays[name] ? color : 'transparent'
              }}
              onClick={() => handleDaySelection(schedule, setSchedule, name)}
            >
              {name}
            </button>
          ))}
        </div>
        
        {Object.entries(schedule.selectedDays)
          .filter(([_, isSelected]) => isSelected)
          .map(([day]) => (
            <div key={day} className="time-selection">
              <p>{day} - When?</p>
              <div className="time-bubbles">
                {TIME_OF_DAY.map(time => (
                  <button
                    key={time}
                    className={`time-bubble ${schedule.timeOfDay[day]?.includes(time) ? 'selected' : ''}`}
                    onClick={() => handleTimeSelection(schedule, setSchedule, day, time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );

  const formatScheduleData = () => {
    // Format cooking schedule data
    const cookingDays = Object.entries(cookingSchedule.selectedDays)
      .filter(([_, isSelected]) => isSelected)
      .map(([day]) => ({
        day,
        times: cookingSchedule.timeOfDay[day] || []
      }));

    // Format grocery schedule data
    const groceryDays = Object.entries(grocerySchedule.selectedDays)
      .filter(([_, isSelected]) => isSelected)
      .map(([day]) => ({
        day,
        times: grocerySchedule.timeOfDay[day] || []
      }));

    return {
      cooking_schedule: {
        frequency: cookingSchedule.totalFrequency,
        which_meals: {
          breakfast: cookingSchedule.mealFrequencies['Breakfast'],
          lunch: cookingSchedule.mealFrequencies['Lunch/Dinner'],
          snacks: cookingSchedule.mealFrequencies['Snacks']
        },
        eating_out_frequency: cookingSchedule.eatingOutFrequency,
        cooking_days: cookingDays,
        meal_prep_preferences: {
          max_servings_per_person: foodPreferences.mealPrepPreferences.maxServingsPerPerson,
          max_days_to_eat: foodPreferences.mealPrepPreferences.maxDaysToEat
        }
      },
      grocery_schedule: {
        frequency: grocerySchedule.totalFrequency,
        grocery_buying_method: grocerySchedule.method || 'In person',
        grocery_days: groceryDays
      },
      weekly_calendar: weeklySchedule || {},
      pantry_inventory: pantryItems.map(item => ({
        food_id: item.foodId,
        name: item.food.name,
        category: item.food.category,
        amount: item.amount,
        unit: item.food.unit
      }))
    };
  };

  const handleSubmitSchedules = () => {
    const scheduleData = formatScheduleData();
    console.log('Schedule Data:', scheduleData);
    dispatch(saveScheduleData(scheduleData));
  };

  return (
    <div className="cooking-grocery-scheduler">
      <div className="scheduler-tabs">
        <button
          className={`tab-button ${activeTab === 'cooking' ? 'active' : ''}`}
          onClick={() => setActiveTab('cooking')}
        >
          Cooking Schedule
        </button>
        <button
          className={`tab-button ${activeTab === 'grocery' ? 'active' : ''}`}
          onClick={() => setActiveTab('grocery')}
        >
          Grocery Schedule
        </button>
      </div>

      <div className="scheduler-content">
        {activeTab === 'cooking' ? (
          <div className="cooking-schedule">
            <div className="frequency-section">
              <h3>Total Frequency</h3>
              <input
                type="number"
                min="0"
                value={cookingSchedule.totalFrequency}
                onChange={handleCookingFrequencyChange}
                className="frequency-input"
              />
            </div>

            <div className="meal-frequency-section">
              <h3>Which meals?</h3>
              <div className="meal-frequencies">
                {MEAL_TYPES.map(mealType => (
                  <div key={mealType} className="meal-frequency-input">
                    <label>{mealType}</label>
                    <input
                      type="number"
                      min="0"
                      value={cookingSchedule.mealFrequencies[mealType]}
                      onChange={(e) => handleMealFrequencyChange(mealType, e.target.value)}
                      className="frequency-input"
                    />
                  </div>
                ))}
              </div>
              <p className="total-count">
                Total: {Object.values(cookingSchedule.mealFrequencies).reduce((a, b) => a + b, 0)}
                /{cookingSchedule.totalFrequency}
              </p>
            </div>

            <div className="eating-out-section">
              <h3>How many times do you plan on eating out this week?</h3>
              <input
                type="number"
                min="0"
                value={cookingSchedule.eatingOutFrequency}
                onChange={handleEatingOutFrequencyChange}
                className="frequency-input"
              />
            </div>

            {renderDayTimeSelection(cookingSchedule, setCookingSchedule)}
          </div>
        ) : (
          <div className="grocery-schedule">
            <div className="frequency-section">
              <h3>Total Frequency</h3>
              <input
                type="number"
                min="0"
                value={grocerySchedule.totalFrequency}
                onChange={(e) => setGrocerySchedule(prev => ({
                  ...prev,
                  totalFrequency: parseInt(e.target.value) || 0
                }))}
                className="frequency-input"
              />
            </div>

            <div className="method-section">
              <h3>How do you plan on buying groceries?</h3>
              <div className="method-selection">
                {GROCERY_METHODS.map(method => (
                  <button
                    key={method}
                    className={`method-bubble ${grocerySchedule.method === method ? 'selected' : ''}`}
                    onClick={() => setGrocerySchedule(prev => ({
                      ...prev,
                      method
                    }))}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {renderDayTimeSelection(grocerySchedule, setGrocerySchedule)}
          </div>
        )}
      </div>

      <div className="submit-section">
        <button
          className="submit-button"
          onClick={handleSubmitSchedules}
        >
          Submit Schedules
        </button>
      </div>
    </div>
  );
};

export default CookingGroceryScheduler; 