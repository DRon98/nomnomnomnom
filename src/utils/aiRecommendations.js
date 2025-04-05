import { Groq } from 'groq-sdk';

/**
 * Generates food recommendations using the Groq API
 * @param {Object} userPreferences - Contains all user preferences data
 * @returns {Promise<{recommended: Array, avoid: Array}>} - Arrays of recommended foods and foods to avoid
 */
export const generateAIRecommendations = async (userPreferences) => {
  try {
    console.log(process.env.GROQ_API_KEY);
    const groq = new Groq({
      apiKey: 'g',
   
    });
    
    // Create a prompt for Groq based on user preferences
    const prompt = `
      You are a nutrition expert AI assistant. Based on the following user data, generate food recommendations.
      The user has these preferences and needs:
      
      Current feelings: ${userPreferences.currentFeelings.join(', ')}
      Desired feelings: ${userPreferences.desiredFeelings.join(', ')}
      
      Dietary restrictions: ${userPreferences.surveyData?.dietaryRestrictions?.join(', ') || 'None'}
      
      Food preferences: ${JSON.stringify(userPreferences.foodPreferences)}
      
      Pantry items: ${userPreferences.pantryManager?.items?.map(item => item.name).join(', ') || 'None'}
      
      Lifestyle data: ${JSON.stringify(userPreferences.lifestyleData)}
      
      Please generate two JSON arrays:
      1. An array of recommended foods that would help the user move from their current feelings to their desired feelings, considering their dietary restrictions and preferences
      2. An array of foods they should avoid based on the same criteria
      
      Each food item in both arrays should follow this structure:
      {
        "id": "unique_id", // A unique identifier for the food
        "name": "Food Name", // The name of the food
        "description": "Brief description of benefits or why to avoid", 
        "category": "category_name", // One of: protein, vegetable, fruit, grain, dairy, fat
        "nutrients": ["nutrient1", "nutrient2"], // Key nutrients
        "benefits": ["benefit1", "benefit2"] // Health benefits or reasons to avoid
      }
      
      The response should be a single JSON object with the following structure:
      {
        "recommended": [...array of recommended food objects],
        "avoid": [...array of foods to avoid objects]
      }
      
      Provide 10 items for the recommended list and 5 items for the avoid list.
      Return ONLY the JSON, no extra text.
    `;

    // Call Groq API
    const response = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        { role: 'system', content: 'You are a nutrition expert that provides food recommendations.' },
        { role: 'user', content: prompt }
      ],
      temperature: 1,
      max_tokens: 4000
    });

    // Get the response content
    const aiResponse = response.choices[0].message.content;
    let parsedResponse;
    
    try {
      // Attempt to parse directly if the AI returned just JSON
      parsedResponse = JSON.parse(aiResponse);
    } catch (e) {
      // If parsing fails, try to extract JSON from the text response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse AI response');
      }
    }

    // Ensure the response has the expected structure
    const recommended = Array.isArray(parsedResponse.recommended) 
      ? parsedResponse.recommended 
      : [];
    
    const avoid = Array.isArray(parsedResponse.avoid)
      ? parsedResponse.avoid
      : [];

    // Add default emoji for each food item
    const processedRecommended = recommended.map(food => ({
      ...food,
      emoji: '🍽️' // Default emoji
    }));

    const processedAvoid = avoid.map(food => ({
      ...food,
      emoji: '⛔' // Default emoji for foods to avoid
    }));

    return {
      recommended: processedRecommended,
      avoid: processedAvoid,
      surveyData: userPreferences.surveyData,
      lifestyleData: userPreferences.lifestyleData
    };
  } catch (error) {
    console.error('Error generating AI recommendations:', error);
    throw error;
  }
};
