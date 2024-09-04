import { getFromLocalStorage, saveToLocalStorage } from './storage.js';

export function setupRoutineTracker() {
    const routineList = document.getElementById('routine-list');
    const addRoutineForm = document.getElementById('add-routine-form');

    loadRoutines();
    
    addRoutineForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addRoutine();
    });
}

function loadRoutines() {
    const routines = getFromLocalStorage('routines');
    const routineList = document.getElementById('routine-list');
    routineList.innerHTML = '';

    routines.forEach((routine, index) => {
        const li = createRoutineElement(routine, index);
        routineList.appendChild(li);
    });
}

function createRoutineElement(routine, index) {
    const li = document.createElement('li');
    li.innerHTML = `
        <span>${routine.name}</span>
        <button class="complete-btn">Fullfør</button>
        <button class="delete-btn">Slett</button>
    `;

    li.querySelector('.complete-btn').addEventListener('click', () => completeRoutine(index));
    li.querySelector('.delete-btn').addEventListener('click', () => deleteRoutine(index));

    return li;
}

function addRoutine() {
    const routineInput = document.getElementById('routine-input');
    const routineName = routineInput.value.trim();

    if (routineName) {
        const routines = getFromLocalStorage('routines');
        routines.push({ name: routineName, completed: false });
        saveToLocalStorage('routines', routines);
        loadRoutines();
        routineInput.value = '';
    }
}

function completeRoutine(index) {
    const routines = getFromLocalStorage('routines');
    routines[index].completed = true;
    saveToLocalStorage('routines', routines);
    loadRoutines();
}

function deleteRoutine(index) {
    const routines = getFromLocalStorage('routines');
    routines.splice(index, 1);
    saveToLocalStorage('routines', routines);
    loadRoutines();
}