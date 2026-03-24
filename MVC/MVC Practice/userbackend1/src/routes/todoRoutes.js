const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const todoController = require('../controllers/todoController');

// Validation rules
const todoValidation = [
  body('title').notEmpty().withMessage('Title is required').isLength({ max: 200 }).withMessage('Title too long'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('dueDate').optional().isISO8601().withMessage('Invalid date format')
];

// Routes
router.get('/', todoController.getAllTodos);
router.get('/:id', todoController.getTodoById);
router.post('/', todoValidation, todoController.createTodo);
router.put('/:id', todoValidation, todoController.updateTodo);
router.delete('/:id', todoController.deleteTodo);
router.patch('/:id/toggle', todoController.toggleTodo);

module.exports = router;