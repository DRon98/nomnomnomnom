import React from 'react';
import { FaTimes } from 'react-icons/fa';
import RecipeBuilder from '../../pages/RecipeBuilder';
import './RecipeModal.css';

const RecipeModal = ({
  isOpen,
  onClose,
  selectedRecipe,
  chosenRecipe,
  onRecipeChosen,
  recipeBuilderData,
  mealType
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content recipe-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <button 
            className="close-modal"
            onClick={onClose}
          >
            <FaTimes />
          </button>
        </div>
        <RecipeBuilder recipeData={recipeBuilderData} />
      </div>
    </div>
  );
};

export default RecipeModal; 