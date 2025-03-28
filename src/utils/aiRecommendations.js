// import OpenAI from 'openai';

// // Check for API key
// const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

// if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your_openai_api_key_here') {
//   console.warn(
//     'OpenAI API key is not configured. Please add your API key to the .env file:\n' +
//     '1. Create or edit .env file in the project root\n' +
//     '2. Add the line: REACT_APP_OPENAI_API_KEY=your_actual_api_key\n' +
//     '3. Restart your development server'
//   );
// }

// // Initialize OpenAI client
// const openai = new OpenAI({
//   apiKey: OPENAI_API_KEY
// });

// // Helper function to structure the states into a meaningful prompt
// const constructPrompt = (currentStates, desiredStates) => {
//   const currentStatesList = currentStates.join(', ');
//   const desiredStatesList = desiredStates.join(', ');

//   return `As a nutrition expert, recommend foods based on the following:

// Current states: ${currentStatesList}
// Desired states: ${desiredStatesList}

// Consider the transition from the current emotional and physical states to the desired states.
// Provide recommendations in the following JSON format:
// {
//   "recommended": [
//     {
//       "name": "Food name",
//       "reason": "Why this food helps with the transition",
//       "benefits": ["benefit1", "benefit2"]
//     }
//   ],
//   "avoid": [
//     {
//       "name": "Food name",
//       "reason": "Why this food might hinder the transition"
//     }
//   ]
// }`;
// };

// // Function to get AI-powered food recommendations
// export const getAIRecommendations = async (currentStates, desiredStates) => {
//   if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your_openai_api_key_here') {
//     throw new Error(
//       'OpenAI API key not configured. Please check your .env file and add a valid API key.'
//     );
//   }

//   try {
//     const prompt = constructPrompt(currentStates, desiredStates);

//     const completion = await openai.chat.completions.create({
//       model: "gpt-4", // or gpt-3.5-turbo depending on needs
//       messages: [
//         {
//           role: "system",
//           content: "You are a knowledgeable nutritionist who understands how different foods affect physical and emotional states."
//         },
//         {
//           role: "user",
//           content: prompt
//         }
//       ],
//       temperature: 0.7,
//       max_tokens: 1000,
//       response_format: { type: "json_object" }
//     });

//     // Parse the JSON response
//     const recommendations = JSON.parse(completion.choices[0].message.content);

//     // Transform the AI recommendations into the app's food card format
//     return transformAIRecommendations(recommendations);
//   } catch (error) {
//     console.error('Error getting AI recommendations:', error);
//     throw error;
//   }
// };

// // Helper function to transform AI response into app's food format
// const transformAIRecommendations = (aiRecommendations) => {
//   const recommended = aiRecommendations.recommended.map((item, index) => ({
//     id: `ai_rec_${index}`,
//     name: item.name,
//     icon: getFoodEmoji(item.name), // You'd need to implement this
//     description: item.reason,
//     rating: 'Nomnomnomnom',
//     recommendation: 'high'
//   }));

//   const avoid = aiRecommendations.avoid.map((item, index) => ({
//     id: `ai_avoid_${index}`,
//     name: item.name,
//     icon: getFoodEmoji(item.name), // You'd need to implement this
//     description: item.reason,
//     rating: 'Nono',
//     recommendation: 'avoid'
//   }));

//   return {
//     recommended,
//     avoid
//   };
// };

// // Helper function to get emoji for food (simplified example)
// const getFoodEmoji = (foodName) => {
//   const emojiMap = {
//     'banana': '🍌',
//     'apple': '🍎',
//     'fish': '🐟',
//     'salad': '🥗',
//     'water': '💧',
//     // Add more mappings as needed
//   };

//   // Default emoji if no match found
//   return emojiMap[foodName.toLowerCase()] || '🍽️';
// }; 