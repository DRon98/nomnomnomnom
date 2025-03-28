import { DUMMY_FOODS } from './constants';
import { getAIRecommendations } from './aiRecommendations';

export const generateRecommendations = async (currentStates, desiredStates, useAI = false) => {
  if (useAI) {
    try {
      return await getAIRecommendations(currentStates, desiredStates);
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
    avoid: foodsToAvoid
  };
};

export const generateMealPlan = (recommendedFoods) => {
  const shuffledFoods = [...recommendedFoods].sort(() => 0.5 - Math.random());
  
  return {
    breakfast: shuffledFoods.slice(0, 2),
    lunch: shuffledFoods.slice(2, 4),
    dinner: shuffledFoods.slice(4, 6),
    snacks: shuffledFoods.slice(6, 8)
  };
}; 