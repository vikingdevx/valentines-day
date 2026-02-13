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

// ===== NO BUTTON DODGE LOGIC =====
function makeNoButtonDodge() {
    const button = elements.noButton;
    const container = document.querySelector('.button-container');
    
    // Get container bounds
    const containerRect = container.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    
    // Calculate safe movement area
    const maxX = window.innerWidth - buttonRect.width - 40;
    const maxY = window.innerHeight - buttonRect.height - 40;
    const minX = 20;
    const minY = 20;
    
    // Generate random position
    let newX = Math.random() * (maxX - minX) + minX;
    let newY = Math.random() * (maxY - minY) + minY;
    
    // Make sure it's not too close to the Yes button
    const yesButtonRect = elements.yesButton.getBoundingClientRect();
    const distance = Math.sqrt(
        Math.pow(newX - yesButtonRect.left, 2) + 
        Math.pow(newY - yesButtonRect.top, 2)
    );
    
    if (distance < CONFIG.NO_BUTTON_DODGE_DISTANCE) {
        // Move away from Yes button
        newX = newX < yesButtonRect.left ? newX - 100 : newX + 100;
        newY = newY < yesButtonRect.top ? newY - 100 : newY + 100;
        
        // Keep within bounds
        newX = Math.max(minX, Math.min(maxX, newX));
        newY = Math.max(minY, Math.min(maxY, newY));
    }
    
    button.style.left = newX + 'px';
    button.style.top = newY + 'px';
    
    // Increment hover count and shrink button periodically
    noButtonHoverCount++;
    if (noButtonHoverCount % CONFIG.NO_BUTTON_SHRINK_INTERVAL === 0) {
        const currentScale = parseFloat(button.style.transform?.match(/scale\(([\d.]+)\)/)?.[1] || 1);
        const newScale = Math.max(0.5, currentScale - 0.1);
        button.style.transform = `scale(${newScale})`;
    }
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
    
    // Reset no button position and scale
    noButtonHoverCount = 0;
    elements.noButton.style.transform = 'scale(1)';
    if (window.innerWidth > 768) {
        elements.noButton.style.position = 'absolute';
        elements.noButton.style.left = '';
        elements.noButton.style.top = '';
    }
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
