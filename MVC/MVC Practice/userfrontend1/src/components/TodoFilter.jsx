import React, { useEffect } from 'react';
import useTodoStore from '../store/todoStore';
import TodoItem from './TodoItem';

const TodoList = () => {
  const { todos, loading, fetchTodos } = useTodoStore();

  useEffect(() => {
    fetchTodos();
  }, []);

  if (loading && todos.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="mt-2 text-gray-600">Loading todos...</p>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-500 text-lg">No todos found</p>
        <p className="text-gray-400 mt-2">Add your first todo above!</p>
      </div>
    );
  }

  const completedCount = todos.filter(t => t.completed).length;
  const pendingCount = todos.length - completedCount;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Your Todos</h2>
          <div className="text-sm text-gray-600">
            <span className="text-green-600">{completedCount} completed</span>
            {' • '}
            <span className="text-yellow-600">{pendingCount} pending</span>
            {' • '}
            <span className="text-blue-600">{todos.length} total</span>
          </div>
        </div>
      </div>
      
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
};

export default TodoList;