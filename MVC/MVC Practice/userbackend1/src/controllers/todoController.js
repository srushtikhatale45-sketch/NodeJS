const Todo = require('../models/Todo');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

// Get all todos with filters
exports.getAllTodos = async (req, res) => {
  try {
    const { completed, priority, search } = req.query;
    
    let whereClause = {};
    
    if (completed !== undefined) {
      whereClause.completed = completed === 'true';
    }
    
    if (priority) {
      whereClause.priority = priority;
    }
    
    if (search) {
      whereClause.title = {
        [Op.iLike]: `%${search}%`
      };
    }
    
    const todos = await Todo.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json({
      success: true,
      count: todos.length,
      data: todos
    });
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching todos',
      error: error.message
    });
  }
};

// Get single todo
exports.getTodoById = async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id);
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: todo
    });
  } catch (error) {
    console.error('Error fetching todo:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching todo',
      error: error.message
    });
  }
};

// Create new todo
exports.createTodo = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const todo = await Todo.create(req.body);
    
    res.status(201).json({
      success: true,
      data: todo,
      message: 'Todo created successfully'
    });
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating todo',
      error: error.message
    });
  }
};

// Update todo
exports.updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id);
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }
    
    await todo.update(req.body);
    
    res.status(200).json({
      success: true,
      data: todo,
      message: 'Todo updated successfully'
    });
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating todo',
      error: error.message
    });
  }
};

// Delete todo
exports.deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id);
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }
    
    await todo.destroy();
    
    res.status(200).json({
      success: true,
      message: 'Todo deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting todo',
      error: error.message
    });
  }
};

// Toggle todo completion status
exports.toggleTodo = async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id);
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }
    
    await todo.update({ completed: !todo.completed });
    
    res.status(200).json({
      success: true,
      data: todo,
      message: `Todo marked as ${todo.completed ? 'completed' : 'pending'}`
    });
  } catch (error) {
    console.error('Error toggling todo:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling todo',
      error: error.message
    });
  }
};