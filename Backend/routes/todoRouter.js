const express = require("express");
const router = express.Router();
const {
    test,getAllTodos,getSingleTodo,createTodo,editTodo,deleteTodo
} = require("../controllers/todoControllers.js");

router.get("/", test);
router.get('/api/todos',getAllTodos)
router.get('/api/todos/:id',getSingleTodo)
router.post('/api/todos/create',createTodo)
router.put('/api/todos/update/:id',editTodo)
router.delete('/api/todos/delete/:id',deleteTodo)


module.exports = router;
