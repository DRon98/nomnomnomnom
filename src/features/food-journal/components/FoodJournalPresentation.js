import React from 'react';
import { Link } from 'react-router-dom';
import { FOOD_CONSUMPTION_LEVELS } from '../../../constants';
import '../styles/FoodJournal.css';

/**
 * Presentational component for the food journal
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the journal dropdown is open
 * @param {Function} props.onToggle - Toggle dropdown callback
 * @param {string} props.selectedDate - Currently selected date
 * @param {Function} props.onDateChange - Date change callback
 * @param {Object[]} props.pastWeekDates - Array of past week dates
 * @param {Function} props.formatDate - Date formatting function
 * @param {number} props.step - Current step in quick journal flow
 * @param {Object} props.journalData - Quick journal form data
 * @param {Function} props.onConsumptionSelect - Consumption level selection callback
 * @param {Function} props.onFoodSelect - Food selection callback
 * @param {Function} props.onOtherFoodsResponse - Other foods response callback
 * @param {Function} props.onMealTimesResponse - Meal times response callback
 * @param {Function} props.onTipResponse - Tip response callback
 * @param {Function} props.onSubmit - Form submission callback
 * @param {string} props.searchTerm - Search term for food search
 * @param {Function} props.onSearchChange - Search term change callback
 * @param {Object[]} props.filteredFoods - Filtered food results
 * @param {Object[]} props.selectedFoods - Selected food items
 * @param {string} props.personalizedTip - User's personalized eating tip
 * @returns {JSX.Element} Food journal presentation component
 */
const FoodJournalPresentation = ({
  isOpen,
  onToggle,
  selectedDate,
  onDateChange,
  pastWeekDates,
  formatDate,
  step,
  journalData,
  onConsumptionSelect,
  onFoodSelect,
  onOtherFoodsResponse,
  onMealTimesResponse,
  onTipResponse,
  onSubmit,
  searchTerm,
  onSearchChange,
  filteredFoods,
  selectedFoods,
  personalizedTip
}) => {
  const renderQuickAddSection = () => (
    <div className="quick-add">
      <input
        type="text"
        className="quick-add-search"
        placeholder="Search foods..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <div className="quick-add-results">
        {filteredFoods.map(food => (
          <div 
            key={food.id}
            className={`quick-add-item ${selectedFoods.some(f => f.id === food.id) ? 'selected' : ''}`}
            onClick={() => onFoodSelect(food)}
          >
            <span className="food-icon">{food.icon}</span>
            <span className="food-name">{food.name}</span>
            <span className="food-type">{food.type}</span>
            {selectedFoods.some(f => f.id === food.id) && (
              <span className="check-icon">✓</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="food-journal">
      <div className="journal-dropdown">
        <button
          className={`journal-button ${isOpen ? 'active' : ''}`}
          onClick={onToggle}
        >
          📝
        </button>
        {isOpen && (
          <div className="dropdown-content">
            <div className="dropdown-header">
              <h3>Food Journal</h3>
            </div>
            
            <div className="date-selector">
              <select 
                value={selectedDate} 
                onChange={(e) => onDateChange(e.target.value)}
                className="date-select"
              >
                {pastWeekDates.map(date => (
                  <option key={date} value={date}>
                    {formatDate(date)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="quick-journal">
              {step === 0 && (
                <>
                  <h4>How much of the recommended foods did you eat yesterday?</h4>
                  <div className="response-buttons">
                    {Object.values(FOOD_CONSUMPTION_LEVELS).map(level => (
                      <button 
                        key={level}
                        className={`response-button ${level}`}
                        onClick={() => onConsumptionSelect(level)}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {step === 0.5 && (
                <>
                  {journalData.recommendedFoodConsumption === FOOD_CONSUMPTION_LEVELS.NONE && renderQuickAddSection()}
                  <div className="response-buttons">
                    <h4>Did you eat other foods?</h4>
                    <button 
                      className="response-button"
                      onClick={() => onOtherFoodsResponse('yes')}
                    >
                      Yes
                    </button>
                    <button 
                      className="response-button"
                      onClick={() => onOtherFoodsResponse('no')}
                    >
                      No
                    </button>
                  </div>
                </>
              )}

              {step === 2.5 && (
                <>
                  <h4>Quick Add Foods</h4>
                  {renderQuickAddSection()}
                  <button 
                    className="quick-journal-submit"
                    onClick={() => onMealTimesResponse()}
                  >
                    Continue
                  </button>
                </>
              )}
              
              {step === 1 && (
                <>
                  <h4>Did you eat recommended foods at suggested times?</h4>
                  <div className="response-buttons">
                    <button 
                      className="response-button"
                      onClick={() => onMealTimesResponse('yes')}
                    >
                      Yes
                    </button>
                    <button 
                      className="response-button"
                      onClick={() => onMealTimesResponse('no')}
                    >
                      No
                    </button>
                  </div>
                </>
              )}
              
              {step === 2 && (
                <>
                  <h4>Did you follow your eating tip?</h4>
                  <p className="quick-journal-tip">Tip: {personalizedTip}</p>
                  <div className="response-buttons">
                    <button 
                      className="response-button"
                      onClick={() => onTipResponse('yes')}
                    >
                      Yes
                    </button>
                    <button 
                      className="response-button"
                      onClick={() => onTipResponse('no')}
                    >
                      No
                    </button>
                  </div>
                </>
              )}
              
              {step === 3 && (
                <div className="quick-journal-complete">
                  <h4>Thanks for logging!</h4>
                  {journalData.message && (
                    <p className="quick-journal-tip">{journalData.message}</p>
                  )}
                  <Link 
                    to="/food-journal?date=yesterday" 
                    className="journal-cta"
                  >
                    View Full Journal
                  </Link>
                  <button 
                    className="quick-journal-submit"
                    onClick={onSubmit}
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(FoodJournalPresentation); 