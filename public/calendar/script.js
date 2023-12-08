const toggleNav = () => {
  document.querySelector(".menu").classList.toggle("active");
};

const daysTag = document.querySelector(".days");
const currentDate = document.querySelector(".current-date");
const prevMonthBtn = document.querySelector("#prev");
const nextMonthBtn = document.querySelector("#next");
const eventDateInput = document.querySelector("#event-date");
const eventTimeInput = document.querySelector("#event-time");
const eventDescriptionInput = document.querySelector("#event-description");

let date = new Date();
let currentYear = date.getFullYear();
let currentMonth = date.getMonth();
let selectedDate = new Date();

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const renderCalendar = () => {
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const lastDateOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const lastDayOfMonth = new Date(currentYear, currentMonth, lastDateOfMonth).getDay();
  const lastDateOfLastMonth = new Date(currentYear, currentMonth, 0).getDate();

  let liTag = "";
  for (let i = firstDayOfMonth; i > 0; i--) {
      liTag += `<li class="inactive">${lastDateOfLastMonth - i + 1}<div class="events"></div></li>`;
  }
  for (let i = 1; i <= lastDateOfMonth; i++) {
      const isToday = i === date.getDate() && currentMonth === date.getMonth() && currentYear === date.getFullYear() ? "active" : "";
      liTag += `<li class="${isToday}" data-date="${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}">
                ${i}<div class="events"></div></li>`;
  }
  for (let i = lastDayOfMonth; i < 6; i++) {
      liTag += `<li class="inactive">${i - lastDayOfMonth + 1}<div class="events"></div></li>`;
  }

  currentDate.innerText = `${months[currentMonth]} ${currentYear}`;
  daysTag.innerHTML = liTag;
  fetchAndDisplayEvents();
};

const fetchAndDisplayEvents = () => {
  fetch('/api/calendar/events')
      .then(response => response.json())
      .then(data => {
          const events = data.events;
          events.forEach(event => {
              const eventDate = new Date(event.date);
              if (eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear) {
                  const dayElement = daysTag.querySelector(`li[data-date="${event.date}"] .events`);
                  if (dayElement) {
                      const eventElement = document.createElement("div");
                      eventElement.className = "event";
                      eventElement.textContent = `${event.time}: ${event.description}`;
                      dayElement.appendChild(eventElement);
                  }
              }
          });
      })
      .catch(error => console.error('Error fetching events:', error));
};

window.onload = () => {
  document.getElementById("menuToggle").onclick = toggleNav;
  renderCalendar();
};

prevMonthBtn.addEventListener("click", () => {
  changeMonth(-1);
});

nextMonthBtn.addEventListener("click", () => {
  changeMonth(1);
});

const changeMonth = (direction) => {
  currentMonth += direction;
  if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
  } else if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
  }
  selectedDate.setMonth(currentMonth);
  selectedDate.setFullYear(currentYear);
  renderCalendar();
};

document.getElementById("event-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const dateToAddEvent = eventDateInput.value;
  const timeToAddEvent = eventTimeInput.value;
  const descriptionToAddEvent = eventDescriptionInput.value;

  addEventToDatabase(dateToAddEvent, timeToAddEvent, descriptionToAddEvent);

  eventDateInput.value = "";
  eventTimeInput.value = "";
  eventDescriptionInput.value = "";
});

const addEventToDatabase = (date, time, description) => {
  const newEvent = { date, time, description };
  fetch('/api/calendar/add-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEvent)
  })
  .then(response => response.json())
  .then(data => {
      if (data.success) {
          // Event added successfully, you can update the UI if needed.
          fetchAndDisplayEvents();
      } else {
          console.error('Error adding event:', data.error);
      }
  })
  .catch(error => console.error('Error adding event:', error));
};
