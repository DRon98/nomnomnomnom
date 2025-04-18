import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import RecipeGenerator from '../../pages/RecipeGenerator';
import SavedRecipesDropdown from '../SavedRecipesDropdown/SavedRecipesDropdown';
import RecipeModal from '../RecipeModal/RecipeModal';
import { FaCheck, FaClock, FaUsers, FaUtensils } from 'react-icons/fa';
import { addMeal } from '../../store/mealTrackingSlice';
import './styles.css';

const TabbedRecipeGenerator = () => {
  const dispatch = useDispatch();
  const selectedFoods = useSelector(state => state.foods.selectedFoods) || [];
  const mealTrackingData = useSelector(state => state.mealTracking);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [recipesPerTab, setRecipesPerTab] = useState({});
  const [chosenRecipes, setChosenRecipes] = useState({});
  const [savedRecipeTabs, setSavedRecipeTabs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [servingsCount, setServingsCount] = useState(4);
  const [selectedMealType, setSelectedMealType] = useState('Breakfast');

  if (!selectedFoods.length) {
    return (
      <div className="no-foods-message">
        No foods selected. Please go back and select foods to generate recipes.
      </div>
    );
  }

  const handleRecipesUpdate = (recipes) => {
    setRecipesPerTab(prev => ({
      ...prev,
      [activeTabIndex]: recipes
    }));
  };

  const handleRecipeChosen = (recipe) => {
    console.log('Recipe chosen:', recipe.name);
    setChosenRecipes(prev => ({
      ...prev,
      [activeTabIndex]: recipe
    }));
    console.log("chosen combo",chosenRecipes)
  };

  const handleAddSavedRecipe = (recipe) => {
    setSavedRecipeTabs(prev => [...prev, recipe]);
  };

  // Calculate statistics
  const calculateStats = (mealType) => {
    const data = mealTrackingData[mealType];
    if (!data || data.count === 0) {
      return { servings: 0, avgCalories: 0 };
    }
    const avgCalories = Math.round(data.totalCalories / data.count);
    return { servings: data.totalServings, avgCalories };
  };

  const breakfastStats = calculateStats('Breakfast');
  const mainStats = calculateStats('Main(Lunch/Dinner)');
  const snackStats = calculateStats('Snack');
  const dessertStats = calculateStats('Dessert');

  const totalWeeklyCalories = (breakfastStats.servings * breakfastStats.avgCalories) + 
                             (mainStats.servings * mainStats.avgCalories) + 
                             (snackStats.servings * snackStats.avgCalories) + 
                             (dessertStats.servings * dessertStats.avgCalories);
  const avgDailyCalories = Math.round(totalWeeklyCalories / 7);
  const eatingOutCount = 4;

  const isGeneratorTab = activeTabIndex < selectedFoods.length;
  const activeRecipe = isGeneratorTab ? chosenRecipes[activeTabIndex] : savedRecipeTabs[activeTabIndex - selectedFoods.length];

  const handleUseRecipe = () => {
    if (!activeRecipe || isGeneratorTab) return;
    
    // Update chosen recipes with the saved recipe
    setChosenRecipes(prev => ({
      ...prev,
      [activeTabIndex]: {
        ...activeRecipe,
        mealType: selectedMealType,
        servings: servingsCount
      }
    }));

    // Update meal tracking stats
    dispatch(addMeal({
      mealType: selectedMealType,
      servings: servingsCount,
      calories: Math.round(activeRecipe.stats.calories * (servingsCount / activeRecipe.stats.servings))
    }));
  };

  return (
    <div className="tabbed-recipe-generator">
      <div className="placeholder-container meal-stats-container">
        <span><strong>Breakfast:</strong> {breakfastStats.servings} servings, {breakfastStats.avgCalories} avg calories</span>
        <span><strong>Main (Lunch/Dinner):</strong> {mainStats.servings} servings, {mainStats.avgCalories} avg calories</span>
        <span><strong>Snacks:</strong> {snackStats.servings} servings, {snackStats.avgCalories} avg calories</span>
        <span><strong>Desserts:</strong> {dessertStats.servings} servings, {dessertStats.avgCalories} avg calories</span>
        <span><strong>Eating Out:</strong> {eatingOutCount} times/week</span>
        <span><strong>Avg Daily Calories:</strong> {avgDailyCalories} calories</span>
      </div>
      <div className="recipe-tabs">
        <SavedRecipesDropdown onAddRecipe={handleAddSavedRecipe} />
        {selectedFoods.map((food, index) => (
          <button
            key={food.id}
            className={`recipe-tab ${index === activeTabIndex ? 'active' : ''} ${chosenRecipes[index] ? 'has-chosen-recipe' : ''}`}
            onClick={() => setActiveTabIndex(index)}
          >
            {`Recipe ${index + 1}`}
            <span className="tab-food-name">{food.name}</span>
            {chosenRecipes[index] && (
              <span className="recipe-chosen-check">
                <FaCheck />
              </span>
            )}
          </button>
        ))}
        {savedRecipeTabs.map((recipe, index) => (
          <button
            key={`saved-${index}`}
            className={`recipe-tab ${selectedFoods.length + index === activeTabIndex ? 'active' : ''} ${chosenRecipes[selectedFoods.length + index] ? 'has-chosen-recipe' : ''}`}
            onClick={() => setActiveTabIndex(selectedFoods.length + index)}
          >
            {`Recipe ${selectedFoods.length + index + 1}`}
            <span className="tab-food-name">{recipe.name}</span>
            {chosenRecipes[selectedFoods.length + index] && (
              <span className="recipe-chosen-check">
                <FaCheck />
              </span>
            )}
          </button>
        ))}
      </div>
      
      <div className="recipe-tab-content">

        {isGeneratorTab ? (
          <RecipeGenerator 
            key={`generator-${activeTabIndex}`} 
            baseIngredients={selectedFoods[activeTabIndex]?.base_ingredients_for_grocery_list || []}
            recipes={recipesPerTab[activeTabIndex] || []}
            onRecipesUpdate={handleRecipesUpdate}
            onRecipeChosen={handleRecipeChosen}
            chosenRecipe={chosenRecipes[activeTabIndex]}
          />
        ) : (
          <div className="saved-recipe-tab">
            {console.log(activeRecipe)}
            {activeRecipe && (
              <div className="saved-recipe-details">
                <div className="saved-recipe-header">
                  <h2>{activeRecipe.name}</h2>
                  <p className="description">{activeRecipe.description}</p>
                </div>

                <div className="saved-recipe-stats">
                  <div className="stat-item">
                    <FaClock /> {activeRecipe.stats.totalTime} min
                  </div>
                  <div className="stat-item">
                    <FaUsers /> {servingsCount} servings
                  </div>
                  <div className="stat-item">
                    <FaUtensils /> {Math.round(activeRecipe.stats.calories)} cal/serving
                  </div>
                </div>

                <div className="saved-recipe-controls">
                  <div className="control-group">
                    <label>Servings:</label>
                    <input
                      type="number"
                      min="1"
                      value={servingsCount}
                      onChange={(e) => setServingsCount(Math.max(1, parseInt(e.target.value) || 1))}
                    />
                  </div>
                  <div className="control-group">
                    <label>Meal Type:</label>
                    <select
                      value={selectedMealType}
                      onChange={(e) => setSelectedMealType(e.target.value)}
                    >
                      <option value="Breakfast">Breakfast</option>
                      <option value="Main(Lunch/Dinner)">Main (Lunch/Dinner)</option>
                      <option value="Snack">Snack</option>
                      <option value="Dessert">Dessert</option>
                    </select>
                  </div>
                </div>

                <div className="saved-recipe-ingredients">
                  <h3>Ingredients</h3>
                  <ul>
                    {activeRecipe.recipeBuilderData.ingredients.map((ingredient, index) => (
                      <li key={index}>
                        {ingredient.quantity} {ingredient.unit} {ingredient.name}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="saved-recipe-actions">
                  <button 
                    className="view-recipe-button"
                    onClick={() => setIsModalOpen(true)}
                  >
                    View Recipe
                  </button>
                  <button 
                    className="use-recipe-button"
                    onClick={handleUseRecipe}
                  >
                    Use Recipe
                  </button>
                </div>

                <RecipeModal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  selectedRecipe={activeRecipe}
                  chosenRecipe={chosenRecipes[activeTabIndex]}
                  onRecipeChosen={handleRecipeChosen}
                  recipeBuilderData={{
                    title: activeRecipe.name,
                    description: activeRecipe.description,
                    stats: activeRecipe.stats,
                    difficulty: activeRecipe.difficulty || 'medium',
                    tags: activeRecipe.tags || [],
                    ingredients: activeRecipe.ingredients || [],
                    seasonings: activeRecipe.seasonings || []
                  }}
                  mealType={selectedMealType}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TabbedRecipeGenerator;