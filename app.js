// Importer moduler
import { setupMenuInteractions } from './modules/menu.js';
import { initializeLocalStorage } from './modules/storage.js';
import { setupRoutineTracker } from './modules/routineTracker.js';
import { setupStatistics } from './modules/statistics.js';
import { setupNotes } from './modules/notes.js';
import { setupWebsites } from './modules/websites.js';
import { setupTimer } from './modules/timer.js';
import { setupCalendar } from './modules/calendar.js';

// Vent til DOM-en er fullstendig lastet
document.addEventListener('DOMContentLoaded', () => {
    // Håndter menyinteraksjoner
    setupMenuInteractions();

    // Initialiser localStorage hvis det er nødvendig
    initializeLocalStorage();

    // Setup moduler basert på gjeldende side
    const currentPage = document.body.id;
    switch (currentPage) {
        case 'rutine-tracker':
            setupRoutineTracker();
            break;
        case 'statistikk':
            setupStatistics();
            break;
        case 'notater':
            setupNotes();
            break;
        case 'anbefalte-nettsider':
            setupWebsites();
            break;
        case 'tidtaker':
            setupTimer();
            break;
        case 'kalender':
            setupCalendar();
            break;
    }
});