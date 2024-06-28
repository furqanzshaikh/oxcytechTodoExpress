const Todo = require("../models/todoSchema.js");

const test = (req, res) => {
  res.send("Server is working");
};



const getAllTodos = async (req, res) => {
  try {
    const allTodos = await Todo.find({});
    res.status(200).json({ todos: allTodos });
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



const getSingleTodo = async (req, res) => {
    const { id } = req.params;
    try {
      const singleTodo = await Todo.findById(id);
      if (!singleTodo) {
        return res.status(404).json({ error: 'Todo not found' });
      }
      res.status(200).json({ todo: singleTodo });
    } catch (error) {
      console.error('Error fetching todo:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }


 const createTodo= async (req, res) => {
    const { title, description, category } = req.body;
    try {
      const newTodo = await Todo.create({ title, description, category });
      res.status(201).json({ message: 'Todo created successfully', todo: newTodo });
    } catch (error) {
      console.error('Error creating todo:', error);
      res.status(400).json({ error: 'Bad request, unable to create todo' });
    }
  }


const editTodo=  async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    try {
      const updatedTodo = await Todo.findByIdAndUpdate(id, { title, description }, { new: true });
      if (!updatedTodo) {
        return res.status(404).json({ error: 'Todo not found' });
      }
      res.status(200).json({ message: 'Todo updated successfully', todo: updatedTodo });
    } catch (error) {
      console.error('Error updating todo:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

const deleteTodo=  async (req, res) => {
    const { id } = req.params;
    try {
      const deletedTodo = await Todo.findByIdAndDelete(id);
      if (!deletedTodo) {
        return res.status(404).json({ error: 'Todo not found' });
      }
      res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (error) {
      console.error('Error deleting todo:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

module.exports = { test, getAllTodos ,getSingleTodo,createTodo,editTodo,deleteTodo};
