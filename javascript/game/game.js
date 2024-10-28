// game.js

import { stats } from "./stats.js";
import { clicksDisplay, clicksPerSecondDisplay, totalClicksDisplay, updateBuildings, onManualClick, buildings } from "./upgradesAndBuildings.js";
import { startGameLoop } from "./gameLoop.js";
import { saveGame, loadGame } from "./save.js";
import { displayStats } from "./settings.js";
import { checkUpgradeAvailability, setupUpgradesButton } from "./upgrades.js";
import { checkResearchAvailability, setupResearchButton } from "./research.js";

const clickButton = document.getElementById("clicker");
const amountPerClickDisplay = document.getElementById("amountPerClickDisplay");

function addClicks() {
    const clickValue = (stats.amountPerClick + onManualClick()) * stats.clickMultiplier;
    stats.clicks += clickValue;
    stats.totalClicks += clickValue;
    stats.allTimeClicks += clickValue;
    updateStats();
    checkUpgradeAvailability();
    checkResearchAvailability();
    checkBuildingAvailability();
}

export function updateStats() {
    if (clicksDisplay) clicksDisplay.innerText = stats.clicks.toFixed(2);
    if (totalClicksDisplay) totalClicksDisplay.innerText = stats.totalClicks.toFixed(2);
    if (clicksPerSecondDisplay) clicksPerSecondDisplay.innerText = stats.clicksPerSecond.toFixed(2);
    if (amountPerClickDisplay) amountPerClickDisplay.innerText = (stats.amountPerClick * stats.clickMultiplier + calculateManualClickValue()).toFixed(2);
    
    try {
        displayStats();
    } catch (error) {
        console.error("Error displaying stats:", error);
    }
}

export function calculateManualClickValue() {
    return onManualClick(true) * stats.clickMultiplier;
}

function checkBuildingAvailability() {
    Object.entries(buildings).forEach(([key, building]) => {
        if (stats.totalClicks >= building.initialCost && !building.unlocked) {
            building.unlocked = true;
            updateBuildings();
        }
    });
}

function initializeGame() {
    // Ensure stats are initialized
    if (typeof stats.clicks !== 'number') stats.clicks = 0;
    if (typeof stats.totalClicks !== 'number') stats.totalClicks = 0;
    if (typeof stats.clicksPerSecond !== 'number') stats.clicksPerSecond = 0;
    if (typeof stats.amountPerClick !== 'number') stats.amountPerClick = 1;
    if (typeof stats.clickMultiplier !== 'number') stats.clickMultiplier = 1;
    if (!Array.isArray(stats.buildings)) stats.buildings = [];
    if (typeof stats.totalBuildings !== 'number') stats.totalBuildings = 0;
    if (!Array.isArray(stats.researchCompleted)) stats.researchCompleted = [];

    if (clickButton) {
        clickButton.addEventListener("click", addClicks);
    } else {
        console.error("Click button not found in the DOM");
    }

    // Set up upgrades and research buttons
    setupUpgradesButton();
    setupResearchButton();

    // Initial setup
    if (loadGame()) {
        console.log("Game loaded successfully");
    } else {
        console.log("No saved game found, starting new game");
    }
    updateStats();
    updateBuildings();
    checkUpgradeAvailability();
    checkResearchAvailability();
    checkBuildingAvailability();

    // Start the game loop
    startGameLoop();

    // Auto-save every minute
    setInterval(saveGame, 60000);
}

// Wait for the DOM to be fully loaded before initializing the game
document.addEventListener('DOMContentLoaded', initializeGame);