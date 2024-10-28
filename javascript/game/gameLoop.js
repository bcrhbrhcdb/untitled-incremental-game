// gameLoop.js

import { stats } from "./stats.js";
import { updateStats } from "./game.js";
import { updateBuildings, applyBuildingEffects } from "./upgradesAndBuildings.js";
import { checkUpgradeAvailability } from "./upgrades.js";
import { checkResearchAvailability } from "./research.js";

export const TICKS_PER_SECOND = 20;
export const TICK_INTERVAL = 1000 / TICKS_PER_SECOND;

export function gameTick() {
    applyBuildingEffects(1 / TICKS_PER_SECOND);
    
    // Update UI
    updateStats();
    updateBuildings();
    checkUpgradeAvailability();
    checkResearchAvailability();
}

export function startGameLoop() {
    setInterval(gameTick, TICK_INTERVAL);
}