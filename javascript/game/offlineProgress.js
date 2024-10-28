// offlineProgress.js

import { stats } from './stats.js';
import { buildings } from './upgradesAndBuildings.js';

export function calculateOfflineProgress() {
    const lastLoginTime = localStorage.getItem('lastLoginTime');
    const currentTime = Date.now();
    
    if (lastLoginTime) {
        const timeOffline = Math.floor((currentTime - lastLoginTime) / 1000); // in seconds
        const clicksPerSecond = calculateClicksPerSecond();
        
        // Calculate total clicks earned while offline, applying any boosts
        const totalClicksEarned = clicksPerSecond * timeOffline * (1 + (stats.offlineBoost || 0));

        stats.clicks += totalClicksEarned; 
        stats.totalClicks += totalClicksEarned;

        // Show popup notification
        alert(`You've earned ${totalClicksEarned.toFixed(2)} clicks while you were offline! 
               Time away: ${timeOffline} seconds.
               Offline Earnings Boost Applied: ${(stats.offlineBoost || 0) * 100}%`);
    }

    localStorage.setItem('lastLoginTime', currentTime);
}

function calculateClicksPerSecond() {
    let totalCPS = 0;
    
    Object.values(buildings).forEach(building => {
        if (building.unlocked) {
            totalCPS += building.type.getValue(building, false) * building.multiplier;
        }
    });
    
    return totalCPS;
}