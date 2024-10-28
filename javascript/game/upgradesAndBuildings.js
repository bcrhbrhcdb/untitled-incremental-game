import { stats } from "./stats.js"; 
import { updateStats } from "./game.js"; 

export const clicksPerSecondDisplay = document.getElementById("clicksPerSecondDisplay");
export const clicksDisplay = document.getElementById("clicksDisplay");
export const totalClicksDisplay = document.getElementById("totalClicksDisplay");

const buildingArea = document.getElementById("buildingArea");

export const buildingTypes = {
    PASSIVE: {
        isPassive: true,
        getValue: (building, individual = false) => individual ? building.value.baseValue : building.value.baseValue * building.owned,
    },
    SCALEWITHBUILDING: {
        isPassive: true,
        getValue: (building, individual = false) => {
            const scalingBuilding = buildings[building.value.scalingBuilding];
            if (scalingBuilding) {
                const scaledValue = building.value.baseValue * Math.pow(1.1, scalingBuilding.owned);
                return individual ? scaledValue : scaledValue * building.owned;
            }
            return 0;
        },
    },
};

export const buildings = {
   autoClicker: { 
       name: "Auto Clicker",
       cost: 20,
       initialCost: 20,
       value: { description: "Automatically clicks once every 0.25 seconds.", baseValue: 0.25 },
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
       value: { description: "Helps you click more efficiently. Scales with Auto Clickers.", baseValue: 1, scalingBuilding:"autoClicker" },
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
       value:{ description:"Adds extra clicks when you manually click.", baseValue:1 },
       owned:0,
       costMultiplier:1.1,
       multiplier:1,
       type:buildingTypes.ONMANUALCLICK,
       unlocked:false
   },
   clickFactory:{
       name:"Click Factory",
       cost:500,
       initialCost:500,
       value:{ description:"Produces clicks at an industrial scale.", baseValue:5 },
       owned:0,
       costMultiplier: 1.25,
       multiplier:1,
       type:buildingTypes.EXPONENTIAL,
       unlocked:false
   },
   clickMultiplier:{
       name:"Click Multiplier",
       cost:1000,
       initialCost:1000,
       value:{ description:"Multiplies the value of all clicks.", baseValue:.1 },
       owned:0,
       costMultiplier: 1.3,
       multiplier:1,
       type:buildingTypes.MULTIPLICATIVE,
       unlocked:false
   }
};

export function onManualClick(calculateOnly = false) {
   let additionalClicks = 0;
   Object.values(buildings).forEach(building => { 
       if (building.type === buildingTypes.ONMANUALCLICK && building.unlocked) {
           additionalClicks += building.type.getValue(building, false);
       }
   });
   if (!calculateOnly) {
       stats.clicks += additionalClicks * stats.clickMultiplier;
       stats.totalClicks += additionalClicks * stats.clickMultiplier;
       
      try {
          updateStats();
      } catch (error) {
          console.error("Error updating stats after manual click:", error);
      }
   }
   return additionalClicks * stats.clickMultiplier;
}

const buildingFunctions = (building, key) => {
   let buttonElement = document.getElementById(key);
   if (!buttonElement && building.unlocked) {
       buttonElement = document.createElement('button');
       buttonElement.className='buttonTypeOne'; 
       buttonElement.id=key;
       
      buttonElement.innerHTML=`
           <strong>${building.name}</strong> (<span class="${key}-owned">0</span>)
           <br>
           Cost:<span class="${key}-cost">${building.cost.toFixed(0)}</span>
           <br>
           <span class="${key}-value">0</span> ${building.type.isPassive ? '/s' : ' per use'} each
           <br>
           Total:<span class="${key}-total">0</span> ${building.type.isPassive ? '/s' : ' per use'}
           <br>
           <small>${building.value.description}</small>
       `;
       
      document.getElementById('buildingArea').appendChild(buttonElement);
      buttonElement.onclick=()=>{ 
           if (stats.clicks >= Math.floor(building.cost)) { 
               stats.clicks -= Math.floor(building.cost); 
               building.owned++; 
               building.cost *= Math.pow(building.costMultiplier, Math.floor(building.owned / 10)); 
               updateBuilding(key);
               updateStats(); 
           } else {
               console.error("Not enough clicks to purchase the building.");
               alert("Not enough clicks to purchase this building."); 
           }
      };
      updateBuilding(key);
   }
   if (buttonElement) { updateBuilding(key); }
};

function updateBuilding(key) {
   const building = buildings[key];
   const buttonElement = document.getElementById(key);
   if (buttonElement) {
      const ownedCount = buttonElement.querySelector(`.${key}-owned`);
      const costCount = buttonElement.querySelector(`.${key}-cost`);
      const valueCount = buttonElement.querySelector(`.${key}-value`);
      const totalCount = buttonElement.querySelector(`.${key}-total`);
      
      ownedCount.textContent = building.owned;
      costCount.textContent = Math.floor(building.cost).toFixed(0);
      valueCount.textContent = building.type.getValue(building, true).toFixed(2);
      totalCount.textContent = building.type.getValue(building, false).toFixed(2);
      
      buttonElement.disabled = stats.clicks < Math.floor(building.cost);
   } else {
      console.error(`Button element for ${key} not found.`);
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
          const clicksGenerated = building.type.getValue(building, false); 
          stats.clicks += clicksGenerated * delta; 
          stats.totalClicks += clicksGenerated * delta; 
          try{
              updateStats(); 
          } catch(error){
              console.error("Error updating UI with new totals:", error);
          }
      }
   });
}

export function recalculateClicksPerSecond() {
   try{
      stats.clicksPerSecond = 0; 
      Object.values(buildings).forEach(building => { 
         if (building.type.isPassive && building.unlocked) { 
             stats.clicksPerSecond += building.type.getValue(building, false);
         }
      });
      
     try{
         updateStats(); 
     } catch(error){
         console.error("Error updating UI after recalculating CPS:", error);
     }

   } catch (error) {
      console.error("Error recalculating clicks per second:", error);
   }
}

export function resetBuildings() {
   Object.values(buildings).forEach(building => { 
      building.owned = 0; 
      building.cost = building.initialCost; 
      building.unlocked = false; // Reset unlocked status too
   }); 
   
   recalculateClicksPerSecond();
}