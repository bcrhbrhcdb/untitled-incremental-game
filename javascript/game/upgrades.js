// upgrades.js

import { stats } from './stats.js';
import { buildings, updateBuildings } from './upgradesAndBuildings.js';
import { updateStats } from './game.js';

export const upgradeTypes = {
   BUILDING_MULTIPLIER: 'buildingMultiplier',
   CLICK_MULTIPLIER: 'clickMultiplier',
   UNLOCK_BUILDING: 'unlockBuilding',
   UNLOCK_RESEARCH: 'unlockResearch',
   OFFLINE_BOOST: 'offlineBoost' // New type for offline boosts
};

export const upgrades = [
   {
       id: 'autoClickerBoost',
       name: 'Auto Clicker Boost',
       description: 'Doubles the efficiency of Auto Clickers',
       cost: 1000,
       type: upgradeTypes.BUILDING_MULTIPLIER,
       target: 'autoClicker',
       multiplier: 2,
       purchased: false
   },
   {
       id: 'clickBoost',
       name: 'Click Boost',
       description: 'Doubles the value of manual clicks',
       cost: 5000,
       type: upgradeTypes.CLICK_MULTIPLIER,
       multiplier: 2,
       purchased: false
   },
   {
       id: 'unlockCookieClickerFan',
       name: 'Unlock Cookie Clicker Fan',
       description: 'Unlocks the Cookie Clicker Fan building',
       cost: 10000,
       type: upgradeTypes.UNLOCK_BUILDING,
       target: 'cookieClickerFan',
       purchased: false
   },
   {
       id: 'offlineEarningsBoost',
       name: 'Offline Earnings Boost',
       description: 'Increases offline earnings by 50%',
       cost: 20000,
       type: upgradeTypes.OFFLINE_BOOST,
       multiplier: 0.5, // Increase by 50%
       purchased: false
   },
   {
       id: 'unlockResearch',
       name: 'Unlock Research',
       description: 'Unlocks the Research feature',
       cost: 50000,
       type: upgradeTypes.UNLOCK_RESEARCH,
       purchased: false
   }
];

export function checkUpgradeAvailability() {
   upgrades.forEach(upgrade => {
      if (!upgrade.purchased && stats.totalClicks >= upgrade.cost) {
          const upgradeElement = document.getElementById(upgrade.id);
          if (!upgradeElement) {
              createUpgradeButton(upgrade);
          }
      }
   });
}

function createUpgradeButton(upgrade) {
   const upgradeArea = document.getElementById('upgrade-area');
   const button = document.createElement('button');
   button.id = upgrade.id;
   button.innerHTML = `
      <strong>${upgrade.name}</strong>
      <br>
      Cost: ${upgrade.cost} clicks
      <br>
      <small>${upgrade.description}</small>
   `;
   button.onclick = () => purchaseUpgrade(upgrade);
   upgradeArea.appendChild(button);
}

function purchaseUpgrade(upgrade) {
   if (stats.clicks >= upgrade.cost && !upgrade.purchased) {
      stats.clicks -= upgrade.cost;
      upgrade.purchased = true;

      applyUpgrade(upgrade);

      document.getElementById(upgrade.id).remove();
      updateStats();
      updateBuildings();
   }
}

function applyUpgrade(upgrade) {
   switch (upgrade.type) {
      case upgradeTypes.BUILDING_MULTIPLIER:
          buildings[upgrade.target].multiplier *= upgrade.multiplier;
          break;
      case upgradeTypes.CLICK_MULTIPLIER:
          stats.clickMultiplier *= upgrade.multiplier;
          break;
      case upgradeTypes.UNLOCK_BUILDING:
          buildings[upgrade.target].unlocked = true;
          break;
      case upgradeTypes.OFFLINE_BOOST:
          stats.offlineBoost += upgrade.multiplier; // Increase offline boost
          break;
      case upgradeTypes.UNLOCK_RESEARCH:
          document.getElementById('researchButton').style.display = 'inline-block';
          break;
   }
}

