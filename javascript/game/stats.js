// stats.js
import { clicksPerSecondDisplay, clicksDisplay, amountPerClickDisplay } from "./upgradesAndBuildings.js";
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


function updateStats(){
    clicksDisplay.innerText = stats.clicks;
    clicksPerSecondDisplay.innerText = stats.clicksPerSecond;
    amountPerClickDisplay.innerText = stats.amountPerClick;
}
