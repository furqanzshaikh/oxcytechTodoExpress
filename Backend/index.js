require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet')

const connectDb = require('./connection/connectDb');
const { responseLogger, requestLogger } = require('./loggingMiddleware');
const todoRouter = require('./routes/todoRouter.js')
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
app.use(helmet())
app.use(todoRouter)




// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
