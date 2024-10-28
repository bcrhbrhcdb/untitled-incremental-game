import { stats } from "./stats.js";
import { saveGame, clearSave } from "./save.js";
import { updateStats } from "./game.js";
import { resetBuildings } from "./upgradesAndBuildings.js";
import { exportSave, importSave } from "./importExport.js";

const settingsButton = document.getElementById("settingsButton");
const settingArea = document.getElementById("setting-area");
const saveButton = document.getElementById("saveButton");
const clearSaveButton = document.getElementById("clearSaveButton");
const exportSaveButton = document.getElementById("exportSaveButton");
const importSaveButton = document.getElementById("importSaveButton");
const importSaveInput = document.getElementById("importSaveInput");

export function setupSettingsButton() {
    settingsButton.addEventListener("click", () => {
        settingArea.style.display = settingArea.style.display === "none" ? "block" : "none";
        settingArea.scrollIntoView({ behavior: 'smooth' });
    });

    saveButton.addEventListener("click", () => {
        saveGame();
        alert("Game saved successfully!"); // User feedback on save
    });

    clearSaveButton.addEventListener("click", () => {
        if (confirm("Are you sure you want to clear your save data? This action cannot be undone.")) {
            clearSave();
            resetStats();
            resetBuildings();
            updateStats();
            alert("Save data cleared successfully!"); // User feedback on clear
        }
    });

    exportSaveButton.addEventListener("click", () => {
        const saveString = exportSave();
        const blob = new Blob([saveString], { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'untitled_idle_game_save.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        alert("Game exported successfully!"); // User feedback on export
    });

    importSaveButton.addEventListener("click", () => {
        importSaveInput.click();
    });

    importSaveInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const saveString = e.target.result;
                if (importSave(saveString)) {
                    alert("Save data imported successfully!"); // User feedback on import
                    updateStats(); // Ensure stats are updated after import
                } else {
                    alert("Error importing save data. Please check the file and try again.");
                }
            };
            reader.readAsText(file);
        }
    });
}

function resetStats() {
    Object.keys(stats).forEach(key => {
        if (typeof stats[key] === 'number') {
            stats[key] = key === 'amountPerClick' ? 1 : 0;
        } else if (Array.isArray(stats[key])) {
            stats[key] = [];
        } else if (typeof stats[key] === 'boolean') {
            stats[key] = false;
        }
    });
}

// Throttled displayStats function
export function displayStats() {
    console.log(`Clicks: ${stats.clicks.toFixed(2)} Total Clicks: ${stats.totalClicks.toFixed(2)} Buildings Owned: ${stats.totalBuildings} Buildings: [${stats.buildings.join(", ")}]`);
}