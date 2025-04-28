import axios from 'axios';
import { getAuthToken } from '../utils/auth';
const API_URL = 'http://localhost:8000/api/v1';

export const userLifestyleService = {
    getUserLifestyle: async (userId) => {
        console.log('Getting user LIFEST for user:', `${API_URL}/users/${userId}/lifestyle`);
        const token = await getAuthToken();
        console.log('Token:', token);
        const response = await axios.get(`${API_URL}/users/${userId}/lifestyle`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        return response.data;
    },

    updateUserLifestyle: async (userId, lifestyleData) => {
        const token = await getAuthToken();
        const response = await axios.put(
            `${API_URL}/users/${userId}/lifestyle`,
            lifestyleData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            }
        );
        return response.data;
    }
}

export default userLifestyleService;