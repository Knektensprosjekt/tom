import { getFromLocalStorage, saveToLocalStorage } from './storage.js';

export function setupNotes() {
    const notesList = document.getElementById('notes-list');
    const addNoteForm = document.getElementById('add-note-form');

    loadNotes();
    
    addNoteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addNote();
    });
}

function loadNotes() {
    const notes = getFromLocalStorage('notes');
    const notesList = document.getElementById('notes-list');
    notesList.innerHTML = '';

    notes.forEach((note, index) => {
        const li = createNoteElement(note, index);
        notesList.appendChild(li);
    });
}

function createNoteElement(note, index) {
    const li = document.createElement('li');
    li.innerHTML = `
        <h3>${note.title}</h3>
        <p>${note.content}</p>
        <button class="edit-btn">Rediger</button>
        <button class="delete-btn">Slett</button>
    `;

    li.querySelector('.edit-btn').addEventListener('click', () => editNote(index));
    li.querySelector('.delete-btn').addEventListener('click', () => deleteNote(index));

    return li;
}

function addNote() {
    const titleInput = document.getElementById('note-title');
    const contentInput = document.getElementById('note-content');
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (title && content) {
        const notes = getFromLocalStorage('notes');
        notes.push({ title, content });
        saveToLocalStorage('notes', notes);
        loadNotes();
        titleInput.value = '';
        contentInput.value = '';
    }
}

function editNote(index) {
    // Implementer redigering av notater her
}

function deleteNote(index) {
    const notes = getFromLocalStorage('notes');
    notes.splice(index, 1);
    saveToLocalStorage('notes', notes);
    loadNotes();
}