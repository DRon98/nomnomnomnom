import React, { useState, useRef } from 'react';
import { FaPlus, FaTimes, FaSave } from 'react-icons/fa';
import CategoryBubbles from './CategoryBubbles';
import './styles.css';

// Map category names to JSON keys
const CATEGORY_TO_KEY_MAP = {
  'Morning Routine': 'morning_routine',
  'Focused Work/Study': 'focused_working',
  'Physical Activity': 'fitness',
  'Socializing': 'socialization',
  'Unwinding/Relaxing': 'general_tasks_or_unwinding',
  'General Tasks/Errands': 'general_tasks_or_unwinding'
};

const WeeklyCalendar = () => {
  const [events, setEvents] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [draggedEvent, setDraggedEvent] = useState(null);
  const [resizingEvent, setResizingEvent] = useState(null);
  const [resizeType, setResizeType] = useState(null); // 'top' or 'bottom'
  const gridRef = useRef(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    days: [],
    startTime: '',
    endTime: '',
    color: '#3498db'
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  // Generate time slots from 6 AM to 6 AM the next day
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = (i + 6) % 24; // Start from 6 AM and wrap around
    return `${String(hour).padStart(2, '0')}:00`;
  });

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (newEvent.title && newEvent.days.length > 0 && newEvent.startTime && newEvent.endTime) {
      const startHour = parseInt(newEvent.startTime.split(':')[0]);
      const endHour = parseInt(newEvent.endTime.split(':')[0]);
      
      // Allow events to cross midnight (e.g., 23:00 to 02:00)
      // Only validate if end time is before start time and not crossing midnight
      if (startHour >= endHour && !(startHour >= 18 && endHour <= 6)) {
        alert('End time must be after start time or cross midnight');
        return;
      }

      // Create an event for each selected day
      const newEvents = newEvent.days.map(day => ({
        ...newEvent,
        id: Date.now() + Math.random(), // Ensure unique IDs
        day: day
      }));

      setEvents([...events, ...newEvents]);
      setShowAddModal(false);
      setNewEvent({
        title: '',
        days: [],
        startTime: '',
        endTime: '',
        color: '#3498db'
      });
    } else {
      alert('Please fill in all fields and select at least one day');
    }
  };

  const handleCategoryEventAdd = (eventData) => {
    const newEvents = eventData.days.map(day => ({
      ...eventData,
      id: Date.now() + Math.random(),
      day: day
    }));
    setEvents([...events, ...newEvents]);
  };

  const handleDragStart = (event, e) => {
    e.stopPropagation();
    setDraggedEvent(event);
    // Add drag ghost image styling
    const dragImage = e.target.cloneNode(true);
    dragImage.style.opacity = '0.5';
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    // Remove the ghost image after it's no longer needed
    requestAnimationFrame(() => document.body.removeChild(dragImage));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!draggedEvent || !gridRef.current) return;

    const gridRect = gridRef.current.getBoundingClientRect();
    const mouseY = e.clientY - gridRect.top;
    const rowHeight = gridRect.height / 24;
    const gridPosition = Math.floor(mouseY / rowHeight);

    if (gridPosition >= 0 && gridPosition < 24) {
      // Convert grid position to actual hour (6 AM to 6 AM next day)
      const newStartHour = (gridPosition + 6) % 24;
      
      // Calculate duration of the event
      const startHour = parseInt(draggedEvent.startTime.split(':')[0]);
      const endHour = parseInt(draggedEvent.endTime.split(':')[0]);
      const duration = endHour > startHour ? endHour - startHour : (endHour + 24) - startHour;
      
      // Calculate new end hour, wrapping around midnight if needed
      const newEndHour = (newStartHour + duration) % 24;

      // Format the times with leading zeros
      const formattedStartTime = `${String(newStartHour).padStart(2, '0')}:00`;
      const formattedEndTime = `${String(newEndHour).padStart(2, '0')}:00`;
      
      // Only update if the times have changed
      if (formattedStartTime !== draggedEvent.startTime || formattedEndTime !== draggedEvent.endTime) {
        const updatedEvent = {
          ...draggedEvent,
          startTime: formattedStartTime,
          endTime: formattedEndTime
        };
        
        // Update the dragged event immediately
        setDraggedEvent(updatedEvent);
        
        // Update the event in the events array
        setEvents(events.map(e => 
          e.id === draggedEvent.id ? updatedEvent : e
        ));
      }
    }
  };

  const handleDragEnd = () => {
    setDraggedEvent(null);
  };

  const getEventStyle = (event) => {
    const startHour = parseInt(event.startTime.split(':')[0]);
    const endHour = parseInt(event.endTime.split(':')[0]);
    const duration = endHour > startHour ? endHour - startHour : (endHour + 24) - startHour;
    
    // Adjust grid row to account for 6 AM start
    // If startHour < 6, it's on the next day (after midnight)
    const adjustedStartHour = startHour < 6 ? startHour + 18 : startHour - 6;
    
    const style = {
      backgroundColor: event.color,
      gridRow: `${adjustedStartHour + 1} / span ${duration}`,
      gridColumn: days.indexOf(event.day) + 2, // Offset by 2 to account for time column
    };

    // Add transition for smooth movement, but only when not dragging
    if (!draggedEvent || draggedEvent.id !== event.id) {
      style.transition = 'all 0.2s ease';
    }
    
    return style;
  };

  const handleDeleteEvent = (eventId, e) => {
    e.stopPropagation();
    setEvents(events.filter(event => event.id !== eventId));
  };

  const toggleDay = (day) => {
    const updatedDays = newEvent.days.includes(day)
      ? newEvent.days.filter(d => d !== day)
      : [...newEvent.days, day];
    setNewEvent({ ...newEvent, days: updatedDays });
  };

  const formatEventsForSave = () => {
    // Initialize structure with all days
    const formattedData = days.reduce((acc, day) => {
      acc[day.toLowerCase()] = [];
      return acc;
    }, {});

    // Group events by day
    const eventsByDay = events.reduce((acc, event) => {
      const dayKey = event.day.toLowerCase();
      if (!acc[dayKey]) acc[dayKey] = [];
      
      // Map the category name to the desired key format
      const categoryKey = CATEGORY_TO_KEY_MAP[event.title] || event.title.toLowerCase().replace(/\s+/g, '_');
      
      // Create the event object in the desired format
      const formattedEvent = {
        [categoryKey]: [{
          start_time: event.startTime,
          end_time: event.endTime
        }]
      };
      
      acc[dayKey].push(formattedEvent);
      return acc;
    }, formattedData);

    return eventsByDay;
  };

  const handleSave = () => {
    const formattedData = formatEventsForSave();
   // console.log(JSON.stringify(formattedData, null, 2));
    console.log(formattedData);
  };

  const handleResizeStart = (event, type, e) => {
    e.stopPropagation();
    setResizingEvent(event);
    setResizeType(type);
  };

  const handleResizeMove = (e) => {
    if (!resizingEvent || !gridRef.current) return;

    const gridRect = gridRef.current.getBoundingClientRect();
    const mouseY = e.clientY - gridRect.top;
    const rowHeight = gridRect.height / 24;
    const gridPosition = Math.floor(mouseY / rowHeight);
    
    // Convert grid position to actual hour (6 AM to 6 AM next day)
    const newHour = ((gridPosition + 6) % 24);
    const formattedHour = `${String(newHour).padStart(2, '0')}:00`;

    // Get the current start and end times
    const startHour = parseInt(resizingEvent.startTime.split(':')[0]);
    const endHour = parseInt(resizingEvent.endTime.split(':')[0]);

    // Update either start or end time based on resize type
    let updatedEvent = { ...resizingEvent };
    if (resizeType === 'top') {
      // Don't allow start time to go past end time
      if (newHour < endHour || (newHour > endHour && newHour >= 18 && endHour <= 6)) {
        updatedEvent.startTime = formattedHour;
      }
    } else {
      // Don't allow end time to be before start time
      if (newHour > startHour || (newHour < startHour && startHour >= 18 && newHour <= 6)) {
        updatedEvent.endTime = formattedHour;
      }
    }

    setEvents(events.map(e => 
      e.id === resizingEvent.id ? updatedEvent : e
    ));
  };

  const handleResizeEnd = () => {
    setResizingEvent(null);
    setResizeType(null);
  };

  return (
    <div className="weekly-calendar-container">
      <div className="calendar-header">
        <h2>Weekly Calendar</h2>
        <div className="calendar-actions">
          <button 
            className="save-button"
            onClick={handleSave}
          >
            <FaSave /> Save Schedule
          </button>
          <button 
            className="add-event-button"
            onClick={() => setShowAddModal(true)}
          >
            <FaPlus /> Add Event
          </button>
        </div>
      </div>

      <CategoryBubbles onAddEvent={handleCategoryEventAdd} days={days} />

      <div className="calendar-grid">
        <div className="days-grid">
          <div className="days-header">
            <div className="day-header"></div>
            {days.map(day => (
              <div key={day} className="day-header">
                {day}
              </div>
            ))}
          </div>

          <div 
            ref={gridRef}
            className="events-grid"
            onDragOver={handleDragOver}
            onMouseMove={handleResizeMove}
            onMouseUp={handleResizeEnd}
            onMouseLeave={handleResizeEnd}
          >
            {/* Time slot lines */}
            {timeSlots.map((time, index) => (
              <React.Fragment key={`time-${index}`}>
                <div className="time-label" style={{ gridRow: index + 1 }}>{time}</div>
                <div className="time-slot-line" style={{ gridRow: index + 1 }}></div>
              </React.Fragment>
            ))}

            {/* Events */}
            {events.map(event => (
              <div
                key={event.id}
                className={`calendar-event ${resizingEvent?.id === event.id ? 'resizing' : ''}`}
                style={getEventStyle(event)}
                draggable={!resizingEvent}
                onDragStart={(e) => handleDragStart(event, e)}
                onDragEnd={handleDragEnd}
              >
                <div 
                  className="resize-handle top"
                  onMouseDown={(e) => handleResizeStart(event, 'top', e)}
                />
                <div className="event-title">{event.title}</div>
                <div className="event-time">
                  {event.startTime} - {event.endTime}
                </div>
                <button 
                  className="delete-event"
                  onClick={(e) => handleDeleteEvent(event.id, e)}
                >
                  <FaTimes />
                </button>
                <div 
                  className="resize-handle bottom"
                  onMouseDown={(e) => handleResizeStart(event, 'bottom', e)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Event</h3>
              <button 
                className="close-modal"
                onClick={() => setShowAddModal(false)}
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleAddEvent}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Event title"
                />
              </div>

              <div className="form-group">
                <label>Days (Select multiple)</label>
                <div className="days-multiselect">
                  {days.map(day => (
                    <button
                      key={day}
                      type="button"
                      className={`day-button ${newEvent.days.includes(day) ? 'selected' : ''}`}
                      onClick={() => toggleDay(day)}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Time</label>
                  <select
                    value={newEvent.startTime}
                    onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                  >
                    <option value="">Select time</option>
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>End Time</label>
                  <select
                    value={newEvent.endTime}
                    onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                  >
                    <option value="">Select time</option>
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Color</label>
                <input
                  type="color"
                  value={newEvent.color}
                  onChange={(e) => setNewEvent({ ...newEvent, color: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddModal(false)} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="add-btn">
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyCalendar;