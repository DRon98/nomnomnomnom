import axios from 'axios';
import { getAuthToken } from '../utils/auth';
const API_URL = 'http://localhost:8000/api/v1'; // Adjust to your backend URL

export const applianceService = {
  // Add a kitchen appliance
  addAppliance: async (userId, applianceData) => {
    const token = getAuthToken(); 
    
    const response = await axios.post(
      `${API_URL}/users/${userId}/appliances`,
      applianceData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  },

  // Get all appliances for a user
  getUserAppliances: async (userId) => {
    console.log('Getting user appliances for user:', userId);
    const token = await getAuthToken();
    const response = await axios.get(
      `${API_URL}/users/${userId}/appliances`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  // Delete an appliance
  deleteAppliance: async (userId, applianceId) => {
    const token = getAuthToken();
     
    await axios.delete(
      `${API_URL}/users/${userId}/appliances/${applianceId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return applianceId;
  },

  updateAppliances: async (userId, updateData) => {
    console.log('Update Data: appliances', updateData);
    const token = await getAuthToken();
    const response = await axios.put(
      `${API_URL}/users/${userId}/appliances/update`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  },

};

