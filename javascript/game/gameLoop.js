// gameLoop.js

import { stats } from "./stats.js";
import { updateStats } from "./game.js";
import { updateBuildings } from "./upgradesAndBuildings.js";

const TICKS_PER_SECOND = 20;
const TICK_INTERVAL = 1000 / TICKS_PER_SECOND;

function gameTick() {
    // Update clicks based on clicksPerSecond
    stats.clicks += stats.clicksPerSecond / TICKS_PER_SECOND;
    stats.totalClicks += stats.clicksPerSecond / TICKS_PER_SECOND;

    // Update UI
    updateStats();
    updateBuildings();
}

export function startGameLoop() {
    setInterval(gameTick, TICK_INTERVAL);
}