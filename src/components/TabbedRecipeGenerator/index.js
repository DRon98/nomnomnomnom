import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import RecipeGenerator from '../../pages/RecipeGenerator';
import { FaCheck } from 'react-icons/fa';
import './styles.css';

const TabbedRecipeGenerator = () => {
  const selectedFoods = useSelector(state => state.foods.selectedFoods) || [];
  const mealTrackingData = useSelector(state => state.mealTracking);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [recipesPerTab, setRecipesPerTab] = useState({});
  const [chosenRecipes, setChosenRecipes] = useState({});

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
    // Note: Dispatching addMeal would happen here or in RecipeGenerator
    // based on where the 'mealType', 'servings', 'calories' are determined.
    // For now, we assume mealTrackingData is updated elsewhere.
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
  const eatingOutCount = 4; // Hardcoded as per requirement

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
      </div>
      
      <div className="recipe-tab-content">
        <RecipeGenerator 
          key={`generator-${activeTabIndex}`} 
          baseIngredients={selectedFoods[activeTabIndex]?.base_ingredients_for_grocery_list || []}
          recipes={recipesPerTab[activeTabIndex] || []}
          onRecipesUpdate={handleRecipesUpdate}
          onRecipeChosen={handleRecipeChosen}
          chosenRecipe={chosenRecipes[activeTabIndex]}
        />
      </div>
    </div>
  );
};

export default TabbedRecipeGenerator;