import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import RecipeGenerator from '../../pages/RecipeGenerator';
import SavedRecipesDropdown from '../SavedRecipesDropdown/SavedRecipesDropdown';
import RecipeModal from '../RecipeModal/RecipeModal';
import { FaCheck, FaClock, FaUsers, FaUtensils, FaTimes } from 'react-icons/fa';
import { addMeal } from '../../store/mealTrackingSlice';
import SavedRecipeDetails from '../SavedRecipeDetails/SavedRecipeDetails';
import './styles.css';
import { generateRecipeBuilderFromAPI } from '../../utils/api';
import { useCreateMealPlan } from '../../hooks/useMealPlan';
import { getCurrentUserId } from '../../utils/auth';
import { v4 as uuidv4 } from 'uuid';
const TabbedRecipeGenerator = () => {
  const dispatch = useDispatch();
 
  const selectedFoods = useSelector(state => state.foods.selectedFoods) || [];
  console.log('selectedFoods', selectedFoods);
  const mealTrackingData = useSelector(state => state.mealTracking);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [recipesPerTab, setRecipesPerTab] = useState({});
  const [chosenRecipes, setChosenRecipes] = useState({});
  const [chosenRecipeData, setChosenRecipeData] = useState([]);
  const [savedRecipeTabs, setSavedRecipeTabs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [servingsCount, setServingsCount] = useState(4);
  const [selectedMealType, setSelectedMealType] = useState('Breakfast');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [userId, setUserId] = useState(null);

  const createMealPlanMutation = useCreateMealPlan();
  console.log(selectedFoods);
  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getCurrentUserId();
      setUserId(id);
    };
    fetchUserId();
  }, []);

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

  const handleRecipeChosen = async (recipe) => {
    console.log('Recipe chosen:', recipe);
    //call recipe building llm call 
    //append response to 
    //may take time to await response, so make a seperate payload?
    setChosenRecipes(prev => ({
      ...prev,
      [activeTabIndex]: recipe
    }));
 //   console.log("chosen combo",chosenRecipes)
    const recipeData = {
      title: recipe.name,
      description: recipe.description,
      stats: {
        totalTime: recipe.stats.totalTime,
        calories: recipe.stats.calories,
        servings: recipe.stats.servings
      },
      difficulty: recipe.difficulty || 'medium',
      tags: recipe.tags || [],
      ingredients: recipe.ingredients || [],
      seasonings: recipe.seasonings || []
    }
    
    try {
      const response = await generateRecipeBuilderFromAPI(recipeData);

      // Create the complete recipeBuilder object with all data
      const completeRecipeBuilder = {
        ...recipe,
    
        recipeBuilder: response,
        mealType: selectedMealType
      };
      //    
      // Only update state after we have all the data
      setChosenRecipeData(prev => ([
        ...prev,
         completeRecipeBuilder
      ]));
      
      console.log("chosen combo", chosenRecipeData);

    } catch (error) {
      console.error("Error generating recipe builder:", error);
      // Handle error appropriately
    }

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
 //if (!activeRecipe || isGeneratorTab) return;
  const handleUseRecipe = () => {
   
    
    // Update chosen recipes with the saved recipe
    setChosenRecipes(prev => ({
      ...prev,
      [activeTabIndex]: {
        ...activeRecipe,
        mealType: selectedMealType,
        servings: servingsCount
      }
    }));
console.log("chosen combo",selectedMealType,servingsCount,activeRecipe)
    // Update meal tracking stats
    dispatch(addMeal({
      mealType: selectedMealType,
      servings: servingsCount,
      calories: Math.round(activeRecipe.stats.calories * (servingsCount / activeRecipe.stats.servings))
    }));
  };

  const handleConfirmMealPlan = async () => {
    if (!userId) {
      console.error('No user ID available');
      return;
    }

    try {
      const mealPlanData={
        name: `Meal Plan ${uuidv4()}`,
        recipes: chosenRecipeData
      }

      console.log("mealPlanData", mealPlanData.name)

      console.log("mealPlanData", JSON.stringify(mealPlanData))
      await createMealPlanMutation.mutateAsync({
        userId,
        mealPlanData: mealPlanData
      });
      
      // Close the modal after successful creation
      setIsConfirmModalOpen(false);
      
      // Optionally, you can add a success message or redirect
      console.log('Meal plan created successfully');
    } catch (error) {
      console.error('Error creating meal plan:', error);
      // Handle error appropriately
    }
  };

  return (
    <div className="tabbed-recipe-generator">
      {isConfirmModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Confirm Meal Plan</h2>
              {Object.keys(chosenRecipes).map((name) => (
                <p key={name}>
                  {chosenRecipes[name].name}
                </p>
              ))}
              <button 
                className="close-modal-button"
                onClick={() => setIsConfirmModalOpen(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              {/* Add your meal plan confirmation content here */}
            </div>
            <div className="modal-footer">
              <button 
                className="cancel-button"
                onClick={() => setIsConfirmModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="confirm-button"
                onClick={handleConfirmMealPlan}
                disabled={createMealPlanMutation.isPending}
              >
                {createMealPlanMutation.isPending ? 'Creating...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

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
      
      <div className="confirm-meal-plan-container">
        <button 
          className="confirm-meal-plan-button"
          onClick={() => 
            
            setIsConfirmModalOpen(true)
          
          }
        >
          Confirm Meal Plan
        </button>
      </div>

      <div className="recipe-tab-content">

        {isGeneratorTab ? (
          <RecipeGenerator 
            mealType={selectedFoods[activeTabIndex]?.meal}
            key={`generator-${activeTabIndex}`} 
            baseIngredients={selectedFoods[activeTabIndex]?.base_ingredients_for_grocery_list || []}
            recipes={recipesPerTab[activeTabIndex] || []}
            onRecipesUpdate={handleRecipesUpdate}
            onRecipeChosen={handleRecipeChosen}
            chosenRecipe={chosenRecipes[activeTabIndex]}
            handleUseRecipe={handleUseRecipe}
          />
        ) : (
          <div className="saved-recipe-tab">
            <SavedRecipeDetails
              activeRecipe={activeRecipe}
              servingsCount={servingsCount}
              setServingsCount={setServingsCount}
              selectedMealType={selectedMealType}
              setSelectedMealType={setSelectedMealType}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              handleUseRecipe={handleUseRecipe}
              handleRecipeChosen={handleRecipeChosen}
              chosenRecipes={chosenRecipes}
              activeTabIndex={activeTabIndex}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TabbedRecipeGenerator;