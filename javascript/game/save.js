// save.js

import { stats } from './stats.js';
import { buildings } from './upgradesAndBuildings.js';

const SAVE_KEY = 'idleGameSave';
const VERSION = '0.0.11'; // Make sure this matches your current game version

export function saveGame() {
    const saveData = {
        stats: stats,
        buildings: buildings,
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
        
        // Restore buildings and recalculate clicksPerSecond
        let newClicksPerSecond = 0;
        Object.keys(parsedData.buildings).forEach(key => {
            if (buildings[key]) {
                const savedBuilding = parsedData.buildings[key];
                const currentBuilding = buildings[key];
                
                // Update owned count
                currentBuilding.owned = savedBuilding.owned;
                
                // Recalculate clicksPerSecond with new value
                newClicksPerSecond += currentBuilding.value * currentBuilding.owned;
            }
        });
        
        // Update clicksPerSecond with the new calculated value
        stats.clicksPerSecond = newClicksPerSecond;
        
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
    console.log('Save data cleared');
}