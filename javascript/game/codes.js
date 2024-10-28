// code.js

export const codes = {
    starterBundle: {
        gives: 200,
        duration: 60, // Duration in seconds
        expirationDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day expiration
        howManyUses: 1,
        description: "Gives you 200 clicks. Expires in 24 hours."
    },
    speedBoost: {
        gives: null, // No direct clicks, just speed up time
        duration: 120, // Duration in seconds
        expirationDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day expiration
        howManyUses: Infinity,
        description: "Speeds up time for all actions for 2 minutes. Expires in 24 hours."
    }
};

// Function to apply the boost
export function applyCode(codeKey) {
    const code = codes[codeKey];
    if (!code) return false; // Return false if the code doesn't exist

    const now = new Date();
    
    if (now > code.expirationDate) {
        alert("This code has expired.");
        return false; // Return false if the code has expired
    }

    if (code.gives !== null) {
        stats.clicks += code.gives; // Add clicks directly
    } else {
        // Speed boost logic (for example, reduce tick interval)
        TICK_INTERVAL /= 2; // Example of speeding up time
        setTimeout(() => {
            TICK_INTERVAL *= 2; // Resetting back to normal after duration
        }, code.duration * 1000);
    }

    alert(`Applied ${code.description}`);
    return true; // Return true if the code was successfully applied
}

// Handle applying codes from the input field
const applyCodeButton = document.getElementById('applyCodeButton');
const codeInput = document.getElementById('codeInput');
const codeMessage = document.getElementById('codeMessage');

applyCodeButton.addEventListener('click', () => {
    const code = codeInput.value.trim();
    
    if (code) {
        const result = applyCode(code); // Function to apply the code
        if (result) {
            codeMessage.innerText = `Code applied successfully!`;
        } else {
            codeMessage.innerText = `Invalid code or already used.`;
        }
    } else {
        codeMessage.innerText = `Please enter a valid code.`;
    }
});

// Function to show/hide the codes area
function toggleCodesArea() {
    const codesArea = document.getElementById('codes-area');
    codesArea.style.display = codesArea.style.display === 'none' ? 'block' : 'none';
}

// Add event listener to toggle codes area when the button is clicked
document.getElementById('codes').addEventListener('click', () => {
    console.log("Codes button clicked"); // Debugging log
    toggleCodesArea();
});