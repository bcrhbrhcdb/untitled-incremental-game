// game.js
import { stats, startGameLoop } from "./stats.js"; // Ensure the correct import path

const clicksPerSecondDisplay = document.getElementById("clicksPerSecondDisplay");
const clicksDisplay = document.getElementById("clicksDisplay");
const amountPerClickDisplay = document.getElementById("amountPerClickDisplay");
// Function to update the clicks display
const updateClicksDisplay = () => {
    clicksDisplay.innerText = stats.clicks; // Update the clicks display
};

// Function to update the clicks per second display
const updateClicksPerSecondDisplay = () => {
    clicksPerSecondDisplay.innerText = stats.clicksPerSecond; // Update the clicks per second display
};

// Function to handle click events
// Function to handle click events
const handleClick = () => {
    stats.clicks += stats.amountPerClick; // Increment clicks based on amount per click
    stats.totalClicks += stats.amountPerClick; // Increment total clicks

    updateClicksDisplay(); // Update UI with current clicks

    // Check if buildings should appear after each click
    makeBuildingsAppear(buildings.autoClicker); // Call this for each relevant building
};
// Event listener for the click button
document.getElementById("clicker").addEventListener("click", handleClick);

// Initial display updates on load
updateClicksDisplay();
updateClicksPerSecondDisplay();

// Start the game loop for passive income updates
startGameLoop();