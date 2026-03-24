import React, { useState } from 'react';
import { format } from 'date-fns';
import useTodoStore from '../store/todoStore';

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

const TodoItem = ({ todo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: todo.title,
    description: todo.description || '',
    priority: todo.priority,
    dueDate: todo.dueDate || '',
  });
  
  const { toggleTodo, deleteTodo, updateTodo } = useTodoStore();

  const handleToggle = async () => {
    await toggleTodo(todo.id);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      await deleteTodo(todo.id);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({
      title: todo.title,
      description: todo.description || '',
      priority: todo.priority,
      dueDate: todo.dueDate || '',
    });
  };

  const handleSaveEdit = async () => {
    if (!editData.title.trim()) {
      alert('Title is required');
      return;
    }
    
    await updateTodo(todo.id, {
      ...editData,
      dueDate: editData.dueDate || null,
    });
    setIsEditing(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-3">
        <div className="space-y-3">
          <input
            type="text"
            name="title"
            value={editData.title}
            onChange={handleEditChange}
            className="input-field"
            placeholder="Title"
          />
          <textarea
            name="description"
            value={editData.description}
            onChange={handleEditChange}
            rows="2"
            className="input-field"
            placeholder="Description"
          />
          <div className="grid grid-cols-2 gap-3">
            <select
              name="priority"
              value={editData.priority}
              onChange={handleEditChange}
              className="input-field"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <input
              type="datetime-local"
              name="dueDate"
              value={editData.dueDate}
              onChange={handleEditChange}
              className="input-field"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={handleSaveEdit} className="flex-1 btn-primary">
              Save
            </button>
            <button onClick={handleCancelEdit} className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 mb-3 transition-all ${todo.completed ? 'opacity-75' : ''}`}>
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          className="mt-1 w-5 h-5 cursor-pointer"
        />
        
        <div className="flex-1">
          <h3 className={`text-lg font-semibold ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
            {todo.title}
          </h3>
          
          {todo.description && (
            <p className={`mt-1 text-gray-600 ${todo.completed ? 'line-through' : ''}`}>
              {todo.description}
            </p>
          )}
          
          <div className="mt-2 flex flex-wrap gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[todo.priority]}`}>
              {todo.priority.toUpperCase()}
            </span>
            
            {todo.dueDate && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                Due: {format(new Date(todo.dueDate), 'MMM dd, yyyy HH:mm')}
              </span>
            )}
            
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
              Created: {format(new Date(todo.createdAt), 'MMM dd, yyyy')}
            </span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleEdit}
            className="text-blue-500 hover:text-blue-700 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;