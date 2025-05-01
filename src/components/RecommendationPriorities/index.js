import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setPriorities, selectPriorities } from '../../redux/slices/prioritiesSlice';
import './styles.css';

const PRIORITY_OPTIONS = [
  { id: 'favorite-foods', label: 'Favorite Foods', icon: '🍽️' },
  { id: 'ethnic-cuisines', label: 'Ethnic Cuisines', icon: '🌎' },
  { id: 'moods', label: 'Moods', icon: '😊' },
  { id: 'affordable', label: 'Affordable Options', icon: '💰' },
  { id: 'diet-goals', label: 'Diet Goals', icon: '🎯' }
];

const RecommendationPriorities = () => {
  const dispatch = useDispatch();
  const selectedPriorities = useSelector(selectPriorities);

  const handlePriorityChange = (priorityId) => {
    const newPriorities = selectedPriorities.includes(priorityId)
      ? selectedPriorities.filter(id => id !== priorityId)
      : [...selectedPriorities, priorityId];
    
    dispatch(setPriorities(newPriorities));
  };

  return (
    <div className="recommendation-priorities">
      {PRIORITY_OPTIONS.map(({ id, label, icon }) => (
        <label key={id} className="priority-option">
          <input
            type="checkbox"
            name="priorities"
            value={id}
            checked={selectedPriorities.includes(id)}
            onChange={() => handlePriorityChange(id)}
            className="priority-checkbox"
          />
          <span className="priority-label">
            <span className="priority-icon">{icon}</span>
            {label}
          </span>
        </label>
      ))}
    </div>
  );
};

export default RecommendationPriorities; 