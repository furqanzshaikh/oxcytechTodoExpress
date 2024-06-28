const {
  getAllTodos,
  getSingleTodo,
  createTodo,
  editTodo,
  deleteTodo,
} = require("./controllers/todoControllers");
const Todo = require("./models/todoSchema");

describe("getAllTodos", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return status 200 and all todos", async () => {
    const mockTodos = [{ title: "Test Todo 1" }, { title: "Test Todo 2" }];

    jest.spyOn(Todo, "find").mockResolvedValue(mockTodos);

    // Mock req and res objects
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getAllTodos(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ todos: mockTodos });
  });

  it("should return status 500 if there is an error", async () => {
    // Mock Todo.find to throw an error
    jest.spyOn(Todo, "find").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    // Mock req and res objects
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getAllTodos(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
  });
});

describe("getSingleTodo", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return status 200 and the requested todo", async () => {
    // Mock todo data
    const mockTodo = { _id: "1", title: "Test Todo 1" };

    // Mock Todo.findById to resolve with mockTodo
    jest.spyOn(Todo, "findById").mockResolvedValue(mockTodo);

    // Mock req and res objects
    const req = { params: { id: "1" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getSingleTodo(req, res);

    // Assert that status and json functions were called with correct parameters
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ todo: mockTodo });
  });

  it("should return status 404 if the todo is not found", async () => {
    // Mock Todo.findById to resolve with null (todo not found)
    jest.spyOn(Todo, "findById").mockResolvedValue(null);

    // Mock req and res objects
    const req = { params: { id: "1" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getSingleTodo(req, res);

    // Assert that status and json functions were called with correct parameters
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Todo not found" });
  });

  it("should return status 500 if there is an error", async () => {
    // Mock Todo.findById to throw an error
    jest.spyOn(Todo, "findById").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    // Mock req and res objects
    const req = { params: { id: "1" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getSingleTodo(req, res);

    // Assert that status and json functions were called with correct parameters
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
  });
});

describe("createTodo", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new todo and return status 201", async () => {
    const mockTodo = {
      _id: "1",
      title: "Test Todo",
      description: "Test Description",
      category: "Test Category",
    };

    // Mock Todo.create to resolve with mockTodo
    jest.spyOn(Todo, "create").mockResolvedValue(mockTodo);

    // Mock req and res objects
    const req = {
      body: {
        title: "Test Todo",
        description: "Test Description",
        category: "Test Category",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await createTodo(req, res);

    // Assert that status and json functions were called with correct parameters
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Todo created successfully",
      todo: mockTodo,
    });
  });

  it("should return status 400 if there is an error", async () => {
    // Mock Todo.create to throw an error
    jest.spyOn(Todo, "create").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    // Mock req and res objects
    const req = {
      body: {
        title: "Test Todo",
        description: "Test Description",
        category: "Test Category",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await createTodo(req, res);

    // Assert that status and json functions were called with correct parameters
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Bad request, unable to create todo",
    });
  });
});

describe("editTodo", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update an existing todo and return status 200", async () => {
    const mockTodo = {
      _id: "1",
      title: "Updated Todo",
      description: "Updated Description",
    };

    // Mock Todo.findByIdAndUpdate to resolve with mockTodo
    jest.spyOn(Todo, "findByIdAndUpdate").mockResolvedValue(mockTodo);

    // Mock req and res objects
    const req = {
      params: { id: "1" },
      body: { title: "Updated Todo", description: "Updated Description" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await editTodo(req, res);

    // Assert that status and json functions were called with correct parameters
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Todo updated successfully",
      todo: mockTodo,
    });
  });

  it("should return status 404 if the todo is not found", async () => {
    // Mock Todo.findByIdAndUpdate to resolve with null (todo not found)
    jest.spyOn(Todo, "findByIdAndUpdate").mockResolvedValue(null);

    // Mock req and res objects
    const req = {
      params: { id: "1" },
      body: { title: "Updated Todo", description: "Updated Description" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await editTodo(req, res);

    // Assert that status and json functions were called with correct parameters
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Todo not found" });
  });

  it("should return status 500 if there is an error", async () => {
    // Mock Todo.findByIdAndUpdate to throw an error
    jest.spyOn(Todo, "findByIdAndUpdate").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    // Mock req and res objects
    const req = {
      params: { id: "1" },
      body: { title: "Updated Todo", description: "Updated Description" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await editTodo(req, res);

    // Assert that status and json functions were called with correct parameters
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
  });
});

describe("deleteTodo", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should delete an existing todo and return status 200", async () => {
    const mockTodo = {
      _id: "1",
      title: "Test Todo",
      description: "Test Description",
    };

    // Mock Todo.findByIdAndDelete to resolve with mockTodo
    jest.spyOn(Todo, "findByIdAndDelete").mockResolvedValue(mockTodo);

    // Mock req and res objects
    const req = { params: { id: "1" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await deleteTodo(req, res);

    // Assert that status and json functions were called with correct parameters
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Todo deleted successfully",
    });
  });

  it("should return status 404 if the todo is not found", async () => {
    // Mock Todo.findByIdAndDelete to resolve with null (todo not found)
    jest.spyOn(Todo, "findByIdAndDelete").mockResolvedValue(null);

    // Mock req and res objects
    const req = { params: { id: "1" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await deleteTodo(req, res);

    // Assert that status and json functions were called with correct parameters
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Todo not found" });
  });

  it("should return status 500 if there is an error", async () => {
    // Mock Todo.findByIdAndDelete to throw an error
    jest.spyOn(Todo, "findByIdAndDelete").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    // Mock req and res objects
    const req = { params: { id: "1" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await deleteTodo(req, res);

    // Assert that status and json functions were called with correct parameters
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
  });
});
