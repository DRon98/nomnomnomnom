import { DUMMY_FOODS } from './constants';
import { generateAIRecommendations } from './aiRecommendations';

export const generateRecommendations = async (currentStates, desiredStates, userData = null) => {
  // By default, use Groq AI recommendations for day view
  if (userData) {
    try {
      // Use our Groq AI integration
      return await generateAIRecommendations(userData);
    } catch (error) {
      console.error('Failed to get AI recommendations, falling back to default:', error);
      // Fall back to default recommendations if AI fails
    }
  }

  // Default/fallback recommendation logic
  const recommendedFoods = DUMMY_FOODS
    .filter(food => food.recommendation !== 'avoid')
    .sort(() => 0.5 - Math.random())
    .slice(0, 8);

  const foodsToAvoid = DUMMY_FOODS
    .filter(food => food.recommendation === 'avoid')
    .sort(() => 0.5 - Math.random())
    .slice(0, 5);

  return {
    recommended: recommendedFoods,
    avoid: foodsToAvoid,
    // Include empty survey data for consistency when using dummy foods
    surveyData: userData ? userData.surveyData : {},
    lifestyleData: userData ? userData.lifestyleData : {}
  };
};

export const generateMealPlan = (selectedFoods) => {
  if (selectedFoods.length === 0) return {
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: []
  };

  // Helper function to get random number between min and max (inclusive)
  const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Helper function to get random foods for a meal slot
  const getRandomFoodsForMeal = () => {
    // Limit the number of foods based on how many unique foods are available
    const maxPossibleFoods = Math.min(3, selectedFoods.length);
    const numFoods = getRandomInt(1, maxPossibleFoods);
    
    // Create a copy of selectedFoods to track available foods
    const availableFoods = [...selectedFoods];
    const mealFoods = [];
    
    for (let i = 0; i < numFoods; i++) {
      // Get a random food from the remaining available foods
      const randomIndex = Math.floor(Math.random() * availableFoods.length);
      const selectedFood = availableFoods[randomIndex];
      
      // Add the food to meal and remove it from available foods
      mealFoods.push({ ...selectedFood });
      availableFoods.splice(randomIndex, 1);
    }
    
    return mealFoods;
  };
  
  // Generate random foods for each meal type
  return {
    breakfast: getRandomFoodsForMeal(),
    lunch: getRandomFoodsForMeal(),
    dinner: getRandomFoodsForMeal(),
    snacks: getRandomFoodsForMeal()
  };
};