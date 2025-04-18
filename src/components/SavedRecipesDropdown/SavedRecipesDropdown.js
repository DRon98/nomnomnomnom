import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaPlus, FaChevronDown } from 'react-icons/fa';
import './SavedRecipesDropdown.css';

const SavedRecipesDropdown = ({ onAddRecipe }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const favoriteRecipes = useSelector(state => state.favorites.recipes);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Position menu when opened
  useEffect(() => {
    if (isOpen && buttonRef.current && menuRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const menuRect = menuRef.current.getBoundingClientRect();
      
      // Position menu below the button
      menuRef.current.style.top = `${buttonRect.bottom + window.scrollY + 8}px`;
      menuRef.current.style.left = `${buttonRect.left + window.scrollX}px`;
    }
  }, [isOpen]);

  const handleAddRecipe = (recipe) => {
    onAddRecipe(recipe);
    setIsOpen(false);
  };

  return (
    <div className="saved-recipes-dropdown" ref={dropdownRef}>
      <button 
        ref={buttonRef}
        className="saved-recipes-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        Add Saved Recipes
        <FaChevronDown className={`chevron ${isOpen ? 'open' : ''}`} />
      </button>
      {isOpen && (
        <div className="saved-recipes-menu" ref={menuRef}>
          {favoriteRecipes.length > 0 ? (
            favoriteRecipes.map(recipe => (
              <div key={recipe.recipe_id} className="saved-recipe-item">
                <span>{recipe.name}</span>
                <button 
                  className="add-recipe-button"
                  onClick={() => handleAddRecipe(recipe)}
                >
                  <FaPlus />
                </button>
              </div>
            ))
          ) : (
            <div className="no-saved-recipes">
              No saved recipes yet
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SavedRecipesDropdown; 