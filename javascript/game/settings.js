// settings.js

import { stats } from "./stats.js";
import { saveGame, clearSave } from "./save.js";
import { updateStats } from "./game.js";
import { resetBuildings } from "./upgradesAndBuildings.js";
import { exportSave, importSave } from "./importExport.js";

const settingsButton = document.getElementById("settings");
const settingArea = document.getElementById("setting-area");
const saveButton = document.getElementById("saveButton");
const clearSaveButton = document.getElementById("clearSaveButton");
const closeSettingsButton = document.getElementById("closeSettings");
const exportSaveButton = document.getElementById("exportSaveButton");
const importSaveButton = document.getElementById("importSaveButton");
const importSaveInput = document.getElementById("importSaveInput");

settingsButton.addEventListener("click", () => {
    settingArea.style.display = "block";
});

closeSettingsButton.addEventListener("click", () => {
    settingArea.style.display = "none";
});

// settings.js

// Throttling function
function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function() {
      const context = this;
      const args = arguments;
      if (!lastRan) {
        func.apply(context, args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(function() {
          if ((Date.now() - lastRan) >= limit) {
            func.apply(context, args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    }
  }
saveButton.addEventListener("click", () => {
    saveGame();
    alert("Game saved successfully!");
});

clearSaveButton.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear your save data? This action cannot be undone.")) {
        clearSave();
        resetStats();
        resetBuildings();
        updateStats();
        alert("Save data cleared successfully!");
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
                alert("Save data imported successfully!");
            } else {
                alert("Error importing save data. Please check the file and try again.");
            }
        };
        reader.readAsText(file);
    }
});

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
const throttledDisplayStats = throttle(function() {
    if (stats && typeof stats.clicks === 'number' && typeof stats.totalClicks === 'number') {
      console.log(`Clicks: ${stats.clicks.toFixed(2)} Total Clicks: ${stats.totalClicks.toFixed(2)} Buildings Owned: ${stats.totalBuildings} Buildings: [${stats.buildings.join(", ")}]`);
    } else {
      console.log("Stats not fully initialized yet.");
    }
  }, 2000); // 1000 ms (1 second) delay between logs
  
  // Replace the original displayStats function
  export function displayStats() {
    throttledDisplayStats();
  }