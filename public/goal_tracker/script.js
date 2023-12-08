document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('menuToggle').onclick = toggleNav;
  loadAndDisplayGoals();

  document.getElementById('add-goal-form').addEventListener('submit', (event) => {
      event.preventDefault();

      const goalName = document.getElementById('goal-name').value;
      const goalDescription = document.getElementById('goal-description').value;
      const goalDueDate = document.getElementById('goal-due-date').value;
      const goalProgress = document.getElementById('goal-progress').value;
      const goalNotes = document.getElementById('goal-notes').value;

      addGoalToDatabase(goalName, goalDescription, goalDueDate, goalProgress, goalNotes);
      event.target.reset();
      document.getElementById('progress-display').textContent = '0%';
  });

  document.getElementById('goal-progress').addEventListener('input', (event) => {
      document.getElementById('progress-display').textContent = event.target.value + '%';
  });
});

const toggleNav = () => {
  document.querySelector('.menu').classList.toggle('active');
};

const loadAndDisplayGoals = () => {
  fetch('/api/goals')
    .then(response => response.json())
    .then(goals => {
        goals.forEach(goal => addNewGoal(goal._id, goal.name, goal.description, goal.dueDate, goal.progress, goal.notes));
    })
    .catch(error => {
        console.error('Error loading goals:', error);
    });
};

const addNewGoal = (id, name, description, dueDate, progress, notes) => {
  const goalElement = document.createElement('div');
  goalElement.classList.add('goal');
  goalElement.innerHTML = `
      <h3 class="goal-name">${name}</h3>
      <p class="goal-description">${description}</p>
      <p class="goal-due-date">Due Date: ${dueDate}</p>
      <p class="goal-progress">Progress: ${progress}%</p>
      <p class="goal-notes">${notes}</p>
      <button class="edit-goal">Edit</button>
      <button class="delete-goal">Delete</button>
  `;

  goalElement.querySelector('.edit-goal').addEventListener('click', () => {
      // Populate edit form and show it
      document.getElementById('edit-goal-id').value = id;
      document.getElementById('edit-goal-name').value = name;
      document.getElementById('edit-goal-description').value = description;
      document.getElementById('edit-goal-due-date').value = dueDate;
      document.getElementById('edit-goal-progress').value = progress;
      document.getElementById('edit-goal-notes').value = notes;
      // Show edit form logic here
  });

  goalElement.querySelector('.delete-goal').addEventListener('click', () => {
      deleteGoalFromDatabase(id, goalElement);
  });

  document.getElementById('goals-list').appendChild(goalElement);
};

const addGoalToDatabase = (name, description, dueDate, progress, notes) => {
  const newGoal = { name, description, dueDate, progress, notes };
  fetch('/api/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newGoal)
  })
  .then(() => loadAndDisplayGoals())
  .catch(error => console.error('Error:', error));
};

const deleteGoalFromDatabase = (id, element) => {
  fetch(`/api/goals/${id}`, { method: 'DELETE' })
      .then(() => element.remove())
      .catch(error => console.error('Error:', error));
};
