import { stats } from "./stats.js";
import { clicksDisplay, clicksPerSecondDisplay, buildings, buildingTYPES, makePassiveIncome, updateBuildings } from "./upgradesAndBuildings.js";

const clickButton = document.getElementById("clicker");
const amountPerClickDisplay = document.getElementById("amountPerClickDisplay");

function addClicks() {
    stats.clicks += stats.amountPerClick;
    stats.totalClicks += stats.amountPerClick;
    updateStats();
}

export function updateStats() {
    clicksDisplay.innerText = Math.floor(stats.clicks);
    clicksPerSecondDisplay.innerText = stats.clicksPerSecond.toFixed(2);
    amountPerClickDisplay.innerText = stats.amountPerClick.toFixed(2);
}

clickButton.addEventListener("click", addClicks);

// Initial setup
updateStats();
updateBuildings();
makePassiveIncome();