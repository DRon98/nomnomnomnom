/**
 * API client for making requests to the proxy server
 */

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
/**
 * Generates food recommendations using the proxy API
 * @param {Object} userPreferences - Contains all user preferences data
 * @returns {Promise<{recommended: Array, avoid: Array, surveyData: Object, lifestyleData: Object}>}
 */
export const generateRecommendationsFromAPI = async (userPreferences) => {

  try {
    const response = await fetch(`${REACT_APP_API_BASE_URL}/groq/recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userPreferences)
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error calling recommendations API:', error);
    throw error;
  }
}; 


export const generateRecipePreviewsFromAPI = async (recipeFilters) => {
  try {
    const response = await fetch(`${REACT_APP_API_BASE_URL}/groq/recipe-previews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipeFilters)
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error calling recommendations API:', error);
    throw error;
  }
}; 

export const generateRecipeBuilderFromAPI = async (recipeData) => {
  try {
    const response = await fetch(`${REACT_APP_API_BASE_URL}/groq/recipe-builder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipeData)
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error calling recommendations API:', error);
    throw error;
  }
}; 

export const generateMealPlanFromAPI = async (mealPlanData) => {
  try {
    const response = await fetch(`${REACT_APP_API_BASE_URL}/groq/meal-plan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mealPlanData)
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    } 

    return await response.json();
  } catch (error) {
    console.error('Error calling meal plan API:', error);
    throw error;
  } 
};  
//recipe-builder