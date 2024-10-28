import { stats } from "./stats.js";
import { clicksDisplay, clicksPerSecondDisplay, totalClicksDisplay, updateBuildings, onManualClick, buildings } from "./upgradesAndBuildings.js";
import { startGameLoop } from "./gameLoop.js";
import { saveGame, loadGame } from "./save.js";
import { displayStats } from "./settings.js";
import { checkUpgradeAvailability } from "./upgrades.js";
import { checkResearchAvailability } from "./research.js";
import { calculateOfflineProgress } from './offlineProgress.js';

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
}

export function updateStats() {
    if (clicksDisplay) clicksDisplay.innerText = stats.clicks.toFixed(2);
    if (totalClicksDisplay) totalClicksDisplay.innerText = stats.totalClicks.toFixed(2);
    if (clicksPerSecondDisplay) clicksPerSecondDisplay.innerText = stats.clicksPerSecond.toFixed(2);
    if (amountPerClickDisplay) amountPerClickDisplay.innerText = (stats.amountPerClick * stats.clickMultiplier).toFixed(2);
    
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
            building.unlocked = true; // Unlock the building
            updateBuildings(); // Update the display of buildings
        }
    });
}

function setupNavigationButtons() {
    const buttons = ['settingsButton', 'upgradesButton', 'researchButton'];
    const areas = ['setting-area', 'upgrade-area', 'research-area'];

    buttons.forEach((buttonId, index) => {
        const button = document.getElementById(buttonId);
        button.addEventListener('click', () => {
            areas.forEach((areaId, i) => {
                const area = document.getElementById(areaId);
                if (i === index) {
                    area.style.display = 'block';
                    area.scrollIntoView({ behavior: 'smooth' });
                } else {
                    area.style.display = 'none';
                }
            });
        });
    });
}

function initializeGame() {
    // Ensure stats are initialized
    try {
        if (typeof stats.clicks !== 'number') stats.clicks = 0;
        if (typeof stats.totalClicks !== 'number') stats.totalClicks = 0;
        if (typeof stats.clicksPerSecond !== 'number') stats.clicksPerSecond = 0;
        if (typeof stats.amountPerClick !== 'number') stats.amountPerClick = 1;
        if (typeof stats.clickMultiplier !== 'number') stats.clickMultiplier = 1;

        // Load game state
        if (loadGame()) {
            console.log("Game loaded successfully");
            updateBuildings(); // Ensure buildings are shown after loading
            recalculateClicksPerSecond(); // Recalculate CPS after loading
            updateStats(); // Update UI after loading
        } else {
            console.log("No saved game found, starting new game");
            updateBuildings(); // Show buildings initially
            recalculateClicksPerSecond(); // Initialize CPS for new game
            updateStats(); // Update UI for new game
        }

        // Calculate offline progress at game start
        calculateOfflineProgress();

        if (clickButton) {
            clickButton.addEventListener("click", addClicks);
        } else {
            console.error("Click button not found in the DOM");
        }

        // Set up navigation buttons
        setupNavigationButtons();

        // Start the game loop
        startGameLoop();

        // Auto-save every minute
        setInterval(saveGame, 60000); // Adjusted to save every minute

    } catch (error) {
        console.error("Error initializing game:", error);
    }
}

// Wait for the DOM to be fully loaded before initializing the game
document.addEventListener('DOMContentLoaded', initializeGame);