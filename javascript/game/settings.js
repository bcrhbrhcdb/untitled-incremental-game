import { saveGame, loadGame, clearSave } from './save.js';
import { updateStats } from './game.js';
import { updateBuildings } from './upgradesAndBuildings.js';
import { stats } from './stats.js';
const amountPerClickDisplay = document.getElementById("amountPerClickDisplay");
const settingsButton = document.getElementById("settings");
const settingsArea = document.getElementById("setting-area")
const closeSettings = document.getElementById("closeSettings");
if (loadGame()) {
    updateStats();
    updateBuildings();
}

// Save the game every minute
setInterval(saveGame, 1000, console.log(
    "Clicks: ", stats.clicks, 
    "Total Clicks: ", stats.totalClicks,
    "Buildings Owned: ", stats.totalBuildings,
    "Buildings: ", stats.buildings
    ));

// You might want to add a save button to your UI
const saveButton = document.getElementById('saveButton');
if (saveButton) {
    saveButton.addEventListener('click', saveGame);
}

// Similarly for a clear save button
const clearSaveButton = document.getElementById('clearSaveButton');
if (clearSaveButton) {
    clearSaveButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear your save data? This cannot be undone.')) {
            clearSave();
            location.reload(); // Reload the page to reset the game state
        }
    });
}

settingsButton.addEventListener("click",()=>{
    settingsArea.style.display = "block";
})
closeSettings.addEventListener("click", ()=>{
    settingsArea.style.display = "none";
})