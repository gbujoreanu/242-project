const toggleNav = () => {
  document.querySelector(".menu").classList.toggle("active");
};

window.onload = () => {
  document.getElementById("menuToggle").onclick = toggleNav;
  loadExistingChecklists();
};

document.addEventListener("DOMContentLoaded", function () {
  const createChecklistForm = document.getElementById("create-checklist-form");
  const singleItemInput = document.getElementById("single-item");
  const itemsList = document.getElementById("items-list");
  const existingChecklists = document.getElementById("existing-checklists");
  let itemArray = [];

  document.getElementById("add-single-item").addEventListener("click", function (event) {
      event.preventDefault();
      const itemName = singleItemInput.value.trim();
      if (itemName !== "") {
          itemArray.push({ item: itemName, completed: false });
          addNewItemToDOM(itemName);
          singleItemInput.value = "";
      }
  });

  createChecklistForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const checklistName = document.getElementById("checklist-name").value.trim();
      if (checklistName === "" || itemArray.length === 0) return;
      addNewChecklist(checklistName, itemArray);
      clearForm();
      itemArray = [];
  });

  loadExistingChecklists();
});

function addNewItemToDOM(itemName) {
  const listItem = document.createElement("li");
  listItem.textContent = itemName;
  document.getElementById("items-list").appendChild(listItem);
}

function clearForm() {
  document.getElementById("checklist-name").value = "";
  document.getElementById("single-item").value = "";
  document.getElementById("items-list").innerHTML = "";
}

function addNewChecklist(checklistName, items) {
  const url = 'http://localhost:3000/api/checklists';

  fetch(url, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: checklistName, items: items }),
  })
  .then(response => response.json())
  .then(data => {
      console.log('Checklist added:', data);
      loadExistingChecklists();  // Reload the checklists
  })
  .catch(error => console.error('Error adding checklist:', error));
}

function loadExistingChecklists() {
  const url = 'http://localhost:3000/api/checklists';

  fetch(url)
      .then(response => response.json())
      .then(checklists => {
          checklists.forEach(checklist => displayChecklist(checklist));
      })
      .catch(error => console.error('Error loading checklists:', error));
}

function displayChecklist(checklist) {
  const checklistElement = document.createElement("div");
  checklistElement.innerHTML = `<h4>${checklist.name}</h4>`;
  checklist.items.forEach(item => {
      const itemElement = document.createElement("p");
      itemElement.textContent = item.item;
      checklistElement.appendChild(itemElement);
  });
  document.getElementById("existing-checklists").appendChild(checklistElement);
}

function editChecklist(checklistId, updatedChecklist) {
  const url = `http://localhost:3000/api/checklists/${checklistId}`;

  fetch(url, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedChecklist),
  })
  .then(response => response.json())
  .then(data => {
      console.log('Checklist updated:', data);
      loadExistingChecklists();  // Reload the checklists
  })
  .catch(error => console.error('Error updating checklist:', error));
}

function deleteChecklist(checklistId) {
  const url = `http://localhost:3000/api/checklists/${checklistId}`;

  fetch(url, { method: 'DELETE' })
      .then(response => response.json())
      .then(data => {
          console.log('Checklist deleted:', data);
          loadExistingChecklists();  // Reload the checklists
      })
      .catch(error => console.error('Error deleting checklist:', error));
}

