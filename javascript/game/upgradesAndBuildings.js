// upgradesAndBuildings.js

import { stats } from "./stats.js";
import { updateStats, calculateManualClickValue } from "./game.js";
import { TICKS_PER_SECOND } from "./gameLoop.js";

export const clicksPerSecondDisplay = document.getElementById("clicksPerSecondDisplay");
export const clicksDisplay = document.getElementById("clicksDisplay");
export const totalClicksDisplay = document.getElementById("totalClicksDisplay");
const buildingArea = document.getElementById("buildingArea");
export const upgradeArea = document.getElementById("upgrade-area");

export const buildingTypes = {
    PASSIVE: {
        isPassive: true,
        getValue: (building, individual = false) => {
            if (individual) {
                return building.value.baseValue;
            }
            return building.value.baseValue * building.owned;
        }
    },
    SCALEWITHBUILDING: {
        isPassive: true,
        getValue: (building, individual = false) => {
            const scalingBuilding = buildings[building.value.scalingBuilding];
            if (scalingBuilding) {
                const scaledValue = building.value.baseValue * Math.pow(1.1, scalingBuilding.owned);
                if (individual) {
                    return scaledValue;
                }
                return scaledValue * building.owned;
            }
            return 0;
        }
    },
    ONMANUALCLICK: {
        isPassive: false,
        getValue: (building, individual = false) => {
            if (individual) {
                return building.value.baseValue;
            }
            return building.value.baseValue * building.owned;
        }
    },
    EXPONENTIAL: {
        isPassive: true,
        getValue: (building, individual = false) => {
            const value = building.value.baseValue * Math.pow(1.15, building.owned);
            if (individual) {
                return value;
            }
            return value * building.owned;
        }
    },
    MULTIPLICATIVE: {
        isPassive: true,
        getValue: (building, individual = false) => {
            const value = building.value.baseValue * (building.owned + 1);
            if (individual) {
                return value;
            }
            return value * building.owned;
        }
    }
};

export const buildings = {
    autoClicker: {
        name: "Auto Clicker",
        cost: 20,
        initialCost: 20,
        value: {
            description: "Automatically clicks once every 0.25 seconds.",
            baseValue: 0.25,
        },
        owned: 0,
        costMultiplier: 1.15,
        multiplier: 1,
        type: buildingTypes.PASSIVE,
        unlocked: false
    },
    cookieClickerFan: {
        name: "Cookie Clicker Fan",
        cost: 100,
        initialCost: 100,
        value: {
            description: "Helps you click more efficiently. Scales with Auto Clickers.",
            baseValue: 1,
            scalingBuilding: "autoClicker"
        },
        owned: 0,
        costMultiplier: 1.2,
        multiplier: 1,
        type: buildingTypes.SCALEWITHBUILDING,
        unlocked: false
    },
    manualClicker: {
        name: "Manual Clicker",
        cost: 50,
        initialCost: 50,
        value: {
            description: "Adds extra clicks when you manually click.",
            baseValue: 1,
        },
        owned: 0,
        costMultiplier: 1.1,
        multiplier: 1,
        type: buildingTypes.ONMANUALCLICK,
        unlocked: false
    },
    clickFactory: {
        name: "Click Factory",
        cost: 500,
        initialCost: 500,
        value: {
            description: "Produces clicks at an industrial scale.",
            baseValue: 5,
        },
        owned: 0,
        costMultiplier: 1.25,
        multiplier: 1,
        type: buildingTypes.EXPONENTIAL,
        unlocked: false
    },
    clickMultiplier: {
        name: "Click Multiplier",
        cost: 1000,
        initialCost: 1000,
        value: {
            description: "Multiplies the value of all clicks.",
            baseValue: 0.1,
        },
        owned: 0,
        costMultiplier: 1.3,
        multiplier: 1,
        type: buildingTypes.MULTIPLICATIVE,
        unlocked: false
    }
};

export function onManualClick(calculateOnly = false) {
    let additionalClicks = 0;
    Object.values(buildings).forEach(building => {
        if (building.type === buildingTypes.ONMANUALCLICK && building.unlocked) {
            additionalClicks += building.type.getValue(building, false) * building.multiplier;
        }
    });
    if (!calculateOnly) {
        stats.clicks += additionalClicks * stats.clickMultiplier;
        stats.totalClicks += additionalClicks * stats.clickMultiplier;
        stats.allTimeClicks += additionalClicks * stats.clickMultiplier;
    }
    return additionalClicks * stats.clickMultiplier;
}

const buildingFunctions = (building, buildingKey) => {
    let buttonElement = document.getElementById(buildingKey);
    if (!buttonElement && building.unlocked) {
        buttonElement = document.createElement('button');
        buttonElement.className = 'buttonTypeOne';
        buttonElement.id = buildingKey;
        buttonElement.innerHTML = `
            <strong>${building.name}</strong> (<span class="${buildingKey}-owned">0</span>)
            <br>
            Cost: <span class="${buildingKey}-cost">${building.cost.toFixed(0)}</span>
            <br>
            <span class="${buildingKey}-value">0</span> ${building.type.isPassive ? '/s' : ' per use'} each
            <br>
            Total: <span class="${buildingKey}-total">0</span> ${building.type.isPassive ? '/s' : ' per use'}
            <br>
            <small>${building.value.description}</small>
        `;
        buildingArea.appendChild(buttonElement);
    }

    if (buttonElement) {
        buttonElement.onclick = () => {
            if (stats.clicks >= building.cost) {
                stats.clicks -= building.cost;
                building.owned++;
                building.cost = Math.floor(building.cost * building.costMultiplier);
                stats.upgradesOwned++;
                stats.totalBuildings++;
                if (!stats.buildings.includes(building.name)) {
                    stats.buildings.push(building.name);
                }
                updateBuilding(buildingKey);
                recalculateClicksPerSecond();
                updateStats();
            }
        };

        updateBuilding(buildingKey);
    }
};

function updateBuilding(buildingKey) {
    const building = buildings[buildingKey];
    const buttonElement = document.getElementById(buildingKey);
    if (buttonElement) {
        const individualValue = building.type.getValue(building, true) * building.multiplier;
        const totalValue = building.type.getValue(building, false) * building.multiplier;
        const valueText = building.type.isPassive ? '/s' : ' per use';
        
        const ownedElement = buttonElement.querySelector(`.${buildingKey}-owned`);
        const costElement = buttonElement.querySelector(`.${buildingKey}-cost`);
        const valueElement = buttonElement.querySelector(`.${buildingKey}-value`);
        const totalElement = buttonElement.querySelector(`.${buildingKey}-total`);

        if (ownedElement) ownedElement.textContent = building.owned;
        if (costElement) costElement.textContent = building.cost.toFixed(0);
        if (valueElement) valueElement.textContent = individualValue.toFixed(2);
        if (totalElement) totalElement.textContent = totalValue.toFixed(2);

        buttonElement.disabled = stats.clicks < building.cost;
    }
}

export function updateBuildings() {
    Object.entries(buildings).forEach(([key, building]) => {
        if (building.unlocked) {
            buildingFunctions(building, key);
        }
    });
}

export function applyBuildingEffects(delta) {
    Object.values(buildings).forEach(building => {
        if (building.type.isPassive && building.unlocked) {
            const clicksGenerated = building.type.getValue(building, false) * building.multiplier * delta;
            stats.clicks += clicksGenerated;
            stats.totalClicks += clicksGenerated;
            stats.allTimeClicks += clicksGenerated;
        }
    });
}

export function recalculateClicksPerSecond() {
    stats.clicksPerSecond = 0;
    Object.values(buildings).forEach(building => {
        if (building.type.isPassive && building.unlocked) {
            stats.clicksPerSecond += building.type.getValue(building, false) * building.multiplier;
        }
    });
}

export function resetBuildings() {
    Object.values(buildings).forEach(building => {
        building.owned = 0;
        building.cost = building.initialCost;
        building.multiplier = 1;
        building.unlocked = false;
    });
    recalculateClicksPerSecond();
}