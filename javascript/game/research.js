// research.js
import { stats } from './stats.js';
import { buildings } from './upgradesAndBuildings.js';
import { updateStats } from './game.js';

export const researchTypes = {
    BUILDING_EFFICIENCY: 'buildingEfficiency',
    CLICK_EFFICIENCY: 'clickEfficiency',
    COST_REDUCTION: 'costReduction'
};

export const researchProjects = [
    {
        id: 'autoClickerEfficiency',
        name: 'Auto Clicker Efficiency',
        description: 'Increases Auto Clicker efficiency by 50%',
        cost: 100000,
        duration: 60, // seconds
        type: researchTypes.BUILDING_EFFICIENCY,
        target: 'autoClicker',
        multiplier: 1.5,
        completed: false,
        progress: 0
    },
    {
        id: 'clickEfficiency',
        name: 'Click Efficiency',
        description: 'Increases manual click value by 25%',
        cost: 250000,
        duration: 120,
        type: researchTypes.CLICK_EFFICIENCY,
        multiplier: 1.25,
        completed: false,
        progress: 0
    },
    {
        id: 'buildingCostReduction',
        name: 'Building Cost Reduction',
        description: 'Reduces the cost of all buildings by 10%',
        cost: 500000,
        duration: 180,
        type: researchTypes.COST_REDUCTION,
        multiplier: 0.9,
        completed: false,
        progress: 0
    }
];

export function checkResearchAvailability() {
    researchProjects.forEach(project => {
        if (!project.completed && stats.totalClicks >= project.cost) {
            const researchElement = document.getElementById(project.id);
            if (!researchElement) {
                createResearchButton(project);
            }
        }
    });
}

function createResearchButton(project) {
    const researchArea = document.getElementById('research-area');
    const button = document.createElement('button');
    button.id = project.id;
    button.className = 'research-button';
    button.innerHTML = `
        <strong>${project.name}</strong>
        <br>
        Cost: ${project.cost} clicks
        <br>
        Duration: ${project.duration} seconds
        <br>
        <small>${project.description}</small>
        <div class="research-progress-bar" style="width: 0%;"></div>
    `;
    button.onclick = () => startResearch(project);
    researchArea.appendChild(button);
}

function startResearch(project) {
    if (stats.clicks >= project.cost && !project.completed && project.progress === 0) {
        stats.clicks -= project.cost;
        project.progress = 0;
        updateResearchProgress(project);
        const interval = setInterval(() => {
            project.progress += 1 / project.duration;
            updateResearchProgress(project);
            if (project.progress >= 1) {
                clearInterval(interval);
                completeResearch(project);
            }
        }, 1000);
        updateStats();
    }
}

function updateResearchProgress(project) {
    const progressBar = document.querySelector(`#${project.id} .research-progress-bar`);
    progressBar.style.width = `${project.progress * 100}%`;
}

function completeResearch(project) {
    project.completed = true;
    applyResearch(project);
    document.getElementById(project.id).remove();
    updateStats();
}

function applyResearch(project) {
    switch (project.type) {
        case researchTypes.BUILDING_EFFICIENCY:
            buildings[project.target].multiplier = (buildings[project.target].multiplier || 1) * project.multiplier;
            break;
        case researchTypes.CLICK_EFFICIENCY:
            stats.clickMultiplier *= project.multiplier;
            break;
        case researchTypes.COST_REDUCTION:
            Object.values(buildings).forEach(building => {
                building.costMultiplier *= project.multiplier;
            });
            break;
    }
}

// Add this new function to handle the research button click
export function setupResearchButton() {
    const researchButton = document.getElementById('researchButton');
    const researchArea = document.getElementById('research-area');

    researchButton.addEventListener('click', () => {
        if (researchArea.style.display === 'none') {
            researchArea.style.display = 'block';
        } else {
            researchArea.style.display = 'none';
        }
    });
}