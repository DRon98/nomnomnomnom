import React, { memo } from 'react';
import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa';

const RecipeDetails = memo(({
  selectedStep,
  onUpdateStep,
  onDeleteStep,
  ingredients,
  onAddIngredient,
  onRemoveIngredient
}) => {
  if (!selectedStep) {
    return (
      <div className="recipe-details empty-state">
        <p>Select a step to view and edit details</p>
      </div>
    );
  }

  return (
    <div className="recipe-details">
      <div className="step-details">
        <h3>Step Details</h3>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={selectedStep.name}
            onChange={(e) => onUpdateStep({ ...selectedStep, name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={selectedStep.description}
            onChange={(e) => onUpdateStep({ ...selectedStep, description: e.target.value })}
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Duration (minutes)</label>
            <input
              type="number"
              value={selectedStep.duration}
              onChange={(e) => onUpdateStep({ ...selectedStep, duration: parseInt(e.target.value) })}
            />
          </div>
          <div className="form-group">
            <label>Intensity</label>
            <select
              value={selectedStep.intensity}
              onChange={(e) => onUpdateStep({ ...selectedStep, intensity: e.target.value })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
      </div>

      <div className="ingredients-section">
        <h3>Ingredients</h3>
        <div className="ingredients-list">
          {ingredients.map((ingredient, index) => (
            <div key={index} className="ingredient-item">
              <span>{ingredient}</span>
              <button
                className="remove-btn"
                onClick={() => onRemoveIngredient(index)}
              >
                <FaMinus />
              </button>
            </div>
          ))}
          <button
            className="add-ingredient-btn"
            onClick={onAddIngredient}
          >
            <FaPlus /> Add Ingredient
          </button>
        </div>
      </div>

      <div className="step-actions">
        <button
          className="delete-step-btn"
          onClick={() => onDeleteStep(selectedStep.id)}
        >
          <FaTrash /> Delete Step
        </button>
      </div>
    </div>
  );
});

RecipeDetails.displayName = 'RecipeDetails';

export default RecipeDetails; 