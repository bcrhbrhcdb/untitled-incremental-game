// stats.js

export const stats = {
    clicks: 0,
    totalClicks: 0,
    clicksPerSecond: 0, // Set initial value for clicks per second
    allTimeClicks: 0,
    totalRuns: 0,
    upgrades: [], // Names of upgrades
    upgradesOwned: 0,
    buildings: [], // Names of buildings
    totalBuildings: 0,
    amountPerClick: 1,
    prestige: 0,
    voids: 0,
    ascends: 0,
    usedCheats: false,
};

export let GAME_TICKS = 0; // Initialize game ticks

// Function to apply passive income from upgrades and buildings
export const applyPassiveIncome = () => {
    stats.clicks += stats.clicksPerSecond; // Increment clicks by clicks per second
    stats.totalClicks += stats.clicksPerSecond; // Increment total clicks

    // Update UI displays
    updateDisplay();
};

// Function to update the UI
const updateDisplay = () => {
    const clicksDisplay = document.getElementById("clicksDisplay");
    const clicksPerSecondDisplay = document.getElementById("clicksPerSecondDisplay");

    if (clicksDisplay) {
        clicksDisplay.innerText = stats.clicks;
    }
    
    if (clicksPerSecondDisplay) {
        clicksPerSecondDisplay.innerText = stats.clicksPerSecond; // Ensure this shows the correct value
    }
};

// Export the function to be used in gameLoop.js
export const startGameLoop = () => {
    setInterval(() => {
        GAME_TICKS++; // Increment game ticks every 50 milliseconds (20 ticks per second)
        if (GAME_TICKS % 20 === 0) { // Every 20 ticks, apply passive income
            applyPassiveIncome();
        }
    }, 50); // Update every 50 milliseconds
};