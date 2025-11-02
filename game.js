// YUG Galaxy Explorer - Enhanced Game Logic

// Game variables
const gameState = {
    score: 0,
    health: 100,
    energy: 0,
    gameActive: false,
    shipX: 0,
    shipY: 0,
    shipSpeed: 5,
    planets: [],
    asteroids: [],
    powerups: [],
    keys: {},
    level: 1,
    nextLevelScore: 500
};

// DOM Elements
let titleScreen, gameOverScreen, startBtn, restartBtn, ship, scoreElement, 
    healthElement, energyElement, finalScoreElement, starsContainer,
    upBtn, downBtn, leftBtn, rightBtn;

// Initialize game
function initGame() {
    // Get DOM elements
    titleScreen = document.getElementById('titleScreen');
    gameOverScreen = document.getElementById('gameOver');
    startBtn = document.getElementById('startBtn');
    restartBtn = document.getElementById('restartBtn');
    ship = document.getElementById('ship');
    scoreElement = document.getElementById('score');
    healthElement = document.getElementById('health');
    energyElement = document.getElementById('energy');
    finalScoreElement = document.getElementById('finalScore');
    starsContainer = document.getElementById('stars');
    
    // Control buttons
    upBtn = document.getElementById('upBtn');
    downBtn = document.getElementById('downBtn');
    leftBtn = document.getElementById('leftBtn');
    rightBtn = document.getElementById('rightBtn');
    
    // Create stars background
    createStars();
    
    // Set initial ship position
    gameState.shipX = window.innerWidth / 2 - 30;
    gameState.shipY = window.innerHeight / 2 - 30;
    updateShipPosition();
    
    // Event listeners
    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);
    
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        gameState.keys[e.key] = true;
    });
    
    document.addEventListener('keyup', (e) => {
        gameState.keys[e.key] = false;
    });
    
    // Button controls
    setupButtonControls();
    
    // Touch events for mobile
    setupTouchControls();
}

// Setup button controls
function setupButtonControls() {
    // Up button
    upBtn.addEventListener('mousedown', () => gameState.keys['ArrowUp'] = true);
    upBtn.addEventListener('mouseup', () => gameState.keys['ArrowUp'] = false);
    upBtn.addEventListener('mouseleave', () => gameState.keys['ArrowUp'] = false);
    
    // Down button
    downBtn.addEventListener('mousedown', () => gameState.keys['ArrowDown'] = true);
    downBtn.addEventListener('mouseup', () => gameState.keys['ArrowDown'] = false);
    downBtn.addEventListener('mouseleave', () => gameState.keys['ArrowDown'] = false);
    
    // Left button
    leftBtn.addEventListener('mousedown', () => gameState.keys['ArrowLeft'] = true);
    leftBtn.addEventListener('mouseup', () => gameState.keys['ArrowLeft'] = false);
    leftBtn.addEventListener('mouseleave', () => gameState.keys['ArrowLeft'] = false);
    
    // Right button
    rightBtn.addEventListener('mousedown', () => gameState.keys['ArrowRight'] = true);
    rightBtn.addEventListener('mouseup', () => gameState.keys['ArrowRight'] = false);
    rightBtn.addEventListener('mouseleave', () => gameState.keys['ArrowRight'] = false);
}

// Setup touch controls for mobile
function setupTouchControls() {
    // Up button
    upBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        gameState.keys['ArrowUp'] = true;
    });
    upBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        gameState.keys['ArrowUp'] = false;
    });
    
    // Down button
    downBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        gameState.keys['ArrowDown'] = true;
    });
    downBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        gameState.keys['ArrowDown'] = false;
    });
    
    // Left button
    leftBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        gameState.keys['ArrowLeft'] = true;
    });
    leftBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        gameState.keys['ArrowLeft'] = false;
    });
    
    // Right button
    rightBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        gameState.keys['ArrowRight'] = true;
    });
    rightBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        gameState.keys['ArrowRight'] = false;
    });
}

// Create star background
function createStars() {
    starsContainer.innerHTML = '';
    const starCount = 200;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        // Random position
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        
        // Random size (0.5px to 2px)
        const size = Math.random() * 1.5 + 0.5;
        
        star.style.left = `${x}px`;
        star.style.top = `${y}px`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        // Random opacity and animation properties
        const minOpacity = Math.random() * 0.3 + 0.1;
        const maxOpacity = Math.random() * 0.5 + 0.5;
        const duration = Math.random() * 3 + 2;
        
        star.style.setProperty('--min-opacity', minOpacity);
        star.style.setProperty('--max-opacity', maxOpacity);
        star.style.setProperty('--duration', `${duration}s`);
        
        starsContainer.appendChild(star);
    }
}

// Start the game
function startGame() {
    // Reset game state
    gameState.score = 0;
    gameState.health = 100;
    gameState.energy = 0;
    gameState.gameActive = true;
    gameState.level = 1;
    gameState.nextLevelScore = 500;
    gameState.planets = [];
    gameState.asteroids = [];
    gameState.powerups = [];
    
    // Update UI
    updateUI();
    
    // Hide screens
    titleScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    
    // Clear existing objects
    document.querySelectorAll('.planet, .explosion, .powerup').forEach(el => el.remove());
    
    // Start game loop
    gameLoop();
    
    // Start spawning objects with level-based difficulty
    setInterval(() => spawnPlanet(), 2000 / gameState.level);
    setInterval(() => spawnAsteroid(), 1500 / gameState.level);
    setInterval(() => spawnPowerup(), 10000 / gameState.level);
}

// Update UI elements
function updateUI() {
    scoreElement.textContent = gameState.score;
    healthElement.textContent = gameState.health;
    energyElement.textContent = gameState.energy;
    
    // Update health bar color based on health level
    if (gameState.health > 70) {
        healthElement.style.color = '#4facfe';
    } else if (gameState.health > 30) {
        healthElement.style.color = '#ff9a00';
    } else {
        healthElement.style.color = '#ff0000';
    }
}

// Update ship position
function updateShipPosition() {
    ship.style.left = `${gameState.shipX}px`;
    ship.style.top = `${gameState.shipY}px`;
}

// Spawn a planet
function spawnPlanet() {
    if (!gameState.gameActive) return;
    
    const planet = document.createElement('div');
    planet.classList.add('planet');
    
    // Random position (off-screen)
    const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
    let x, y;
    
    switch (side) {
        case 0: // top
            x = Math.random() * window.innerWidth;
            y = -50;
            break;
        case 1: // right
            x = window.innerWidth + 50;
            y = Math.random() * window.innerHeight;
            break;
        case 2: // bottom
            x = Math.random() * window.innerWidth;
            y = window.innerHeight + 50;
            break;
        case 3: // left
            x = -50;
            y = Math.random() * window.innerHeight;
            break;
    }
    
    // Random size and color
    const size = Math.random() * 40 + 30;
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFBE0B', '#FB5607', '#8338EC'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    planet.style.width = `${size}px`;
    planet.style.height = `${size}px`;
    planet.style.background = `radial-gradient(circle at 30% 30%, ${color}, ${darkenColor(color, 40)})`;
    planet.style.left = `${x}px`;
    planet.style.top = `${y}px`;
    planet.style.boxShadow = `0 0 20px ${color}`;
    
    // Add label
    const label = document.createElement('div');
    label.classList.add('planet-label');
    label.textContent = `+${Math.floor(size)} Energy`;
    planet.appendChild(label);
    
    document.querySelector('.game-container').appendChild(planet);
    
    // Store planet data
    const planetData = {
        element: planet,
        x: x,
        y: y,
        size: size,
        energy: Math.floor(size),
        speed: Math.random() * 2 + 1 + (gameState.level * 0.2)
    };
    
    gameState.planets.push(planetData);
}

// Spawn an asteroid
function spawnAsteroid() {
    if (!gameState.gameActive) return;
    
    const asteroid = document.createElement('div');
    asteroid.classList.add('planet');
    
    // Random position (off-screen)
    const side = Math.floor(Math.random() * 4);
    let x, y;
    
    switch (side) {
        case 0: // top
            x = Math.random() * window.innerWidth;
            y = -50;
            break;
        case 1: // right
            x = window.innerWidth + 50;
            y = Math.random() * window.innerHeight;
            break;
        case 2: // bottom
            x = Math.random() * window.innerWidth;
            y = window.innerHeight + 50;
            break;
        case 3: // left
            x = -50;
            y = Math.random() * window.innerHeight;
            break;
    }
    
    // Asteroid properties
    const size = Math.random() * 30 + 20;
    const color = '#888888';
    
    asteroid.style.width = `${size}px`;
    asteroid.style.height = `${size}px`;
    asteroid.style.background = `radial-gradient(circle at 30% 30%, ${color}, #444444)`;
    asteroid.style.left = `${x}px`;
    asteroid.style.top = `${y}px`;
    asteroid.style.boxShadow = `0 0 20px ${color}`;
    
    // Add label
    const label = document.createElement('div');
    label.classList.add('planet-label');
    label.textContent = 'Asteroid - Collision!';
    asteroid.appendChild(label);
    
    document.querySelector('.game-container').appendChild(asteroid);
    
    // Store asteroid data
    const asteroidData = {
        element: asteroid,
        x: x,
        y: y,
        size: size,
        speed: Math.random() * 3 + 2 + (gameState.level * 0.3)
    };
    
    gameState.asteroids.push(asteroidData);
}

// Spawn a power-up
function spawnPowerup() {
    if (!gameState.gameActive) return;
    
    const powerup = document.createElement('div');
    powerup.classList.add('powerup');
    
    // Random position (off-screen)
    const side = Math.floor(Math.random() * 4);
    let x, y;
    
    switch (side) {
        case 0: // top
            x = Math.random() * window.innerWidth;
            y = -50;
            break;
        case 1: // right
            x = window.innerWidth + 50;
            y = Math.random() * window.innerHeight;
            break;
        case 2: // bottom
            x = Math.random() * window.innerWidth;
            y = window.innerHeight + 50;
            break;
        case 3: // left
            x = -50;
            y = Math.random() * window.innerHeight;
            break;
    }
    
    powerup.style.left = `${x}px`;
    powerup.style.top = `${y}px`;
    
    document.querySelector('.game-container').appendChild(powerup);
    
    // Store power-up data
    const powerupData = {
        element: powerup,
        x: x,
        y: y,
        speed: Math.random() * 2 + 1 + (gameState.level * 0.1)
    };
    
    gameState.powerups.push(powerupData);
}

// Darken a color
function darkenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    
    return `#${(
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
    ).toString(16).slice(1)}`;
}

// Create explosion effect
function createExplosion(x, y) {
    const explosion = document.createElement('div');
    explosion.classList.add('explosion');
    explosion.style.left = `${x}px`;
    explosion.style.top = `${y}px`;
    document.querySelector('.game-container').appendChild(explosion);
    
    // Animate explosion
    let size = 5;
    const grow = setInterval(() => {
        size += 5;
        explosion.style.width = `${size}px`;
        explosion.style.height = `${size}px`;
        explosion.style.opacity = 1 - (size / 50);
        
        if (size >= 50) {
            clearInterval(grow);
            explosion.remove();
        }
    }, 50);
}

// Check for level progression
function checkLevelProgress() {
    if (gameState.score >= gameState.nextLevelScore) {
        gameState.level++;
        gameState.nextLevelScore = gameState.level * 500;
        
        // Show level up message
        const levelUp = document.createElement('div');
        levelUp.textContent = `LEVEL ${gameState.level} UP!`;
        levelUp.style.position = 'absolute';
        levelUp.style.top = '50%';
        levelUp.style.left = '50%';
        levelUp.style.transform = 'translate(-50%, -50%)';
        levelUp.style.fontSize = '3rem';
        levelUp.style.color = '#4facfe';
        levelUp.style.textShadow = '0 0 20px rgba(79, 172, 254, 0.8)';
        levelUp.style.zIndex = '15';
        levelUp.style.animation = 'glow 1s infinite alternate';
        document.querySelector('.game-container').appendChild(levelUp);
        
        // Remove level up message after 2 seconds
        setTimeout(() => {
            levelUp.remove();
        }, 2000);
    }
}

// Game loop
function gameLoop() {
    if (!gameState.gameActive) return;
    
    // Handle ship movement
    handleShipMovement();
    
    // Move planets
    movePlanets();
    
    // Move asteroids
    moveAsteroids();
    
    // Move power-ups
    movePowerups();
    
    // Check level progression
    checkLevelProgress();
    
    // Continue game loop
    requestAnimationFrame(gameLoop);
}

// Handle ship movement
function handleShipMovement() {
    if (gameState.keys['ArrowUp'] || gameState.keys['w'] || gameState.keys['W']) {
        gameState.shipY = Math.max(0, gameState.shipY - gameState.shipSpeed);
    }
    if (gameState.keys['ArrowDown'] || gameState.keys['s'] || gameState.keys['S']) {
        gameState.shipY = Math.min(window.innerHeight - 60, gameState.shipY + gameState.shipSpeed);
    }
    if (gameState.keys['ArrowLeft'] || gameState.keys['a'] || gameState.keys['A']) {
        gameState.shipX = Math.max(0, gameState.shipX - gameState.shipSpeed);
    }
    if (gameState.keys['ArrowRight'] || gameState.keys['d'] || gameState.keys['D']) {
        gameState.shipX = Math.min(window.innerWidth - 60, gameState.shipX + gameState.shipSpeed);
    }
    
    updateShipPosition();
}

// Move planets
function movePlanets() {
    for (let i = gameState.planets.length - 1; i >= 0; i--) {
        const planet = gameState.planets[i];
        
        // Move towards center
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const dx = centerX - planet.x;
        const dy = centerY - planet.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 5) {
            planet.x += (dx / distance) * planet.speed;
            planet.y += (dy / distance) * planet.speed;
        }
        
        planet.element.style.left = `${planet.x}px`;
        planet.element.style.top = `${planet.y}px`;
        
        // Check collision with ship
        const shipCenterX = gameState.shipX + 30;
        const shipCenterY = gameState.shipY + 30;
        const planetCenterX = planet.x + planet.size / 2;
        const planetCenterY = planet.y + planet.size / 2;
        const distanceToShip = Math.sqrt(
            Math.pow(shipCenterX - planetCenterX, 2) + 
            Math.pow(shipCenterY - planetCenterY, 2)
        );
        
        if (distanceToShip < (30 + planet.size / 2)) {
            // Collect energy
            gameState.energy += planet.energy;
            gameState.score += planet.energy * 10;
            
            // Update UI
            updateUI();
            
            // Remove planet
            planet.element.remove();
            gameState.planets.splice(i, 1);
        }
        
        // Remove planets that are off-screen
        if (planet.x < -100 || planet.x > window.innerWidth + 100 || 
            planet.y < -100 || planet.y > window.innerHeight + 100) {
            planet.element.remove();
            gameState.planets.splice(i, 1);
        }
    }
}

// Move asteroids
function moveAsteroids() {
    for (let i = gameState.asteroids.length - 1; i >= 0; i--) {
        const asteroid = gameState.asteroids[i];
        
        // Move towards center
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const dx = centerX - asteroid.x;
        const dy = centerY - asteroid.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 5) {
            asteroid.x += (dx / distance) * asteroid.speed;
            asteroid.y += (dy / distance) * asteroid.speed;
        }
        
        asteroid.element.style.left = `${asteroid.x}px`;
        asteroid.element.style.top = `${asteroid.y}px`;
        
        // Check collision with ship
        const shipCenterX = gameState.shipX + 30;
        const shipCenterY = gameState.shipY + 30;
        const asteroidCenterX = asteroid.x + asteroid.size / 2;
        const asteroidCenterY = asteroid.y + asteroid.size / 2;
        const distanceToShip = Math.sqrt(
            Math.pow(shipCenterX - asteroidCenterX, 2) + 
            Math.pow(shipCenterY - asteroidCenterY, 2)
        );
        
        if (distanceToShip < (30 + asteroid.size / 2)) {
            // Damage ship
            gameState.health -= 10;
            updateUI();
            
            // Create explosion
            createExplosion(asteroidCenterX, asteroidCenterY);
            
            // Remove asteroid
            asteroid.element.remove();
            gameState.asteroids.splice(i, 1);
            
            // Check if game over
            if (gameState.health <= 0) {
                gameOver();
                return;
            }
        }
        
        // Remove asteroids that are off-screen
        if (asteroid.x < -100 || asteroid.x > window.innerWidth + 100 || 
            asteroid.y < -100 || asteroid.y > window.innerHeight + 100) {
            asteroid.element.remove();
            gameState.asteroids.splice(i, 1);
        }
    }
}

// Move power-ups
function movePowerups() {
    for (let i = gameState.powerups.length - 1; i >= 0; i--) {
        const powerup = gameState.powerups[i];
        
        // Move towards center
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const dx = centerX - powerup.x;
        const dy = centerY - powerup.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 5) {
            powerup.x += (dx / distance) * powerup.speed;
            powerup.y += (dy / distance) * powerup.speed;
        }
        
        powerup.element.style.left = `${powerup.x}px`;
        powerup.element.style.top = `${powerup.y}px`;
        
        // Check collision with ship
        const shipCenterX = gameState.shipX + 30;
        const shipCenterY = gameState.shipY + 30;
        const distanceToShip = Math.sqrt(
            Math.pow(shipCenterX - powerup.x, 2) + 
            Math.pow(shipCenterY - powerup.y, 2)
        );
        
        if (distanceToShip < 45) {
            // Collect power-up
            gameState.health = Math.min(100, gameState.health + 20);
            updateUI();
            
            // Remove power-up
            powerup.element.remove();
            gameState.powerups.splice(i, 1);
        }
        
        // Remove power-ups that are off-screen
        if (powerup.x < -100 || powerup.x > window.innerWidth + 100 || 
            powerup.y < -100 || powerup.y > window.innerHeight + 100) {
            powerup.element.remove();
            gameState.powerups.splice(i, 1);
        }
    }
}

// Game over
function gameOver() {
    gameState.gameActive = false;
    finalScoreElement.textContent = gameState.score;
    gameOverScreen.style.display = 'flex';
}

// Initialize the game when the page loads
window.addEventListener('load', initGame);

// Handle window resize
window.addEventListener('resize', () => {
    // Update ship position if near edge
    gameState.shipX = Math.min(gameState.shipX, window.innerWidth - 60);
    gameState.shipY = Math.min(gameState.shipY, window.innerHeight - 60);
    updateShipPosition();
    
    // Recreate stars
    createStars();
});

// YUG Tap Hero - Simplified Game Logic (No Authentication)

class YUGTapHero {
    constructor() {
        this.gameState = {
            score: 0,
            coins: 0,
            highScore: 0,
            timeLeft: 30,
            gameActive: false,
            multiplier: 1,
            powerUps: {
                doublePoints: { active: false, uses: 0 },
                slowMotion: { active: false, uses: 0 },
                extraTime: { active: false, uses: 0 }
            },
            gamesPlayed: 0
        };
        
        this.timers = {
            gameTimer: null,
            spawnTimer: null,
            powerUpTimers: {}
        };
        
        this.elements = {};
        this.init();
    }
    
    init() {
        this.cacheElements();
        this.bindEvents();
        this.loadGameState();
        this.updateUI();
    }
    
    cacheElements() {
        // Screens
        this.elements.homeScreen = document.getElementById('homeScreen');
        this.elements.gameScreen = document.getElementById('gameScreen');
        this.elements.gameOverScreen = document.getElementById('gameOverScreen');
        this.elements.storeScreen = document.getElementById('storeScreen');
        this.elements.coinsStoreScreen = document.getElementById('coinsStoreScreen');
        
        // Buttons
        this.elements.playBtn = document.getElementById('playBtn');
        this.elements.storeBtn = document.getElementById('storeBtn');
        this.elements.coinsBtn = document.getElementById('coinsBtn');
        this.elements.retryBtn = document.getElementById('retryBtn');
        this.elements.homeBtn = document.getElementById('homeBtn');
        this.elements.backFromStoreBtn = document.getElementById('backFromStoreBtn');
        this.elements.backFromCoinsStoreBtn = document.getElementById('backFromCoinsStoreBtn');
        
        // UI Elements
        this.elements.tapTarget = document.getElementById('tapTarget');
        this.elements.scoreDisplay = document.getElementById('scoreDisplay');
        this.elements.timeDisplay = document.getElementById('timeDisplay');
        this.elements.gameCoinsDisplay = document.getElementById('gameCoinsDisplay');
        this.elements.coinsDisplay = document.getElementById('coinsDisplay');
        this.elements.highScoreDisplay = document.getElementById('highScoreDisplay');
        this.elements.finalScore = document.getElementById('finalScore');
        this.elements.coinsEarned = document.getElementById('coinsEarned');
        this.elements.newHighScore = document.getElementById('newHighScore');
        
        // Power-up buttons
        this.elements.doublePoints = document.getElementById('doublePoints');
        this.elements.slowMotion = document.getElementById('slowMotion');
        this.elements.extraTime = document.getElementById('extraTime');
    }
    
    bindEvents() {
        // Navigation
        this.elements.playBtn.addEventListener('click', () => this.startGame());
        this.elements.storeBtn.addEventListener('click', () => this.showScreen('storeScreen'));
        this.elements.coinsBtn.addEventListener('click', () => this.showScreen('coinsStoreScreen'));
        this.elements.retryBtn.addEventListener('click', () => this.startGame());
        this.elements.homeBtn.addEventListener('click', () => this.showScreen('homeScreen'));
        this.elements.backFromStoreBtn.addEventListener('click', () => this.showScreen('homeScreen'));
        this.elements.backFromCoinsStoreBtn.addEventListener('click', () => this.showScreen('homeScreen'));
        
        // Store items
        document.querySelectorAll('.buy-btn').forEach(button => {
            button.addEventListener('click', (e) => this.buyItem(e.target.dataset.item));
        });
        
        // Coin packages
        document.querySelectorAll('.buy-coins-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const packageElement = e.target.closest('.coin-package');
                const coins = parseInt(packageElement.dataset.coins);
                const price = parseInt(packageElement.dataset.price);
                this.buyCoins(coins, price);
            });
        });
        
        // Game interaction
        this.elements.tapTarget.addEventListener('click', (e) => this.handleTap(e));
        this.elements.tapTarget.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleTap(e);
        }, { passive: false });
        
        // Power-ups
        this.elements.doublePoints.addEventListener('click', () => this.activatePowerUp('doublePoints'));
        this.elements.slowMotion.addEventListener('click', () => this.activatePowerUp('slowMotion'));
        this.elements.extraTime.addEventListener('click', () => this.activatePowerUp('extraTime'));
        
        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());
    }
    
    showScreen(screenName) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show requested screen
        document.getElementById(screenName).classList.add('active');
        
        // Auto scroll to top
        this.scrollToTop();
    }
    
    scrollToTop() {
        // Scroll to top of the page
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
        
        // For older browsers that don't support smooth scrolling
        if (!('scrollBehavior' in document.documentElement.style)) {
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        }
    }
    
    loadGameState() {
        const savedState = localStorage.getItem('yugTapHeroState');
        if (savedState) {
            const state = JSON.parse(savedState);
            this.gameState.coins = state.coins || 0;
            this.gameState.highScore = state.highScore || 0;
            this.gameState.gamesPlayed = state.gamesPlayed || 0;
        }
    }
    
    saveGameState() {
        const state = {
            coins: this.gameState.coins,
            highScore: this.gameState.highScore,
            gamesPlayed: this.gameState.gamesPlayed
        };
        localStorage.setItem('yugTapHeroState', JSON.stringify(state));
    }
    
    updateUI() {
        this.elements.coinsDisplay.textContent = this.gameState.coins;
        this.elements.highScoreDisplay.textContent = this.gameState.highScore;
        this.elements.gameCoinsDisplay.textContent = this.gameState.coins;
        
        // Update power-up buttons with usage count
        this.elements.doublePoints.textContent = `2X${this.gameState.powerUps.doublePoints.uses > 0 ? ` (${this.gameState.powerUps.doublePoints.uses})` : ''}`;
        this.elements.slowMotion.textContent = `SLOW${this.gameState.powerUps.slowMotion.uses > 0 ? ` (${this.gameState.powerUps.slowMotion.uses})` : ''}`;
        this.elements.extraTime.textContent = `+5S${this.gameState.powerUps.extraTime.uses > 0 ? ` (${this.gameState.powerUps.extraTime.uses})` : ''}`;
    }
    
    buyItem(itemType) {
        let cost = 0;
        let itemName = '';
        
        switch (itemType) {
            case 'doublePoints':
                cost = 100;
                itemName = 'Double Points';
                break;
            case 'extraTime':
                cost = 150;
                itemName = 'Extra Time';
                break;
            case 'slowMotion':
                cost = 250;
                itemName = 'Slow Motion';
                break;
        }
        
        if (this.gameState.coins >= cost) {
            this.gameState.coins -= cost;
            this.gameState.powerUps[itemType].uses += 3;
            this.updateUI();
            alert(`Bought ${itemName}! You now have ${this.gameState.powerUps[itemType].uses} uses.`);
        } else {
            alert('Not enough coins!');
        }
    }
    
    buyCoins(coins, price) {
        // In a real implementation, this would integrate with Play Store/App Store payment systems
        // For now, we'll simulate the purchase with a confirmation
        if (confirm(`Buy ${coins} coins for ₹${price}? This would integrate with Play Store/App Store in a real app.`)) {
            // Simulate successful payment
            this.gameState.coins += coins;
            this.updateUI();
            this.showScreen('homeScreen');
            alert(`Successfully purchased ${coins} coins!`);
        }
    }
    
    startGame() {
        // Reset game state
        this.gameState.score = 0;
        this.gameState.timeLeft = 30;
        this.gameState.gameActive = true;
        this.gameState.multiplier = 1;
        
        // Update UI
        this.elements.scoreDisplay.textContent = this.gameState.score;
        this.elements.timeDisplay.textContent = this.gameState.timeLeft;
        
        // Show game screen
        this.showScreen('gameScreen');
        
        // Start game timers
        this.startGameTimer();
        this.startSpawnTimer();
        
        // Apply slow motion if active
        if (this.gameState.powerUps.slowMotion.uses > 0) {
            this.applySlowMotion();
        }
        
        // Update UI
        this.updateUI();
    }
    
    startGameTimer() {
        this.timers.gameTimer = setInterval(() => {
            this.gameState.timeLeft--;
            this.elements.timeDisplay.textContent = this.gameState.timeLeft;
            
            if (this.gameState.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
    }
    
    startSpawnTimer() {
        this.moveTapTarget();
        
        const interval = this.gameState.powerUps.slowMotion.uses > 0 ? 2000 : 1000;
        this.timers.spawnTimer = setInterval(() => {
            this.moveTapTarget();
        }, interval);
    }
    
    moveTapTarget() {
        if (!this.gameState.gameActive) return;
        
        const gameArea = document.querySelector('.game-area');
        const maxX = gameArea.clientWidth - this.elements.tapTarget.clientWidth;
        const maxY = gameArea.clientHeight - this.elements.tapTarget.clientHeight;
        
        const newX = Math.random() * maxX;
        const newY = Math.random() * maxY;
        
        this.elements.tapTarget.style.left = `${newX}px`;
        this.elements.tapTarget.style.top = `${newY}px`;
    }
    
    handleTap(e) {
        if (!this.gameState.gameActive) return;
        
        // Prevent default to avoid double tap zoom on mobile
        e.preventDefault();
        
        // Add visual feedback
        this.elements.tapTarget.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.elements.tapTarget.style.transform = 'scale(1)';
        }, 100);
        
        // Add particle effect
        this.createTapEffect(e.clientX || e.touches[0].clientX, e.clientY || e.touches[0].clientY);
        
        // Update score
        const points = 10 * this.gameState.multiplier;
        this.gameState.score += points;
        this.elements.scoreDisplay.textContent = this.gameState.score;
        
        // Add coins occasionally
        if (Math.random() < 0.3) {
            this.gameState.coins++;
            this.elements.gameCoinsDisplay.textContent = this.gameState.coins;
        }
        
        // Move target to new position
        this.moveTapTarget();
    }
    
    createTapEffect(x, y) {
        const effect = document.createElement('div');
        effect.className = 'tap-effect';
        effect.style.left = `${x}px`;
        effect.style.top = `${y}px`;
        effect.style.background = 'radial-gradient(circle, rgba(0,201,255,0.8), transparent)';
        effect.style.width = '50px';
        effect.style.height = '50px';
        effect.style.borderRadius = '50%';
        effect.style.position = 'absolute';
        effect.style.pointerEvents = 'none';
        effect.style.zIndex = '1000';
        effect.style.transform = 'translate(-50%, -50%)';
        
        document.body.appendChild(effect);
        
        // Animate effect
        let size = 50;
        const grow = setInterval(() => {
            size += 10;
            effect.style.width = `${size}px`;
            effect.style.height = `${size}px`;
            effect.style.opacity = 1 - (size / 200);
            
            if (size >= 200) {
                clearInterval(grow);
                effect.remove();
            }
        }, 50);
    }
    
    activatePowerUp(type) {
        if (!this.gameState.gameActive) return;
        
        // Check if power-up has uses
        if (this.gameState.powerUps[type].uses <= 0) {
            alert('No uses left! Buy more in the store.');
            return;
        }
        
        switch (type) {
            case 'doublePoints':
                this.gameState.multiplier = 2;
                this.gameState.powerUps.doublePoints.uses--;
                this.updateUI();
                // Reset multiplier after 5 seconds
                setTimeout(() => {
                    this.gameState.multiplier = 1;
                    this.updateUI();
                }, 5000);
                break;
                
            case 'slowMotion':
                this.gameState.powerUps.slowMotion.uses--;
                this.applySlowMotion();
                this.updateUI();
                break;
                
            case 'extraTime':
                this.gameState.timeLeft += 10;
                this.elements.timeDisplay.textContent = this.gameState.timeLeft;
                this.gameState.powerUps.extraTime.uses--;
                this.updateUI();
                break;
        }
    }
    
    applySlowMotion() {
        clearInterval(this.timers.spawnTimer);
        this.startSpawnTimer();
    }
    
    endGame() {
        this.gameState.gameActive = false;
        this.gameState.gamesPlayed++;
        
        // Clear timers
        clearInterval(this.timers.gameTimer);
        clearInterval(this.timers.spawnTimer);
        
        // Update high score
        if (this.gameState.score > this.gameState.highScore) {
            this.gameState.highScore = this.gameState.score;
        }
        
        // Calculate coins earned
        const coinsEarned = Math.floor(this.gameState.score / 100);
        this.gameState.coins += coinsEarned;
        
        // Update UI
        this.elements.finalScore.textContent = this.gameState.score;
        this.elements.coinsEarned.textContent = coinsEarned;
        this.elements.newHighScore.textContent = this.gameState.highScore;
        this.updateUI();
        
        // Save game state
        this.saveGameState();
        
        // Show ad every 3 games
        if (this.gameState.gamesPlayed % 3 === 0) {
            this.showAd();
        }
        
        // Show game over screen
        this.showScreen('gameOverScreen');
        
        // Reset power-ups
        this.gameState.powerUps = {
            doublePoints: { active: false, uses: 0 },
            slowMotion: { active: false, uses: 0 },
            extraTime: { active: false, uses: 0 }
        };
        
        // Reset power-up buttons
        this.updateUI();
    }
    
    showAd() {
        // In a real implementation, this would show an AdMob interstitial ad
        console.log("Showing AdMob interstitial ad");
        // For now, we'll just show a message
        alert("Interstitial ad would show here in a real implementation");
    }
    
    handleResize() {
        if (this.gameState.gameActive) {
            // Keep target within bounds
            const gameArea = document.querySelector('.game-area');
            const target = this.elements.tapTarget;
            
            const maxX = gameArea.clientWidth - target.clientWidth;
            const maxY = gameArea.clientHeight - target.clientHeight;
            
            const currentX = parseInt(target.style.left) || 0;
            const currentY = parseInt(target.style.top) || 0;
            
            if (currentX > maxX) {
                target.style.left = `${maxX}px`;
            }
            
            if (currentY > maxY) {
                target.style.top = `${maxY}px`;
            }
        }
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.yugTapHero = new YUGTapHero();
});

// Prevent pinch zoom
document.addEventListener('gesturestart', (e) => {
    e.preventDefault();
});
