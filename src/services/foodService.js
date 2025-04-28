import axios from 'axios';
import { getAuthToken } from '../utils/auth';
const API_URL = 'http://localhost:8000/api/v1'; // Adjust to your backend URL

export const foodService = {


  // Get all appliances for a user
  getFoods: async (token) => {
    try {
      //const token = await getAuthToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      
      const response = await axios.get(
        `${API_URL}/foods`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching foods:', error);
      throw error;
    }
  },
};

//   // Delete an appliance
//   deleteFood: async (userId, applianceId) => {
//     const token = getAuthToken();
     
//     await axios.delete(
//       `${API_URL}/users/${userId}/appliances/${applianceId}`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     return applianceId;
//   },

//   updateFood: async (userId, updateData) => {
//     console.log('Update Data: appliances', updateData);
//     const token = await getAuthToken();
//     const response = await axios.put(
//       `${API_URL}/users/${userId}/appliances/update`,
//       updateData,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );
//     return response.data;
//   },  // Add a kitchen appliance
//   addFood: async (userId, applianceData) => {
//     const token = getAuthToken(); 
//     const response = await axios.post(
//       `${API_URL}/users/${userId}/appliances`,
//       applianceData,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );
//     return response.data;
//   },