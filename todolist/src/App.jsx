// src/App.js
import React, { useState, useEffect } from 'react';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import TodoHeader from './components/TodoHeader';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch todos on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${API_URL}/todos`);
      console.log(response);
      setTodos(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch todos');
      setLoading(false);
    }
  };

  const addTodo = async (text) => {
    try {
      const response = await axios.post(`${API_URL}/todos`, { text });
      setTodos([...todos, response.data]);
    } catch (err) {
      setError('Failed to add todo');
    }
  };

  const toggleTodo = async (id) => {
    try {
      const response = await axios.patch(`${API_URL}/todos/${id}/toggle`);
      setTodos(todos.map(todo => 
        todo.id === id ? response.data : todo
      ));
    } catch (err) {
      setError('Failed to update todo');
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/todos/${id}`);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      setError('Failed to delete todo');
    }
  };

  const updateTodo = async (id, text) => {
    try {
      const response = await axios.put(`${API_URL}/todos/${id}`, { text });
      setTodos(todos.map(todo => 
        todo.id === id ? response.data : todo
      ));
    } catch (err) {
      setError('Failed to update todo');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <TodoHeader todoCount={todos.length} />
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <TodoForm onAdd={addTodo} />
        
        <TodoList 
          todos={todos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onUpdate={updateTodo}
        />
      </div>
    </div>
  );
}

export default App;