// save.js

import { stats } from './stats.js';
import { buildings, updateBuildings, recalculateClicksPerSecond } from './upgradesAndBuildings.js';
import { updateStats } from './game.js';

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
            }
        });
        
        // Update building values and recalculate clicksPerSecond
        updateBuildings();
        recalculateClicksPerSecond();
        updateStats();
        
        console.log('Game loaded successfully');
        return true;
    } else {
        console.log('No saved game found');
        return false;
    }
}

export function clearSave() {
    localStorage.removeItem(SAVE_KEY);
    console.log('Save data cleared');
}