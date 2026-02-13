// ===== CONFIGURATION =====
const CONFIG = {
    HEARTS_COUNT: 15,
    CONFETTI_COUNT: 100,
    NO_BUTTON_DODGE_DISTANCE: 150,
    NO_BUTTON_SHRINK_INTERVAL: 3
};

// ===== DOM ELEMENTS =====
const elements = {
    questionPage: document.getElementById('questionPage'),
    successPage: document.getElementById('successPage'),
    yesButton: document.getElementById('yesButton'),
    noButton: document.getElementById('noButton'),
    heartsContainer: document.getElementById('heartsContainer'),
    confettiContainer: document.getElementById('confetti'),
    playAgainButton: document.getElementById('playAgainButton'),
    bgMusic: document.getElementById('bgMusic'),
    musicToggle: document.getElementById('musicToggle'),
    rosePetals: document.getElementById('rosePetals')
};

// ===== STATE =====
let noButtonHoverCount = 0;
let musicPlaying = false;

// ===== PROGRESSIVE TEASING GAME (3 STAGES) =====
let gameStage = 0;
let yesButtonScale = 1;
let noButtonScale = 1;
let buttonsSwapped = false;

function makeNoButtonDodge() {
    const button = elements.noButton;
    const yesButton = elements.yesButton;
    
    gameStage++;
    
    // STAGE 1: SWAP POSITIONS (First hover - Confusion!)
    if (gameStage === 1) {
        swapButtons();
        showTeasingMessage("Oops! They switched places! 😏");
        moveNoButton();
        return;
    }
    
    // STAGE 2: SIZE CHANGES (Second hover - The Hint!)
    if (gameStage === 2) {
        yesButtonScale = 1.3;
        noButtonScale = 0.85;
        yesButton.style.transform = `scale(${yesButtonScale})`;
        button.style.transform = `scale(${noButtonScale})`;
        showTeasingMessage("Hmm... which one feels right? 🤔");
        moveNoButton(1.5);
        return;
    }
    
    // STAGE 3+: OBVIOUS CHOICE (Third hover onwards)
    if (gameStage >= 3) {
        yesButtonScale = Math.min(1.6, yesButtonScale + 0.12);
        noButtonScale = Math.max(0.7, noButtonScale - 0.06); // Minimum 70% size - still clickable!
        
        yesButton.style.transform = `scale(${yesButtonScale})`;
        button.style.transform = `scale(${noButtonScale})`;
        
        if (gameStage === 3) {
            showTeasingMessage("Come on... it's obvious! 💕");
        } else if (gameStage === 5) {
            showTeasingMessage("Just click YES already! 😈");
        } else if (gameStage >= 7) {
            showTeasingMessage("Peru... you know the answer! 💖");
        }
        
        moveNoButton(2); // Move faster!
    }
}

function swapButtons() {
    const container = document.querySelector('.button-container');
    const yesButton = elements.yesButton;
    const noButton = elements.noButton;
    
    if (!buttonsSwapped) {
        container.insertBefore(noButton, yesButton);
        buttonsSwapped = true;
    } else {
        container.insertBefore(yesButton, noButton);
        buttonsSwapped = false;
    }
}

function moveNoButton(speedMultiplier = 1) {
    const button = elements.noButton;
    const yesButton = elements.yesButton;
    
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

function showTeasingMessage(text) {
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
        animation: fadeInOutMessage 2s ease;
        box-shadow: 0 10px 40px rgba(255, 64, 129, 0.6);
    `;
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 2000);
}

// Add CSS animation for teasing message
if (!document.getElementById('teasing-message-styles')) {
    const messageStyle = document.createElement('style');
    messageStyle.id = 'teasing-message-styles';
    messageStyle.textContent = `
        @keyframes fadeInOutMessage {
            0% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
            20% { opacity: 1; transform: translateX(-50%) translateY(0); }
            80% { opacity: 1; transform: translateX(-50%) translateY(0); }
            100% { opacity: 0; transform: translateX(-50%) translateY(20px); }
        }
    `;
    document.head.appendChild(messageStyle);
}

// ===== FLOATING HEARTS BACKGROUND =====
function createFloatingHearts() {
    const heartEmojis = ['❤️', '💕', '💖', '💗', '💓', '💝'];
    
    for (let i = 0; i < CONFIG.HEARTS_COUNT; i++) {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDelay = Math.random() * 8 + 's';
        heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
        elements.heartsContainer.appendChild(heart);
    }
}

// ===== BACKGROUND MUSIC CONTROL =====
function playMusic() {
    elements.bgMusic.volume = 0.5; // Set volume to 50%
    elements.bgMusic.play().then(() => {
        musicPlaying = true;
        elements.musicToggle.classList.remove('muted');
        console.log('✅ Music playing successfully!');
    }).catch(err => {
        console.log('⚠️ Music autoplay blocked by browser. Click the 🎵 button!');
        musicPlaying = false;
        elements.musicToggle.classList.add('muted');
        // Show the music button more prominently
        elements.musicToggle.style.animation = 'musicPulse 1s ease-in-out infinite';
    });
}

function toggleMusic() {
    if (musicPlaying) {
        elements.bgMusic.pause();
        musicPlaying = false;
        elements.musicToggle.classList.add('muted');
        console.log('🔇 Music paused');
    } else {
        elements.bgMusic.play().then(() => {
            musicPlaying = true;
            elements.musicToggle.classList.remove('muted');
            console.log('🎵 Music playing!');
        }).catch(err => {
            console.log('❌ Error playing music:', err);
        });
    }
}

// ===== ROSE PETALS ANIMATION =====
function createRosePetals() {
    const petals = ['🌹', '🌸', '💮', '🏵️', '💐'];
    
    setInterval(() => {
        const petal = document.createElement('div');
        petal.classList.add('petal');
        petal.textContent = petals[Math.floor(Math.random() * petals.length)];
        petal.style.left = Math.random() * 100 + '%';
        petal.style.animationDuration = (Math.random() * 3 + 5) + 's';
        petal.style.opacity = Math.random() * 0.5 + 0.3;
        
        elements.rosePetals.appendChild(petal);
        
        // Remove petal after animation
        setTimeout(() => {
            petal.remove();
        }, 8000);
    }, 300);
}

// ===== CONFETTI ANIMATION =====
function createConfetti() {
    const colors = ['#ff0844', '#ff4081', '#f50057', '#e91e63', '#9c27b0', '#ffeb3b', '#00e676'];
    
    for (let i = 0; i < CONFIG.CONFETTI_COUNT; i++) {
        const confettiPiece = document.createElement('div');
        confettiPiece.classList.add('confetti-piece');
        confettiPiece.style.left = Math.random() * 100 + '%';
        confettiPiece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confettiPiece.style.animationDelay = Math.random() * 0.5 + 's';
        confettiPiece.style.animationDuration = (Math.random() * 2 + 2) + 's';
        
        // Random shapes
        if (Math.random() > 0.5) {
            confettiPiece.style.borderRadius = '50%';
        }
        
        elements.confettiContainer.appendChild(confettiPiece);
    }
}

// ===== SUCCESS PAGE TRANSITION =====
function showSuccessPage() {
    // Add celebration class for animations
    elements.questionPage.classList.remove('active');
    elements.successPage.classList.add('active');
    
    // Create confetti
    createConfetti();
    
    // Start romantic music
    playMusic();
    
    // Start rose petals animation
    createRosePetals();
    
    // Polaroid gallery is CSS-only, no JS needed!
    
    // Play success sound (optional - you can add an audio file)
    // const audio = new Audio('celebration.mp3');
    // audio.play();
    
    // Vibrate on mobile (if supported)
    if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
    }
}

// ===== RESET TO QUESTION PAGE =====
function resetToQuestion() {
    // Remove all confetti
    elements.confettiContainer.innerHTML = '';
    
    // Switch pages
    elements.successPage.classList.remove('active');
    elements.questionPage.classList.add('active');
    
    // Reset game state
    gameStage = 0;
    yesButtonScale = 1;
    noButtonScale = 1;
    
    // Reset button styles
    elements.yesButton.style.transform = 'scale(1)';
    elements.noButton.style.transform = 'scale(1)';
    
    // Reset button positions - MAKE SURE NO IS VISIBLE
    elements.noButton.style.position = 'relative';
    elements.noButton.style.left = '0';
    elements.noButton.style.top = '0';
    elements.noButton.style.transition = 'all 0.3s ease';
    
    // Reset button order if swapped
    if (buttonsSwapped) {
        const container = document.querySelector('.button-container');
        const yesButton = elements.yesButton;
        const noButton = elements.noButton;
        container.insertBefore(yesButton, noButton);
        buttonsSwapped = false;
    }
    
    console.log('🔄 Game reset - Ready to play again!');
}

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
    // Yes button click
    elements.yesButton.addEventListener('click', () => {
        showSuccessPage();
    });
    
    // Play again button click
    elements.playAgainButton.addEventListener('click', () => {
        resetToQuestion();
    });
    
    // No button hover/touch - make it dodge
    elements.noButton.addEventListener('mouseenter', makeNoButtonDodge);
    
    // For mobile touch
    elements.noButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        makeNoButtonDodge();
    });
    
    // Prevent No button from being clicked (extra safety)
    elements.noButton.addEventListener('click', (e) => {
        e.preventDefault();
        makeNoButtonDodge();
    });
    
    // Music toggle
    elements.musicToggle.addEventListener('click', toggleMusic);
}

// ===== SMART AUDIO MANAGEMENT FOR VIDEO =====
const dancingVideo = document.getElementById('dancingVideo');

if (dancingVideo) {
    // Pause background music when video starts playing
    dancingVideo.addEventListener('play', () => {
        if (musicPlaying) {
            elements.bgMusic.pause();
            console.log('🎬 Video playing - Music paused');
        }
    });
    
    // Resume background music when video is paused
    dancingVideo.addEventListener('pause', () => {
        if (musicPlaying) {
            elements.bgMusic.play();
            console.log('⏸️ Video paused - Music resumed');
        }
    });
    
    // Resume background music when video ends
    dancingVideo.addEventListener('ended', () => {
        if (musicPlaying) {
            elements.bgMusic.play();
            console.log('✅ Video ended - Music resumed');
        }
    });
    
    // Pause video when scrolled out of view (performance optimization)
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting && !dancingVideo.paused) {
                dancingVideo.pause();
                console.log('📜 Video scrolled out of view - Paused');
            }
        });
    }, { threshold: 0.5 });
    
    videoObserver.observe(dancingVideo);
}

// ===== INITIALIZE APP =====
function init() {
    createFloatingHearts();
    initializeEventListeners();
    
    // Add some random movement to the no button on load
    setTimeout(() => {
        if (window.innerWidth > 768) {
            elements.noButton.style.position = 'absolute';
        }
    }, 100);
}

// ===== START THE APP =====
// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ===== ADDITIONAL EFFECTS =====
// Add sparkle effect on mouse move
document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.95) {
        const sparkle = document.createElement('div');
        sparkle.textContent = '✨';
        sparkle.style.position = 'fixed';
        sparkle.style.left = e.clientX + 'px';
        sparkle.style.top = e.clientY + 'px';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.fontSize = '20px';
        sparkle.style.zIndex = '1000';
        sparkle.style.animation = 'fadeOut 1s forwards';
        document.body.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 1000);
    }
});

// Add fadeOut animation for sparkles
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        to {
            opacity: 0;
            transform: translateY(-30px);
        }
    }
`;
document.head.appendChild(style);
