import { generateRecommendationsFromAPI,generateRecipePreviewsFromAPI,generateRecipeBuilderFromAPI } from './api';

/**
 * Generates food recommendations using the proxy API
 * @param {Object} userPreferences - Contains all user preferences data
 * @returns {Promise<{recommended: Array, avoid: Array}>} - Arrays of recommended foods and foods to avoid
 */
export const generateAIRecommendations = async (userPreferences) => {
  try {
    // Call the proxy API to get recommendations
    const { recommended, avoid, surveyData, lifestyleData } = await generateRecommendationsFromAPI(userPreferences);

    return {
      recommended,
      avoid,
      surveyData: userPreferences.surveyData,
      lifestyleData: userPreferences.lifestyleData
    };
  } catch (error) {
    console.error('Error generating AI recommendations:', error);
    throw error;
  }
};

// export const generateRecipePreviews = async (recipeFilters) => {
//   try {

//     const { recipes } = await generateRecipePreviewsFromAPI(recipeFilters);
//     return recipes;
//   } 
//   catch (error) {
//     console.error('Error generating recipe previews:', error);
//     throw error;
//   }
// };

// export const generateRecipeBuilder = async (recipeData) => {
//   try {
//     const { recipe } = await generateRecipeBuilderFromAPI(recipeData);
//     return recipe;
//   }
//   catch (error) {
//     console.error('Error generating recipe builder:', error);
//     throw error;
//   }
// };