// importExport.js

import { stats } from './stats.js';
import { buildings, updateBuildings, recalculateClicksPerSecond } from './upgradesAndBuildings.js';
import { updateStats } from './game.js';
import { saveGame } from './save.js';

export function exportSave() {
    const saveData = {
        stats: stats,
        buildings: Object.entries(buildings).reduce((acc, [key, building]) => {
            acc[key] = {
                owned: building.owned,
                cost: building.cost
            };
            return acc;
        }, {}),
        version: '0.0.11'
    };
    
    const saveString = btoa(JSON.stringify(saveData));
    return saveString;
}

export function importSave(saveString) {
    try {
        const saveData = JSON.parse(atob(saveString));
        
        // Restore stats
        Object.assign(stats, saveData.stats);
        
        // Restore buildings
        Object.entries(saveData.buildings).forEach(([key, savedBuilding]) => {
            if (buildings[key]) {
                buildings[key].owned = savedBuilding.owned;
                buildings[key].cost = savedBuilding.cost;
            }
        });
        
        // Update building values and recalculate clicksPerSecond
        updateBuildings();
        recalculateClicksPerSecond();
        updateStats();
        
        // Save the imported data
        saveGame();
        
        console.log('Save data imported successfully');
        return true;
    } catch (error) {
        console.error('Error importing save data:', error);
        return false;
    }
}