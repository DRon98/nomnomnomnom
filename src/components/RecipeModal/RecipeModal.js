import React, { useState, useEffect } from 'react';
import { FaTimes, FaClock, FaUsers, FaUtensils } from 'react-icons/fa';
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
  const [activeTab, setActiveTab] = useState('details'); // 'details' or 'builder'
  const [isDataLoading, setIsDataLoading] = useState(false);

  // Trigger recipe builder data loading when modal opens
  useEffect(() => {
    if (isOpen && !recipeBuilderData && !isDataLoading) {
      setIsDataLoading(true);
      // This assumes recipeBuilderData is being loaded through a prop
      // If you have a direct way to trigger the LLM call, you should call it here
      onRecipeChosen?.(selectedRecipe);
    }
  }, [isOpen, recipeBuilderData, isDataLoading, selectedRecipe, onRecipeChosen]);

  // Reset loading state when data is received
  useEffect(() => {
    if (recipeBuilderData) {
      setIsDataLoading(false);
    }
  }, [recipeBuilderData]);

  if (!isOpen) return null;

  const renderRecipePreview = () => {
    if (!selectedRecipe) {
      return (
        <div className="empty-preview">
          <FaUtensils />
          <p>No recipe selected</p>
        </div>
      );
    }

    return (
      <div className="recipe-preview-content">
        <div className="preview-header">
          <h2>{selectedRecipe.name}</h2>
        </div>

        <div className="preview-stats">
          <div><FaClock /> {selectedRecipe.stats.totalTime} min</div>
          <div><FaUsers /> {selectedRecipe.stats.servings} servings</div>
          <div><FaUtensils /> {selectedRecipe.stats.calories} cal</div>
        </div>
             
        <div className="preview-tables">
          <div className="ingredients-table">
            <h3>Ingredients</h3>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th>Unit</th>
                </tr>
              </thead>
              <tbody>
                {selectedRecipe.ingredients.map((ingredient, index) => (
                  <tr key={index}>
                    <td>{ingredient.name}</td>
                    <td>{ingredient.quantity}</td>
                    <td>{ingredient.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="seasonings-table">
            <h3>Seasonings</h3>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th>Unit</th>
                </tr>
              </thead>
              <tbody>
                {selectedRecipe.seasonings.map((seasoning, index) => (
                  <tr key={index}>
                    <td>{seasoning.name}</td>
                    <td>{seasoning.quantity}</td>
                    <td>{seasoning.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content recipe-modal" onClick={e => e.stopPropagation()}>
       
          <button 
            className="close-modal"
            onClick={onClose}
          >
            <FaTimes />
          </button>
  
        
        <div className="modal-tabs">
          <button 
            className={`tab-button ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Recipe Details
          </button>
          <button 
            className={`tab-button ${activeTab === 'builder' ? 'active' : ''}`}
            onClick={() => setActiveTab('builder')}
          >
            Recipe Builder
            {isDataLoading && <span className="loading-dot-animation">...</span>}
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'details' ? (
            <div className="recipe-details">
              {/* Content for the first tab will go here */}
              {renderRecipePreview()}
            </div>
          ) : null}
          <RecipeBuilder 
            recipeData={recipeBuilderData} 
            hide={activeTab !== 'builder'}
          />
        </div>
      </div>
    </div>
  );
};

export default RecipeModal; 