// types.js

export const buildingTypes = {
    PASSIVE: (building, stats) => {
        stats.clicksPerSecond += building.value;
    },
    // Add more types here as needed
};