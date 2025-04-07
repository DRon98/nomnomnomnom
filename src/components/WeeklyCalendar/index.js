import React, { useState, useEffect } from 'react';
import './styles.css';

const WeeklyCalendar = () => {
  // Get the current date and calculate the start of the week (Sunday)
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Generate array of days for the week
  const getDaysOfWeek = () => {
    const days = [];
    const startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() - currentDate.getDay()); // Go to Sunday

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push({
        date: date.getDate(),
        day: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
        isToday: date.toDateString() === new Date().toDateString()
      });
    }
    return days;
  };

  // Generate time slots (3-hour intervals from 6 AM to 6 AM next day)
  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour <= 24; hour += 3) { // Go up to 30 to reach 6 AM next day
      const displayHour = hour % 24;
      const period = displayHour >= 12 ? 'PM' : 'AM';
      const formattedHour = displayHour === 0 ? 12 : displayHour > 12 ? displayHour - 12 : displayHour;
      slots.push(`${formattedHour} ${period}`);
    }
    return slots;
  };

  const days = getDaysOfWeek();
  const timeSlots = getTimeSlots();

  return (
    <div className="weekly-calendar">
      
      <div className="calendar-grid">
        {/* Header row with days */}
        <div className="time-column">
          {/* Empty cell for alignment */}
          <div className="header-cell"></div>
          {/* Time slots */}
          {timeSlots.map((time, index) => (
            <div key={index} className="time-cell">
              {time}
            </div>
          ))}
        </div>

        {/* Day columns */}
        {days.map((day, dayIndex) => (
          <div key={dayIndex} className="day-column">
            {/* Day header */}
            <div className={`header-cell ${day.isToday ? 'today' : ''}`}>
        
              <div className="date-label">{day.day} {day.date}</div>
            </div>
            {/* Time slots for this day */}
            {timeSlots.map((_, slotIndex) => (
              <div key={slotIndex} className="calendar-cell">
                {/* Content will go here */}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyCalendar; 