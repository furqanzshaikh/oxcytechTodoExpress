require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const connectDb = require('./connection/connectDb');
const User = require('./models/userSchema');
const Todo = require('./models/todoSchema');
const { responseLogger, requestLogger } = require('./loggingMiddleware');
const { validateRequestBody } = require('./validationMiddleware');
const { test, getAllTodos, getSingleTodo, createTodo, editTodo, deleteTodo } = require('./controllers/todoControllers');

// Initialize Express app
const app = express();
const port = process.env.PORT || 4000;

// Database connection
connectDb();

// Middleware
app.use(express.json());
app.use(cors());
app.use(requestLogger);
app.use(responseLogger);

// Routes

// Root route
app.get('/',test )

// Get all todos
app.get('/todos', getAllTodos);

// Get a single todo by ID
app.get('/todos/:id', getSingleTodo);

// Create a new todo
app.post('/todos/create', validateRequestBody,createTodo);

// Update an existing todo
app.put('/todos/update/:id', validateRequestBody, editTodo);

// Delete a todo
app.delete('/todos/delete/:id', deleteTodo);

// User registration
app.post('/create/user', async (req, res) => {
 

    const { username, email, password } = req.body;
    console.log(username, email, password);

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({ username, email, password: hashedPassword });

      const token = jwt.sign(
        { id: newUser._id, email: newUser.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// User login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: existingUser._id, email: existingUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/validate-token', (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ isValid: false });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ isValid: true });
  } catch (error) {
    return res.status(401).json({ isValid: false });
  }
});

// Logout route (client-side handling)
app.post('/logout', (req, res) => {
  res.status(200).json({ message: 'Logout successful (handled on client-side)' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
