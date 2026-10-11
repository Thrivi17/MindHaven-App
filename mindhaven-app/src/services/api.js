// mindhaven-app/src/services/api.js

import axios from 'axios';

const API_BASE_URL = 'https://mindhaven-backend-2vib.onrender.com';

/**
 * Sends a secure chat message to the FastAPI guardrail/Groq backend.
 */
export const sendSecureChatMessage = async (userId, promptText) => {
    try {
        console.log(`🌐 [API] Sending chat request to ${API_BASE_URL}/api/chat/secure...`);
        const response = await axios.post(`${API_BASE_URL}/api/chat/secure`, {
            user_id: userId,
            prompt: promptText
        }, {
            timeout: 10000
        });
        return response.data;
    } catch (error) {
        console.error('❌ [API] Chat Axios Error:', error.message);
        if (error.response) {
            console.error('Data:', error.response.data);
            console.error('Status:', error.response.status);
        } else if (error.request) {
            console.error('No response received. Is the cloud backend running?');
        }
        throw error;
    }
};

/**
 * Authenticates an existing user by comparing email and password.
 */
export const loginUser = async (email, password) => {
    try {
        console.log(`🔑 [API] Attempting login for: ${email}`);
        const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
            email: email,
            password: password
        });
        return response.data;
    } catch (error) {
        console.error('❌ [API] Login Error:', error.message);
        throw error;
    }
};

/**
 * Registers a new user after checking password policy constraints.
 */
export const registerUser = async (email, password) => {
    try {
        console.log(`📝 [API] Attempting registration for: ${email}`);
        const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
            email: email,
            password: password
        });
        return response.data;
    } catch (error) {
        console.error('❌ [API] Registration Error:', error.message);
        throw error;
    }
};
