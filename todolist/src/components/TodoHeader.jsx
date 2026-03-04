// src/components/TodoHeader.js
import React from 'react';

function TodoHeader({ todoCount }) {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">
        Todo List
      </h1>
      <p className="text-gray-600">
        You have {todoCount} {todoCount === 1 ? 'task' : 'tasks'} to complete
      </p>
    </div>
  );
}

export default TodoHeader;