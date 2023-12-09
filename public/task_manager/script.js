const toggleNav = () => {
  document.querySelector(".menu").classList.toggle("active");
};

window.onload = () => {
  document.getElementById("menuToggle").onclick = toggleNav;
  loadAndDisplayTasks();
};

function loadAndDisplayTasks() {
  const url = 'http://localhost:3000/api/tasks';  

  fetch(url)
      .then(response => response.json())
      .then(tasks => {
          const tasksList = document.getElementById('data-container');
          tasksList.innerHTML = '';

          tasks.forEach(task => {
              const taskElement = document.createElement('div');
              taskElement.classList.add('task');
              taskElement.innerHTML = `
                  <h3 class="task-name">${task.name}</h3>
                  <p class="task-description">${task.description}</p>
                  <p class="task-due-date">Due Date: ${task.due_date}</p>
                  <p class="task-priority">Priority: ${task.priority}</p>
                  <p class="task-status">Status: ${task.status}</p>
                  <button class="edit-task">Edit</button>
                  <button class="delete-task">Delete</button>
              `;

              taskElement.querySelector('.edit-task').addEventListener('click', () => {
                  editTask(task);
              });

              taskElement.querySelector('.delete-task').addEventListener('click', () => {
                  deleteTask(task._id, taskElement);
              });

              tasksList.appendChild(taskElement);
          });
      })
      .catch(error => {
          console.error('Error loading tasks:', error);
      });
}

function editTask(task) {

  const taskModal = document.getElementById("task-modal");
  
  document.getElementById("task-name").value = task.name;
  document.getElementById("task-description").value = task.description;
  document.getElementById("task-due-date").value = new Date(task.due_date).toISOString().split('T')[0];
  document.getElementById("task-status").value = task.status;

  taskModal.style.display = "block";

  const taskForm = document.getElementById("task-form");
  taskForm.onsubmit = (e) => {
      e.preventDefault();
      const updatedTask = {
          name: document.getElementById("task-name").value,
          description: document.getElementById("task-description").value,
          due_date: document.getElementById("task-due-date").value,
          status: document.getElementById("task-status").value
      };

      updateTask(task.id, updatedTask);

      taskModal.style.display = "none";
  };
}

function updateTask(taskId, updatedTask) {
  fetch(`http://localhost:3000/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTask),
  })
  .then(response => {
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
  })
  .then(data => {
      console.log('Task updated:', data);
  })
  .catch(error => console.error('Error updating task:', error));
}

function deleteTask(taskId, taskElement) {
  const url = `http://localhost:3000/api/tasks/${taskId}`;  

  fetch(url, { method: 'DELETE' })
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          taskElement.remove();  
      })
      .catch(error => console.error('Error deleting task:', error));
}

document.getElementById('task-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const task = {
      name: document.getElementById('task-name').value,
      description: document.getElementById('task-description').value,
      due_date: document.getElementById('task-due-date').value,
      priority: document.getElementById('task-priority').value,
      status: document.getElementById('task-status').value,
  };

  addTask(task);  
  document.getElementById('task-form').reset();
});

function addTask(task) {
  const url = 'http://localhost:3000/api/tasks';  

  fetch(url, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
  })
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          loadAndDisplayTasks();  
      })
      .catch(error => console.error('Error adding task:', error));
}
