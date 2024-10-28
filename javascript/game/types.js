// types.js

import { stats } from "./stats.js";
import { buildings } from "./upgradesAndBuildings.js";
import { TICKS_PER_SECOND } from "./gameLoop.js";

export const buildingTypes = {
    PASSIVE: {
        isPassive: true,
        getValue: (building, individual = false) => {
            if (individual) {
                return building.value.baseValue;
            }
            return building.value.baseValue * building.owned;
        },
        effect: (building) => {
            stats.clicksPerSecond += building.value.baseValue * building.owned;
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
        },
        effect: (building) => {
            const value = buildingTypes.SCALEWITHBUILDING.getValue(building, false);
            stats.clicksPerSecond += value;
        }
    },
    ONMANUALCLICK: {
        isPassive: false,
        getValue: (building, individual = false) => {
            if (individual) {
                return building.value.baseValue;
            }
            return building.value.baseValue * building.owned;
        },
        effect: (building) => {
            stats.clicks += building.value.baseValue * building.owned;
            stats.totalClicks += building.value.baseValue * building.owned;
        }
    }
};