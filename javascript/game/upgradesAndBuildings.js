// upgradesAndBuildings.js

import { stats } from "./stats.js";
import { updateStats } from "./game.js";
import { buildingTypes } from "./types.js";

export const clicksPerSecondDisplay = document.getElementById("clicksPerSecondDisplay");
export const clicksDisplay = document.getElementById("clicksDisplay");
export const totalClicksDisplay = document.getElementById("totalClicksDisplay");
const buildingArea = document.getElementById("buildingArea");
export const upgradeArea = document.getElementById("upgrade-area");

export const buildings = {
    autoClicker: {
        name: "Auto Clicker",
        cost: 20,
        value: 0.20,
        owned: 0,
        increaseInterval: 1.093,
        type: buildingTypes.PASSIVE
    }
    // Add more buildings here
};

const buildingFunctions = (building, buildingKey) => {
    let buttonElement = document.getElementById(buildingKey);
    if (!buttonElement) {
        buttonElement = document.createElement('button');
        buttonElement.className = 'buttonTypeOne';
        buttonElement.id = buildingKey;
        buildingArea.appendChild(buttonElement);
    }

    buttonElement.innerHTML = `
        ${building.name}<br>
        Owned: <span class="${buildingKey}-owned">${building.owned}</span><br>
        Costs: <span class="${buildingKey}-cost">${building.cost.toFixed(0)}</span><br>
        Gives: <span class="${buildingKey}-value">${building.value.toFixed(2)}</span> per second
    `;

    buttonElement.onclick = () => {
        if (stats.clicks >= building.cost) {
            stats.clicks -= building.cost;
            building.owned++;
            building.cost = Math.floor(building.cost * building.increaseInterval);
            stats.upgradesOwned++;
            stats.totalBuildings++;
            if (!stats.buildings.includes(building.name)) {
                stats.buildings.push(building.name);
            }
            recalculateClicksPerSecond();
            updateBuilding(buildingKey);
            updateStats();
        }
    };

    updateBuilding(buildingKey);
};

function updateBuilding(buildingKey) {
    const building = buildings[buildingKey];
    const buttonElement = document.getElementById(buildingKey);
    if (buttonElement) {
        buttonElement.querySelector(`.${buildingKey}-owned`).textContent = building.owned;
        buttonElement.querySelector(`.${buildingKey}-cost`).textContent = building.cost.toFixed(0);
        buttonElement.querySelector(`.${buildingKey}-value`).textContent = building.value.toFixed(2);
        buttonElement.disabled = stats.clicks < building.cost;
    }
}

export function updateBuildings() {
    Object.entries(buildings).forEach(([key, building]) => {
        if (building.owned > 0 || stats.clicks >= building.cost) {
            buildingFunctions(building, key);
        } else {
            const existingButton = document.getElementById(key);
            if (existingButton) {
                existingButton.remove();
            }
        }
    });
}

export function recalculateClicksPerSecond() {
    stats.clicksPerSecond = 0;
    Object.values(buildings).forEach(building => {
        if (building.type === buildingTypes.PASSIVE) {
            stats.clicksPerSecond += building.value * building.owned;
        }
    });
}

export function updateBuildingValues() {
    Object.entries(buildings).forEach(([key, building]) => {
        updateBuilding(key);
    });
    recalculateClicksPerSecond();
}