import { stats } from './stats.js';
import { buildings } from './upgradesAndBuildings.js';

export function saveGame() {
    const saveData = {
        stats: { ...stats }, // Clone the stats object
        buildings: Object.entries(buildings).reduce((acc, [key, building]) => ({
            ...acc,
            [key]: { owned: building.owned, cost: building.cost }
        }), {}),
        version: '0.0.13' // Update this version as needed
    };

    localStorage.setItem('game_save', JSON.stringify(saveData));
}

export function loadGame() {
    const saveDataString = localStorage.getItem('game_save');
    
    if (!saveDataString) return false; // No saved game found

    try {
        const saveData = JSON.parse(saveDataString);
        
        // Restore stats
        Object.assign(stats, saveData.stats);
        
        // Restore buildings
        Object.entries(saveData.buildings).forEach(([key, savedBuilding]) => {
            if (buildings[key]) {
                buildings[key].owned = savedBuilding.owned;
                buildings[key].cost = savedBuilding.cost;
            }
        });
        
        return true; // Successfully loaded
    } catch (error) {
        console.error('Error loading game:', error);
        return false; // Failed to load
    }
}

export function clearSave() {
    localStorage.removeItem('game_save');
}