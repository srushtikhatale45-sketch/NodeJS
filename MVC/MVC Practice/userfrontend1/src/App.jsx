import React from 'react';
import { Toaster } from 'react-hot-toast';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import TodoFilter from './components/TodoFilter';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <Toaster position="top-right" />
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Todo Application
        </h1>
        
        <TodoForm />
        <TodoFilter />
        <TodoList />
      </div>
    </div>
  );
}

export default App;