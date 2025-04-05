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

export const generateMealPlan = (recommendedFoods) => {
  const shuffledFoods = [...recommendedFoods].sort(() => 0.5 - Math.random());
  
  const preparedFoods = shuffledFoods.map(food => ({
    ...food
  }));
  
  return {
    breakfast: preparedFoods.slice(0, 2),
    lunch: preparedFoods.slice(2, 4),
    dinner: preparedFoods.slice(4, 6),
    snacks: preparedFoods.slice(6, 8)
  };
};