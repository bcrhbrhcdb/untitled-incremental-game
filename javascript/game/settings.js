// settings.js

import { saveGame, loadGame, clearSave } from './save.js';
import { updateStats } from './game.js';
import { updateBuildings } from './upgradesAndBuildings.js';
import { stats } from './stats.js';

const amountPerClickDisplay = document.getElementById("amountPerClickDisplay");
const settingsButton = document.getElementById("settings");
const settingsArea = document.getElementById("setting-area");
const closeSettings = document.getElementById("closeSettings");

// Save button
const saveButton = document.getElementById('saveButton');
if (saveButton) {
    saveButton.addEventListener('click', () => {
        saveGame();
        alert('Game saved successfully!');
    });
}

// Clear save button
const clearSaveButton = document.getElementById('clearSaveButton');
if (clearSaveButton) {
    clearSaveButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear your save data? This cannot be undone.')) {
            clearSave();
            updateStats();
            updateBuildings();
        }
    });
}

// Settings button
settingsButton.addEventListener("click", () => {
    settingsArea.style.display = "block";
});

// Close settings button
closeSettings.addEventListener("click", () => {
    settingsArea.style.display = "none";
});

// Debug log (you might want to remove this in production)
setInterval(() => console.log(
    "Clicks:", stats.clicks, 
    "Total Clicks:", stats.totalClicks,
    "Buildings Owned:", stats.totalBuildings,
    "Buildings:", stats.buildings
), 1000);