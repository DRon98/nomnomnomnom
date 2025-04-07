import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './styles.css';

const CATEGORIES = [
  {
    id: 'morning',
    name: 'Morning Routine',
    color: '#4CAF50', // Green
    description: 'Waking up, breakfast, and preparing for the day'
  },
  {
    id: 'focused',
    name: 'Focused Work/Study',
    color: '#FFD700', // Yellow
    description: 'Work, studying, or mentally demanding tasks'
  },
  {
    id: 'fitness',
    name: 'Physical Activity',
    color: '#FF5252', // Red
    description: 'Fitness activities like working out, running, or yoga'
  },
  {
    id: 'social',
    name: 'Socializing',
    color: '#FF9800', // Orange
    description: 'Hanging out with friends, family, or attending events'
  },
  {
    id: 'unwind',
    name: 'Unwinding/Relaxing',
    color: '#2196F3', // Blue
    description: 'Relaxing activities like watching TV, reading, or meditating'
  },
  {
    id: 'tasks',
    name: 'General Tasks/Errands',
    color: '#64B5F6', // Light Blue
    description: 'Chores, shopping, or other daily tasks'
  }
];

const CategoryBubbles = ({ onAddEvent, days }) => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // Generate time slots from 6 AM to 6 AM the next day
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = (i + 6) % 24;
    return `${String(hour).padStart(2, '0')}:00`;
  });

  const handleCategoryClick = (categoryId) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
      resetForm();
    } else {
      setExpandedCategory(categoryId);
      resetForm();
    }
  };

  const resetForm = () => {
    setSelectedDays([]);
    setStartTime('');
    setEndTime('');
  };

  const toggleDay = (day) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const handleSubmit = (category) => {
    if (selectedDays.length === 0 || !startTime || !endTime) {
      alert('Please select days and times');
      return;
    }

    const startHour = parseInt(startTime.split(':')[0]);
    const endHour = parseInt(endTime.split(':')[0]);
    
    // Allow events to cross midnight (e.g., 23:00 to 02:00)
    if (startHour >= endHour && !(startHour >= 18 && endHour <= 6)) {
      alert('End time must be after start time or cross midnight');
      return;
    }

    onAddEvent({
      title: category.name,
      days: selectedDays,
      startTime,
      endTime,
      color: category.color
    });

    setExpandedCategory(null);
    resetForm();
  };

  return (
    <div className="category-bubbles">
      {CATEGORIES.map(category => (
        <div key={category.id} className="category-container">
          <button
            className="category-bubble"
            style={{ backgroundColor: category.color }}
            onClick={() => handleCategoryClick(category.id)}
            title={category.description}
          >
            {category.name}
            {expandedCategory === category.id ? <FaChevronUp /> : <FaChevronDown />}
          </button>

          {expandedCategory === category.id && (
            <div className="category-dropdown">
              <div className="days-selection">
                <label>Select Days:</label>
                <div className="days-buttons">
                  {days.map(day => (
                    <button
                      key={day}
                      type="button"
                      className={`day-button ${selectedDays.includes(day) ? 'selected' : ''}`}
                      onClick={() => toggleDay(day)}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="time-selection">
                <div className="time-input">
                  <label>Start Time:</label>
                  <select
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  >
                    <option value="">Select time</option>
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>

                <div className="time-input">
                  <label>End Time:</label>
                  <select
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  >
                    <option value="">Select time</option>
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                className="add-category-event"
                onClick={() => handleSubmit(category)}
              >
                Add to Calendar
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CategoryBubbles; 