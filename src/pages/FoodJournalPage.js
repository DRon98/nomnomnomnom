import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { format, startOfWeek, addDays } from 'date-fns';
import {
  addDailyEntry,
  addWeeklySummary,
  updateDailyEntry,
  removeDailyEntry
} from '../store/foodJournalSlice';
import './FoodJournalPage.css';

// Constants
const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];
const MOODS = ['😞', '😕', '😐', '😊', '😊👍'];
const SERVING_SIZES = [1, 2, 3];
const ENERGY_LEVELS = ['⚡⚡⚡', '⚡⚡', '⚡', '😴'];

const FoodJournalPage = () => {
  const dispatch = useDispatch();
  const [viewMode, setViewMode] = useState('daily'); // 'daily' or 'weekly'
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Redux state
  const dailyEntries = useSelector(state => state.foodJournal.dailyEntries);
  const weeklySummaries = useSelector(state => state.foodJournal.weeklySummaries);
  const streakCount = useSelector(state => state.foodJournal.streakCount);
  const mealPlan = useSelector(state => state.mealPlan.dayPlan);
  const pantryItems = useSelector(state => state.inventory.pantry);
  const recommendedFoods = useSelector(state => state.foods.recommendedFoods);
  const cookingMethods = useSelector(state => state.survey.cookingMethods);

  // Local state for form inputs
  const [newEntry, setNewEntry] = useState({
    mealType: '',
    food: null,
    servings: 1,
    mood: null
  });

  // Get entries for selected date
  const getEntriesForDate = (date) => {
    return dailyEntries.filter(entry => entry.date === date);
  };

  // Get suggested foods for a meal type
  const getSuggestedFoods = (mealType) => {
    const planFoods = mealPlan[mealType.toLowerCase()] || [];
    const pantryFoods = pantryItems.map(item => item.food);
    const recommended = recommendedFoods.slice(0, 5);
    
    // Combine and deduplicate foods
    return [...new Set([...planFoods, ...pantryFoods, ...recommended])];
  };

  // Calculate completion percentage for progress bar
  const getCompletionPercentage = (date) => {
    const entries = getEntriesForDate(date);
    const uniqueMealTypes = new Set(entries.map(entry => entry.mealType));
    return (uniqueMealTypes.size / MEAL_TYPES.length) * 100;
  };

  // Copy previous day's entries
  const copyPreviousDay = () => {
    const prevDate = new Date(selectedDate);
    prevDate.setDate(prevDate.getDate() - 1);
    const prevDateStr = prevDate.toISOString().split('T')[0];
    
    const prevEntries = getEntriesForDate(prevDateStr);
    prevEntries.forEach(entry => {
      dispatch(addDailyEntry({
        date: selectedDate,
        mealType: entry.mealType,
        food: entry.food,
        servings: entry.servings,
        mood: entry.mood
      }));
    });
  };

  // Handle daily entry submission
  const handleDailySubmit = (mealType) => {
    if (!newEntry.food || !newEntry.mood) return;

    dispatch(addDailyEntry({
      date: selectedDate,
      mealType,
      food: newEntry.food,
      servings: newEntry.servings,
      mood: newEntry.mood
    }));

    setNewEntry({
      mealType: '',
      food: null,
      servings: 1,
      mood: null
    });
  };

  // Handle weekly summary submission
  const handleWeeklySummit = (weekStart) => {
    const weekEntries = [];
    for (let i = 0; i < 7; i++) {
      const date = addDays(new Date(weekStart), i).toISOString().split('T')[0];
      weekEntries.push({
        date,
        entries: getEntriesForDate(date)
      });
    }

    dispatch(addWeeklySummary({
      weekStart,
      dateEntries: weekEntries,
      satisfaction: 4, // 1-5
      prepMethod: cookingMethods.proteins[0], // Default to first method
      energy: ENERGY_LEVELS[0],
      notes: ''
    }));
  };

  // Render daily view meal slot
  const renderMealSlot = (mealType) => {
    const entries = getEntriesForDate(selectedDate).filter(e => e.mealType === mealType);
    const suggestedFoods = getSuggestedFoods(mealType);

    return (
      <div className="meal-slot" key={mealType}>
        <h3>{mealType}</h3>
        
        {/* Existing entries */}
        {entries.map(entry => (
          <div className="entry-item" key={entry.foodId}>
            <span className="food-icon">{entry.food.icon}</span>
            <span className="food-name">{entry.food.name}</span>
            <span className="servings">({entry.servings} servings)</span>
            <span className="mood">{entry.mood}</span>
            <button
              className="remove-button"
              onClick={() => dispatch(removeDailyEntry({
                date: selectedDate,
                mealType,
                foodId: entry.foodId
              }))}
            >
              ×
            </button>
          </div>
        ))}
        
        {/* Add new entry form */}
        <div className="add-entry-form">
          <select
            value={newEntry.food?.id || ''}
            onChange={(e) => {
              const food = suggestedFoods.find(f => f.id === e.target.value);
              setNewEntry({ ...newEntry, food });
            }}
          >
            <option value="">Select food...</option>
            {suggestedFoods.map(food => (
              <option key={food.id} value={food.id}>
                {food.icon} {food.name}
              </option>
            ))}
          </select>
          
          <div className="serving-bubbles">
            {SERVING_SIZES.map(size => (
              <button
                key={size}
                className={`serving-bubble ${newEntry.servings === size ? 'active' : ''}`}
                onClick={() => setNewEntry({ ...newEntry, servings: size })}
              >
                {size}
              </button>
            ))}
          </div>
          
          <div className="mood-selector">
            {MOODS.map(mood => (
              <button
                key={mood}
                className={`mood-button ${newEntry.mood === mood ? 'active' : ''}`}
                onClick={() => setNewEntry({ ...newEntry, mood })}
              >
                {mood}
              </button>
            ))}
          </div>
          
          <button
            className="add-button"
            onClick={() => handleDailySubmit(mealType)}
            disabled={!newEntry.food || !newEntry.mood}
          >
            Add Entry
          </button>
        </div>
      </div>
    );
  };

  // Render weekly view
  const renderWeeklyView = () => {
    const weekStart = startOfWeek(new Date(selectedDate)).toISOString().split('T')[0];
    const weekSummary = weeklySummaries.find(s => s.weekStart === weekStart);

    return (
      <div className="weekly-view">
        <h2>Weekly Summary</h2>
        <div className="week-dates">
          {[...Array(7)].map((_, i) => {
            const date = addDays(new Date(weekStart), i);
            const dateStr = date.toISOString().split('T')[0];
            const entries = getEntriesForDate(dateStr);
            const completion = getCompletionPercentage(dateStr);

            return (
              <div key={dateStr} className="day-summary">
                <h3>{format(date, 'EEEE')}</h3>
                <div className="progress-bar">
                  <div className="progress" style={{ width: `${completion}%` }} />
                </div>
                <div className="entries-summary">
                  {entries.map(entry => (
                    <div key={`${entry.foodId}-${entry.mealType}`} className="entry-pill">
                      {entry.food.icon} {entry.mood}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {weekSummary ? (
          <div className="week-details">
            <h3>Weekly Insights</h3>
            <div className="insight-grid">
              <div className="insight-item">
                <label>Overall Satisfaction</label>
                <div className="stars">{'⭐'.repeat(weekSummary.satisfaction)}</div>
              </div>
              <div className="insight-item">
                <label>Energy Levels</label>
                <div className="energy">{weekSummary.energy}</div>
              </div>
              <div className="insight-item">
                <label>Most Used Prep Method</label>
                <div className="prep-method">{weekSummary.prepMethod}</div>
              </div>
              <div className="insight-item">
                <label>Notes</label>
                <p>{weekSummary.notes}</p>
              </div>
            </div>
          </div>
        ) : (
          <button
            className="summarize-button"
            onClick={() => handleWeeklySummit(weekStart)}
          >
            Generate Weekly Summary
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="food-journal-page">
      <header className="journal-header">
        <h1>Food Journal</h1>
        <div className="header-controls">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />
          <div className="view-toggle">
            <button
              className={`toggle-button ${viewMode === 'daily' ? 'active' : ''}`}
              onClick={() => setViewMode('daily')}
            >
              Daily
            </button>
            <button
              className={`toggle-button ${viewMode === 'weekly' ? 'active' : ''}`}
              onClick={() => setViewMode('weekly')}
            >
              Weekly
            </button>
          </div>
        </div>
      </header>

      {viewMode === 'daily' ? (
        <div className="daily-view">
          <div className="streak-counter">
            🔥 {streakCount} day{streakCount !== 1 ? 's' : ''} streak!
          </div>
          
          <button className="copy-button" onClick={copyPreviousDay}>
            Copy Yesterday's Entries
          </button>
          
          <div className="progress-bar">
            <div
              className="progress"
              style={{ width: `${getCompletionPercentage(selectedDate)}%` }}
            />
          </div>
          
          <div className="meal-slots">
            {MEAL_TYPES.map(renderMealSlot)}
          </div>
        </div>
      ) : (
        renderWeeklyView()
      )}
    </div>
  );
};

export default FoodJournalPage; 