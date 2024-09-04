import { getFromLocalStorage, saveToLocalStorage } from './storage.js';

export function setupWebsites() {
    const websiteList = document.getElementById('website-list');
    const addWebsiteForm = document.getElementById('add-website-form');

    loadWebsites();
    
    addWebsiteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addWebsite();
    });
}

function loadWebsites() {
    const websites = getFromLocalStorage('websites');
    const websiteList = document.getElementById('website-list');
    websiteList.innerHTML = '';

    websites.forEach((website, index) => {
        const li = createWebsiteElement(website, index);
        websiteList.appendChild(li);
    });
}

function createWebsiteElement(website, index) {
    const li = document.createElement('li');
    li.innerHTML = `
        <a href="${website.url}" target="_blank">${website.name}</a>
        <button class="delete-btn">Slett</button>
    `;

    li.querySelector('.delete-btn').addEventListener('click', () => deleteWebsite(index));

    return li;
}

function addWebsite() {
    const nameInput = document.getElementById('website-name');
    const urlInput = document.getElementById('website-url');
    const name = nameInput.value.trim();
    const url = urlInput.value.trim();

    if (name && url) {
        const websites = getFromLocalStorage('websites');
        websites.push({ name, url });
        saveToLocalStorage('websites', websites);
        loadWebsites();
        nameInput.value = '';
        urlInput.value = '';
    }
}

function deleteWebsite(index) {
    const websites = getFromLocalStorage('websites');
    websites.splice(index, 1);
    saveToLocalStorage('websites', websites);
    loadWebsites();
}