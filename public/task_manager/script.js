document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('menuToggle').onclick = toggleNav;
  document.getElementById('add-task-form').addEventListener('submit', addTask);
  document.getElementById('edit-task-form').addEventListener('submit', editTask);
  loadAndDisplayTasks();
});

const toggleNav = () => {
  document.querySelector(".menu").classList.toggle("active");
};

function loadAndDisplayTasks() {
  fetch('/api/tasks')
      .then(response => response.json())
      .then(tasks => {
          const tasksList = document.getElementById('tasks-list');
          tasksList.innerHTML = '';

          tasks.forEach(task => {
              const taskElement = document.createElement('div');
              taskElement.classList.add('task');
              taskElement.innerHTML = `
                  <h3>${task.name}</h3>
                  <p>${task.description}</p>
                  <button onclick="displayEditForm('${task._id}')">Edit</button>
                  <button onclick="deleteTask('${task._id}')">Delete</button>
              `;
              tasksList.appendChild(taskElement);
          });
      })
      .catch(error => console.error('Error:', error));
}

function addTask(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const task = Object.fromEntries(formData.entries());

  fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
  })
  .then(() => {
      loadAndDisplayTasks();
      event.target.reset();
  })
  .catch(error => console.error('Error:', error));
}

function displayEditForm(taskId) {
  fetch(`/api/tasks/${taskId}`)
      .then(response => response.json())
      .then(task => {
          const editForm = document.getElementById('edit-task-form');
          editForm.name.value = task.name;
          editForm.description.value = task.description;
          editForm.taskId.value = task._id;
          editForm.style.display = 'block';
      })
      .catch(error => console.error('Error:', error));
}

function editTask(event) {
  event.preventDefault();
  const taskId = event.target.taskId.value;
  const formData = new FormData(event.target);
  const updatedTask = Object.fromEntries(formData.entries());

  fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTask)
  })
  .then(() => {
      loadAndDisplayTasks();
      event.target.style.display = 'none';
  })
  .catch(error => console.error('Error:', error));
}

function deleteTask(taskId) {
  fetch(`/api/tasks/${taskId}`, { method: 'DELETE' })
      .then(() => loadAndDisplayTasks())
      .catch(error => console.error('Error:', error));
}
