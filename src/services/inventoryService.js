import axios from 'axios';
import { getAuthToken } from '../utils/auth';
const API_URL = 'http://localhost:8000/api/v1'; // Adjust to your backend URL

export const inventoryService = {
  getInventory: async (userId, inv_type) => {
    const token = await getAuthToken();
    const response = await axios.get(`${API_URL}/users/${userId}/inventories/${inv_type}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
  },
  putInventory: async (userId, inv_type, payload) => {
    const token = await getAuthToken();
    const response = await axios.put(`${API_URL}/users/${userId}/inventories/${inv_type}`, payload, {
        headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        },
    });
    return response.data;
    }
};
//"/users/{user_id}/inventories/{inv_type}"
//`${API_URL}/users/${userId}/inventories`
//`${API_URL}/users/${userId}/inventories/${inv_type}`

   