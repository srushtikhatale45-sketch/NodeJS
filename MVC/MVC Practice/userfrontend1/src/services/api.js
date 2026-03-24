import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'An error occurred';
    return Promise.reject({ message, status: error.response?.status });
  }
);

export const todoService = {
  getAllTodos: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return api.get(`/todos${params ? `?${params}` : ''}`);
  },
  
  getTodoById: (id) => api.get(`/todos/${id}`),
  
  createTodo: (todoData) => api.post('/todos', todoData),
  
  updateTodo: (id, todoData) => api.put(`/todos/${id}`, todoData),
  
  deleteTodo: (id) => api.delete(`/todos/${id}`),
  
  toggleTodo: (id) => api.patch(`/todos/${id}/toggle`),
};

export default api;