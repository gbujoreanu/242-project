const toggleNav = () => {
  document.querySelector(".menu").classList.toggle("active");
};

const loadAndDisplayGoals = () => {
  const url = 'http://localhost:3000/api/goals'; 

  fetch(url)
      .then(response => response.json())
      .then(goals => {
          goals.forEach(goal => addNewGoal(goal));
      })
      .catch(error => {
          console.error('Error loading goals:', error);
      });
};

const addNewGoal = (goal) => {
  const goalElement = document.createElement("div");
  goalElement.classList.add("goal");
  goalElement.innerHTML = `
      <h3 class="goal-name">${goal.name}</h3>
      <p class="goal-description">${goal.description}</p>
      <p class="goal-due-date">Due Date: ${goal.due_date}</p>
      <p class="goal-progress">Progress: ${goal.progress}%</p>
      <p class="goal-notes">${goal.notes}</p>
      <button class="edit-goal">Edit</button>
      <button class="delete-goal">Delete</button>
  `;

  goalElement.querySelector(".edit-goal").addEventListener("click", () => {
      editGoal(goal);
  });

  goalElement.querySelector(".delete-goal").addEventListener("click", () => {
      deleteGoal(goal._id, goalElement);
  });

  document.getElementById("goals-list").appendChild(goalElement);
};

const editGoal = (goalId) => {
  
  fetch(`http://localhost:3000/api/goals/${goalId}`)
      .then(response => response.json())
      .then(goal => {
          document.getElementById("goal-name").value = goal.name;
          document.getElementById("goal-description").value = goal.description;
          document.getElementById("goal-due-date").value = new Date(goal.due_date).toISOString().split('T')[0];
          document.getElementById("goal-progress").value = goal.progress;
          document.getElementById("goal-notes").value = goal.notes;

          
          const goalForm = document.getElementById("goal-form");
          goalForm.onsubmit = (e) => {
              e.preventDefault();
              updateGoal(goalId, {
                  name: document.getElementById("goal-name").value,
                  description: document.getElementById("goal-description").value,
                  due_date: document.getElementById("goal-due-date").value,
                  progress: document.getElementById("goal-progress").value,
                  notes: document.getElementById("goal-notes").value
              });
          };
      })
      .catch(error => console.error('Error fetching goal:', error));
};

const updateGoal = (goalId, updatedGoal) => {
  fetch(`http://localhost:3000/api/goals/${goalId}`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedGoal),
  })
  .then(response => {
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
  })
  .then(data => {
      console.log('Goal updated:', data);
      
  })
  .catch(error => console.error('Error updating goal:', error));
};


const deleteGoal = (goalId, goalElement) => {
  const url = `http://localhost:3000/api/goals/${goalId}`;  

  fetch(url, { method: 'DELETE' })
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          goalElement.remove();  
      })
      .catch(error => console.error('Error deleting goal:', error));
};

window.onload = () => {
  document.getElementById("menuToggle").onclick = toggleNav;
  loadAndDisplayGoals();
};

document.getElementById("add-goal-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const goal = {
      name: document.getElementById("goal-name").value,
      description: document.getElementById("goal-description").value,
      due_date: document.getElementById("goal-due-date").value,
      progress: document.getElementById("goal-progress").value,
      notes: document.getElementById("goal-notes").value,
  };

  addGoal(goal);  
  event.target.reset();
  document.getElementById("progress-display").textContent = "0%";
});

const addGoal = (goal) => {
  const url = 'http://localhost:3000/api/goals';  

  fetch(url, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(goal),
  })
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          loadAndDisplayGoals(); 
      })
      .catch(error => console.error('Error adding goal:', error));
};

document.getElementById("goal-progress").addEventListener("input", (event) => {
  document.getElementById("progress-display").textContent = event.target.value + "%";
});
