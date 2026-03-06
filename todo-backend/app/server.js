// server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const sequelize = require("./utils/db");


const User = require("./models/userModel");

const app = express();
const PORT = process.env.PORT || 4000;

const corsoptions = {
  origin: "http://localhost:5174", // Adjust this to your frontend URL
  method: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type"],
};

const morgan = require("morgan");
// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// In-memory database (replace with real database in production)
let todos = [
  { id: 1, text: "Learn React", completed: false },
  { id: 2, text: "Build a Todo App", completed: false },
  { id: 3, text: "Master Tailwind CSS", completed: false },
];

// Routes

// Get all todos
app.get("/api/todos", (req, res) => {
  res.json(todos);
});

// Add a new todo
app.post("/api/todos", (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: "Text is required" });
  }

  const newTodo = {
    id: todos.length + 1,
    text,
    completed: false,
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// Update a todo
app.put("/api/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { text, completed } = req.body;

  const todoIndex = todos.findIndex((todo) => todo.id === id);

  if (todoIndex === -1) {
    return res.status(404).json({ message: "Todo not found" });
  }

  todos[todoIndex] = {
    ...todos[todoIndex],
    text: text || todos[todoIndex].text,
    completed: completed !== undefined ? completed : todos[todoIndex].completed,
  };

  res.json(todos[todoIndex]);
});

// Delete a todo
app.delete("/api/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const todoIndex = todos.findIndex((todo) => todo.id === id);

  if (todoIndex === -1) {
    return res.status(404).json({ message: "Todo not found" });
  }

  const deletedTodo = todos.splice(todoIndex, 1)[0];
  res.json(deletedTodo);
});

// Toggle todo completion
app.patch("/api/todos/:id/toggle", (req, res) => {
  const id = parseInt(req.params.id);

  const todo = todos.find((todo) => todo.id === id);

  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }

  todo.completed = !todo.completed;
  res.json(todo);
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected...");
    return sequelize.sync();
  })
  .then(() => {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }).catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
