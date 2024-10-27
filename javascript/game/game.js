// game.js

import { stats } from "./stats.js";
import { clicksDisplay, clicksPerSecondDisplay, totalClicksDisplay, updateBuildings } from "./upgradesAndBuildings.js";
import { startGameLoop } from "./gameLoop.js";

const clickButton = document.getElementById("clicker");
const amountPerClickDisplay = document.getElementById("amountPerClickDisplay");

function addClicks() {
    stats.clicks += stats.amountPerClick;
    stats.totalClicks += stats.amountPerClick;
    updateStats();
}

export function updateStats() {
    clicksDisplay.innerText = stats.clicks.toFixed(2);
    totalClicksDisplay.innerText = stats.totalClicks.toFixed(2)
    clicksPerSecondDisplay.innerText = stats.clicksPerSecond.toFixed(2);
    amountPerClickDisplay.innerText = stats.amountPerClick.toFixed(2);
    
}

clickButton.addEventListener("click", addClicks);

// Initial setup
updateStats();
updateBuildings();

// Start the game loop
startGameLoop();

