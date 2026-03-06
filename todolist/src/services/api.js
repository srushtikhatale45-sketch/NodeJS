import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds timeout
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // You can add auth tokens here if needed
        console.log(`Making ${config.method.toUpperCase()} request to: ${config.url}`);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            // Server responded with error status
            console.error('API Error:', error.response.data);
            
            // Handle specific error statuses
            switch (error.response.status) {
                case 404:
                    console.error('Resource not found');
                    break;
                case 500:
                    console.error('Server error');
                    break;
                default:
                    console.error('API error:', error.response.data.message);
            }
        } else if (error.request) {
            // Request was made but no response
            console.error('No response from server');
        } else {
            // Something else happened
            console.error('Error:', error.message);
        }
        
        return Promise.reject(error);
    }
);

// Todo API functions
export const todoApi = {
    // Get all todos
    getAllTodos: async () => {
        const response = await api.get('/todos');
        return response.data;
    },

    // Get todo by ID
    getTodoById: async (id) => {
        const response = await api.get(`/todos/${id}`);
        return response.data;
    },

    // Create new todo
    createTodo: async (text) => {
        const response = await api.post('/todos', { text });
        return response.data;
    },

    // Update todo
    updateTodo: async (id, data) => {
        const response = await api.put(`/todos/${id}`, data);
        return response.data;
    },

    // Toggle todo completion
    toggleTodo: async (id) => {
        const response = await api.patch(`/todos/${id}/toggle`);
        return response.data;
    },

    // Delete todo
    deleteTodo: async (id) => {
        const response = await api.delete(`/todos/${id}`);
        return response.data;
    },

    // Get statistics
    getStats: async () => {
        const response = await api.get('/todos/stats');
        return response.data;
    },

    // Search todos
    searchTodos: async (query) => {
        const response = await api.get(`/todos/search?q=${query}`);
        return response.data;
    }
};

export default api;