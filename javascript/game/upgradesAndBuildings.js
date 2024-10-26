import {stats} from "./stats.js"
export const buildingTYPES = {
    PASSIVE: (building)=>{
        stats.clicksPerSecond += building.value;
    }
}
export const buildings = {
    autoClicker:{
        name: "Auto Clicker",
        cost: 20,
        value: 0.2,
        type: buildingTYPES.PASSIVE
    }
}
const makeBuildingsAppear = (building) => {
    // Check if total clicks meet or exceed the building's cost
    if (stats.totalClicks >= building.cost) {
        const buildingArea = document.getElementById("buildingArea");
        buildingArea.style.display = "block"; // Correctly set display to block

        // Optionally, you can add logic here to display specific building details
        const buildingList = document.createElement("div");
        buildingList.innerText = `You can buy: ${building.name} for ${building.cost} clicks`;
        buildingArea.appendChild(buildingList);
    }
};

// Example usage
makeBuildingsAppear(buildings.autoClicker); // Call the function with a specific building