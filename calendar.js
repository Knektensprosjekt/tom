import { getFromLocalStorage, saveToLocalStorage } from './storage.js';

export function setupCalendar() {
    const calendarContainer = document.getElementById('calendar-container');
    const addEventForm = document.getElementById('add-event-form');

    renderCalendar();
    loadEvents();

    addEventForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addEvent();
    });
}

function renderCalendar() {
    const calendarContainer = document.getElementById('calendar-container');
    const currentDate = new Date();
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    let calendarHTML = `<h2>${getMonthName(month)} ${year}</h2>`;
    calendarHTML += '<table><tr><th>Man</th><th>Tir</th><th>Ons</th><th>Tor</th><th>Fre</th><th>Lør</th><th>Søn</th></tr>';

    let day = 1;
    for (let i = 0; i < 6; i++) {
        calendarHTML += '<tr>';
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay.getDay()) {
                calendarHTML += '<td></td>';
            } else if (day > lastDay.getDate()) {
                calendarHTML += '<td></td>';
            } else {
                calendarHTML += `<td>${day}</td>`;
                day++;
            }
        }
        calendarHTML += '</tr>';
        if (day > lastDay.getDate()) break;
    }

    calendarHTML += '</table>';
    calendarContainer.innerHTML = calendarHTML;
}

function getMonthName(month) {
    const monthNames = ['Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'];
    return monthNames[month];
}

function loadEvents() {
    const events = getFromLocalStorage('calendarEvents');
    const eventList = document.getElementById('event-list');
    eventList.innerHTML = '';

    events.forEach((event, index) => {
        const li = createEventElement(event, index);
        eventList.appendChild(li);
    });
}

function createEventElement(event, index) {
    const li = document.createElement('li');
    li.innerHTML = `
        <span>${event.date}: ${event.title}</span>
        <button class="delete-btn">Slett</button>
    `;

    li.querySelector('.delete-btn').addEventListener('click', () => deleteEvent(index));

    return li;
}

function addEvent() {
    const titleInput = document.getElementById('event-title');
    const dateInput = document.getElementById('event-date');
    const title = titleInput.value.trim();
    const date = dateInput.value;

    if (title && date) {
        const events = getFromLocalStorage('calendarEvents');
        events.push({ title, date });
        saveToLocalStorage('calendarEvents', events);
        loadEvents();
        titleInput.value = '';
        dateInput.value = '';
    }
}

function deleteEvent(index) {
    const events = getFromLocalStorage('calendarEvents');
    events.splice(index, 1);
    saveToLocalStorage('calendarEvents', events);
    loadEvents();
}