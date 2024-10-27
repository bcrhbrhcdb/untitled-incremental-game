// save.js

import { stats } from './stats.js';
import { buildings, recalculateClicksPerSecond, updateBuildingValues } from './upgradesAndBuildings.js';
import { updateBuildings } from './upgradesAndBuildings.js';

const SAVE_KEY = 'idleGameSave';
const VERSION = '0.0.12';

export function saveGame() {
    const saveData = {
        stats: stats,
        buildings: Object.entries(buildings).reduce((acc, [key, building]) => {
            acc[key] = {
                owned: building.owned,
                cost: building.cost
            };
            return acc;
        }, {}),
        version: VERSION
    };
    
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    console.log('Game saved successfully');
}

export function loadGame() {
    const savedData = localStorage.getItem(SAVE_KEY);
    
    if (savedData) {
        const parsedData = JSON.parse(savedData);
        
        // Restore stats
        Object.assign(stats, parsedData.stats);
        
        // Restore buildings
        Object.entries(parsedData.buildings).forEach(([key, savedBuilding]) => {
            if (buildings[key]) {
                buildings[key].owned = savedBuilding.owned;
                buildings[key].cost = savedBuilding.cost;
                // The 'value' property is not loaded from save data
                // It will use the current value defined in the code
            }
        });
        
        // Update building values and recalculate clicksPerSecond
        updateBuildingValues();
        recalculateClicksPerSecond();
        
        console.log('Game loaded successfully');
        console.log(`Clicks per second updated to: ${stats.clicksPerSecond}`);
        return true;
    } else {
        console.log('No saved game found');
        return false;
    }
}

export function clearSave() {
    localStorage.removeItem(SAVE_KEY);
    resetGameState();
    console.log('Save data cleared and game state reset');
}

export function resetGameState() {
    // Reset stats
    Object.keys(stats).forEach(key => {
        if (typeof stats[key] === 'number') {
            stats[key] = 0;
        } else if (Array.isArray(stats[key])) {
            stats[key] = [];
        }
    });
    stats.amountPerClick = 1;

    // Reset buildings
    Object.values(buildings).forEach(building => {
        building.owned = 0;
        building.cost = building.initialCost || 20; // Assuming 20 is the default initial cost
    });

    // Recalculate clicksPerSecond and update UI
    recalculateClicksPerSecond();
    updateBuildings();
    updateBuildingValues();
}