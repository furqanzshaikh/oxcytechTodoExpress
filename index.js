const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const Todo = require("./models/todoSchema");
const port = process.env.PORT || 4000;
const connectDb = require("./connection/connectDb");
const { responseLogger, requestLogger } = require('./loggingMiddleware');
const { validateRequestBody, validateQueryParams } = require('./validationMiddleware');



// Connect to the database
connectDb();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(requestLogger)
app.use(responseLogger)

// GET route to retrieve all todos
app.get('/',(req,res)=>{
  res.send('Server is working')
})
app.get("/todos", async (req, res) => {
  try {
    const allTodos = await Todo.find({});
    res.status(200).json({ todos: allTodos });
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST route to create a new todo
app.post("/todos/create", validateRequestBody,async (req, res) => {
  const { title, description } = req.body;
  console.log(title, description);
  try {
    const addTodo = await Todo.create({ title, description });
    res.status(201).json({ message: "Todo Created successfully" });
  } catch (error) {
    console.error("Error creating todo:", error);
    res.status(400).json({ error: "Bad request, unable to create todo" });
  }
});

// PUT route to update an existing todo
app.put("/todos/update/:id", validateRequestBody, async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.status(200).json({ message: "Todo updated successfully" });
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE route to delete a todo
app.delete("/todos/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTodo = await Todo.findByIdAndDelete(id);
    if (!deletedTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
