// gameLoop.js

import { stats } from "./stats.js";
import { totalClicksDisplay, updateBuildings } from "./upgradesAndBuildings.js";
import { updateStats } from "./game.js";
import {clicksPerSecondDisplay} from "./upgradesAndBuildings.js"
const TICKS_PER_SECOND = 20;
const TICK_INTERVAL = 1000 / TICKS_PER_SECOND; // 50ms

let tickCount = 0;

function gameTick() {
    tickCount++;

    // Handle passive income
    stats.clicks += stats.clicksPerSecond / TICKS_PER_SECOND;
    clicksPerSecondDisplay.innerText = stats.clicksPerSecond;
    totalClicksDisplay.innerText += TICKS_PER_SECOND / TICKS_PER_SECOND;
    stats.totalClicks += stats.clicksPerSecond / TICKS_PER_SECOND;

    // Update stats every tick
    updateStats();

    // Check for new buildings every second (every 20 ticks)
    if (tickCount % TICKS_PER_SECOND === 0) {
        updateBuildings();
    }

    // Add any other per-tick logic here
}

export function startGameLoop() {
    setInterval(gameTick, TICK_INTERVAL);
}

export { TICKS_PER_SECOND, TICK_INTERVAL };