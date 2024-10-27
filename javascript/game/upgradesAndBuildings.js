// upgradesAndBuildings.js

import { stats } from "./stats.js";
import { updateStats } from "./game.js";

export const clicksPerSecondDisplay = document.getElementById("clicksPerSecondDisplay");
export const clicksDisplay = document.getElementById("clicksDisplay");
export const totalClicksDisplay = document.getElementById("totalClicksDisplay");
const buildingArea = document.getElementById("buildingArea");

export const buildings = {
    autoClicker: {
        name: "Auto Clicker",
        cost: 20,
        value: 0.25,
        owned: 0,
        increaseInterval: 1.093
    }
    // Add more buildings here
};

const buildingFunctions = (building, buildingKey) => {
    if (!document.getElementById(buildingKey)) {
        const newButton = document.createElement('button');
        newButton.className = 'buttonTypeOne';
        newButton.id = buildingKey;
        newButton.innerHTML = `
            ${building.name}<br>
            Owned: <span class="${buildingKey}-owned">${building.owned}</span><br>
            Costs: <span class="${buildingKey}-cost">${building.cost.toFixed(0)}</span><br>
            Gives: ${building.value.toFixed(2)} per second
        `;

        newButton.addEventListener("click", () => {
            if (stats.clicks >= building.cost) {
                stats.clicks -= building.cost;
                building.owned++;
                building.cost = Math.floor(building.cost * building.increaseInterval);
                stats.upgradesOwned++;
                stats.totalBuildings++;
                if (!stats.buildings.includes(building.name)) {
                    stats.buildings.push(building.name);
                }
                stats.clicksPerSecond += building.value;
                updateBuilding(buildingKey);
                updateStats();
            }
        });
        buildingArea.appendChild(newButton);
    }
    updateBuilding(buildingKey);
};

function updateBuilding(buildingKey) {
    const building = buildings[buildingKey];
    const buttonElement = document.getElementById(buildingKey);
    if (buttonElement) {
        buttonElement.querySelector(`.${buildingKey}-owned`).textContent = building.owned;
        buttonElement.querySelector(`.${buildingKey}-cost`).textContent = building.cost.toFixed(0);
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