// ===== PROGRESSIVE TEASING GAME FOR YES/NO BUTTONS =====
// Add this to your existing script.js

let gameStage = 0;
let yesButtonScale = 1;
let noButtonScale = 1;
let buttonsSwapped = false;

// Replace your existing makeNoButtonDodge function with this:
function makeNoButtonDodge() {
    const button = document.getElementById('noButton');
    const yesButton = document.getElementById('yesButton');
    
    gameStage++;
    
    // STAGE 1: SWAP POSITIONS (First hover - Confusion!)
    if (gameStage === 1) {
        swapButtons();
        showMessage("Oops! They switched places! 😏");
        moveNoButton();
        return;
    }
    
    // STAGE 2: SIZE CHANGES (Second hover - The Hint!)
    if (gameStage === 2) {
        yesButtonScale = 1.3;
        noButtonScale = 0.8;
        yesButton.style.transform = `scale(${yesButtonScale})`;
        button.style.transform = `scale(${noButtonScale})`;
        showMessage("Hmm... which one feels right? 🤔");
        moveNoButton(1.5);
        return;
    }
    
    // STAGE 3+: OBVIOUS CHOICE (Third hover onwards - Make it clear!)
    if (gameStage >= 3) {
        yesButtonScale = Math.min(1.6, yesButtonScale + 0.15);
        noButtonScale = Math.max(0.65, noButtonScale - 0.08); // Minimum 65% size
        
        yesButton.style.transform = `scale(${yesButtonScale})`;
        button.style.transform = `scale(${noButtonScale})`;
        
        if (gameStage === 3) {
            showMessage("Come on... it's obvious! 💕");
        } else if (gameStage >= 5) {
            showMessage("Just click YES already! 😈");
        }
        
        moveNoButton(2); // Move faster!
    }
}

function swapButtons() {
    const container = document.querySelector('.button-container');
    const yesButton = document.getElementById('yesButton');
    const noButton = document.getElementById('noButton');
    
    if (!buttonsSwapped) {
        container.insertBefore(noButton, yesButton);
        buttonsSwapped = true;
    } else {
        container.insertBefore(yesButton, noButton);
        buttonsSwapped = false;
    }
}

function moveNoButton(speedMultiplier = 1) {
    const button = document.getElementById('noButton');
    const yesButton = document.getElementById('yesButton');
    
    // Calculate random position
    const maxX = window.innerWidth - 200;
    const maxY = window.innerHeight - 200;
    const minX = 50;
    const minY = 50;
    
    let newX = Math.random() * (maxX - minX) + minX;
    let newY = Math.random() * (maxY - minY) + minY;
    
    // Avoid YES button area
    const yesRect = yesButton.getBoundingClientRect();
    const distance = Math.sqrt(
        Math.pow(newX - yesRect.left, 2) + 
        Math.pow(newY - yesRect.top, 2)
    );
    
    if (distance < 200 * speedMultiplier) {
        newX = newX < yesRect.left ? newX - 150 : newX + 150;
        newY = newY < yesRect.top ? newY - 150 : newY + 150;
    }
    
    // Keep within bounds
    newX = Math.max(minX, Math.min(maxX, newX));
    newY = Math.max(minY, Math.min(maxY, newY));
    
    button.style.position = 'fixed';
    button.style.left = newX + 'px';
    button.style.top = newY + 'px';
    button.style.transition = `all ${0.3 / speedMultiplier}s ease`;
}

function showMessage(text) {
    // Create temporary teasing message
    const msg = document.createElement('div');
    msg.textContent = text;
    msg.style.cssText = `
        position: fixed;
        top: 20%;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(255, 64, 129, 0.95);
        color: white;
        padding: 1rem 2rem;
        border-radius: 50px;
        font-size: 1.3rem;
        font-weight: 600;
        z-index: 1000;
        animation: fadeInOut 2s ease;
        box-shadow: 0 10px 40px rgba(255, 64, 129, 0.6);
    `;
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 2000);
}

// Add CSS animation for message
const style = document.createElement('style');
style.textContent = `
@keyframes fadeInOut {
    0% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
    20% { opacity: 1; transform: translateX(-50%) translateY(0); }
    80% { opacity: 1; transform: translateX(-50%) translateY(0); }
    100% { opacity: 0; transform: translateX(-50%) translateY(20px); }
}
`;
document.head.appendChild(style);
