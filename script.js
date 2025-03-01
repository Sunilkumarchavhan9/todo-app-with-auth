
// API endpoint - will work both on Replit and local environments
const API_URL = window.location.origin;

// DOM elements
const todosList = document.getElementById('todos-list');
const newTodoInput = document.getElementById('new-todo');
const addButton = document.getElementById('add-button');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const clearSearchButton = document.getElementById('clear-search');

// Fetch all todos
async function fetchTodos() {
  try {
    const response = await fetch(`${API_URL}/todos`);
    const data = await response.json();
    renderTodos(data);
  } catch (error) {
    console.error('Error fetching todos:', error);
  }
}

// Add a new todo
async function addTodo() {
  const task = newTodoInput.value.trim();
  if (!task) return;

  try {
    const response = await fetch(`${API_URL}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ task }),
    });

    if (response.ok) {
      newTodoInput.value = '';
      fetchTodos();
    }
  } catch (error) {
    console.error('Error adding todo:', error);
  }
}

// Update a todo
async function updateTodo(id, task) {
  try {
    const response = await fetch(`${API_URL}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ task }),
    });

    if (response.ok) {
      fetchTodos();
    }
  } catch (error) {
    console.error('Error updating todo:', error);
  }
}

// Delete a todo
async function deleteTodo(id) {
  try {
    const response = await fetch(`${API_URL}/todos/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      fetchTodos();
    }
  } catch (error) {
    console.error('Error deleting todo:', error);
  }
}

// Search todos
async function searchTodos() {
  const query = searchInput.value.trim();
  if (!query) return;

  try {
    const response = await fetch(`${API_URL}/todos/search?q=${query}`);
    const data = await response.json();
    renderTodos(data);
  } catch (error) {
    console.error('Error searching todos:', error);
  }
}

// Render todos to DOM
function renderTodos(todos) {
  todosList.innerHTML = '';
  
  if (todos.length === 0) {
    todosList.innerHTML = '<li class="todo-item">No todos found.</li>';
    return;
  }

  todos.forEach(todo => {
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.innerHTML = `
      <span class="todo-text">${todo.task}</span>
      <div class="todo-actions">
        <button class="edit-btn" data-id="${todo.id}">Edit</button>
        <button class="delete-btn" data-id="${todo.id}">Delete</button>
      </div>
    `;
    todosList.appendChild(li);
  });

  // Add event listeners to edit buttons
  document.querySelectorAll('.edit-btn').forEach(button => {
    button.addEventListener('click', function() {
      const id = this.getAttribute('data-id');
      const todoItem = this.closest('.todo-item');
      const todoText = todoItem.querySelector('.todo-text').textContent;
      
      todoItem.classList.add('edit-mode');
      todoItem.innerHTML = `
        <input type="text" class="edit-input" value="${todoText}">
        <button class="save-btn" data-id="${id}">Save</button>
        <button class="cancel-btn">Cancel</button>
      `;
      
      const saveBtn = todoItem.querySelector('.save-btn');
      const cancelBtn = todoItem.querySelector('.cancel-btn');
      
      saveBtn.addEventListener('click', function() {
        const newText = todoItem.querySelector('.edit-input').value.trim();
        if (newText) {
          updateTodo(id, newText);
        }
      });
      
      cancelBtn.addEventListener('click', function() {
        fetchTodos();
      });
    });
  });

  // Add event listeners to delete buttons
  document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', function() {
      const id = this.getAttribute('data-id');
      if (confirm('Are you sure you want to delete this todo?')) {
        deleteTodo(id);
      }
    });
  });
}

// Event listeners
addButton.addEventListener('click', addTodo);
newTodoInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    addTodo();
  }
});

searchButton.addEventListener('click', searchTodos);
searchInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    searchTodos();
  }
});

clearSearchButton.addEventListener('click', function() {
  searchInput.value = '';
  fetchTodos();
});

// Initial load
fetchTodos();