let todos = [];
let currId = 1;

export async function getAllTodo(req, res, next) {
  res.json(todos);
}

export async function createTodo(req, res, next) {
  const task = req.body.task;

  if (!task) {
    res.status(400).json({
      error: "task is required",
    });
    return;
  }
  const newTodo = {
    id: currId,
    task: task,
  };
  todos.push(newTodo);
  currId++;
  res.status(201).json(newTodo);
}

export async function updateTodo(req, res, next) {
  const id = parseInt(req.params.id);
  const task = req.body.task;

  if (!task) {
    res.status(400).json({
      error: "Task is required",
    });
    return;
  }
  const TodoIndex = todos.findIndex((todo) => todo.id === id);

  if (TodoIndex !== -1) {
    todos[TodoIndex].task = task;
    res.json(todos[TodoIndex]);
  } else {
    res.status(404).json({
      mesg: "Todo not found",
    });
  }
}

export async function deleteTodo(req, res, next) {
  const id = parseInt(req.params.id);
  const TodoIndex = todos.findIndex((todo) => todo.id === id);

  if (TodoIndex !== -1) {
    todos.splice(TodoIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).json({
      mesg: "Todo not found",
    });
  }
}

export async function searchId(req, res, next) {
  const query = req.query.q;

  if (!query) {
    res.status(400).json({
      mesg: "query parameter missing",
    });
    return;
  }
  const filteredTods = todos.filter((todo) =>
    todo.task.toLowerCase().includes(query.toLowerCase())
  );
  res.json(filteredTods);
}