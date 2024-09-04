import { getFromLocalStorage, saveToLocalStorage } from './storage.js';

let timer;
let seconds = 0;
let currentActivity = '';

export function setupTimer() {
    const startBtn = document.getElementById('start-timer');
    const stopBtn = document.getElementById('stop-timer');
    const activityInput = document.getElementById('activity-input');

    startBtn.addEventListener('click', startTimer);
    stopBtn.addEventListener('click', stopTimer);
}

function startTimer() {
    const activityInput = document.getElementById('activity-input');
    currentActivity = activityInput.value.trim();

    if (currentActivity) {
        seconds = 0;
        updateTimerDisplay();
        timer = setInterval(updateTimer, 1000);
    } else {
        alert('Vennligst skriv inn en aktivitet før du starter tidtakeren.');
    }
}

function stopTimer() {
    if (timer) {
        clearInterval(timer);
        saveTimerData();
        resetTimer();
    }
}

function updateTimer() {
    seconds++;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const timerDisplay = document.getElementById('timer-display');
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    timerDisplay.textContent = `${padZero(hours)}:${padZero(minutes)}:${padZero(secs)}`;
}

function padZero(num) {
    return num.toString().padStart(2, '0');
}

function saveTimerData() {
    const timerData = getFromLocalStorage('timerData');
    timerData.push({
        activity: currentActivity,
        duration: seconds,
        date: new Date().toISOString()
    });
    saveToLocalStorage('timerData', timerData);
}

function resetTimer() {
    seconds = 0;
    currentActivity = '';
    updateTimerDisplay();
    document.getElementById('activity-input').value = '';
}