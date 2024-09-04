import { getFromLocalStorage } from './storage.js';

export function setupStatistics() {
    updateStatistics();
}

function updateStatistics() {
    const routines = getFromLocalStorage('routines');
    const completedRoutines = routines.filter(routine => routine.completed);
    
    const totalRoutines = routines.length;
    const completedCount = completedRoutines.length;
    const completionRate = totalRoutines > 0 ? (completedCount / totalRoutines) * 100 : 0;

    displayStatistics(totalRoutines, completedCount, completionRate);
}

function displayStatistics(total, completed, rate) {
    const statsContainer = document.getElementById('stats-container');
    statsContainer.innerHTML = `
        <h2>Statistikk</h2>
        <p>Totalt antall rutiner: ${total}</p>
        <p>Fullførte rutiner: ${completed}</p>
        <p>Fullføringsrate: ${rate.toFixed(2)}%</p>
    `;

    // Her kan du legge til kode for å vise diagrammer ved hjelp av et diagrambibliotek
}