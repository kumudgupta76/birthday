/**
 * Birthday Website - Enhanced Interactive Script
 * A warm, playful, and classy birthday experience
 * Extended version with more interactions and content
 */

// ============================================
// Configuration
// ============================================
const CONFIG = {
    totalSections: 11,
    
    typewriter: {
        speed: 50,
        pauseAfterLine: 400
    },
    
    delays: {
        wishLine: 400,
        closingLine: 600,
        confetti: 80,
        heart: 600,
        timeline: 500,
        compliment: 600
    },
    
    particles: {
        count: 20,
        colors: ['#FFB6C1', '#E6E6FA', '#FFDAB9', '#98FB98', '#87CEEB', '#f8e1f4']
    },
    
    confetti: {
        count: 80,
        colors: ['#667eea', '#764ba2', '#f093fb', '#ffecd2', '#fcb69f', '#FFB6C1', '#00b894', '#ffd93d']
    }
};

// ============================================
// Text Content
// ============================================
const TEXT = {
    intro: "Hi there! 🙂\nToday feels a little special…\nI made something for you.",
    mystery: "I've been working on a little surprise...\nReady to see what it is?",
    code: `# birthday_wish.py
# A special program just for you

def calculate_birthday_joy():
    bugs = 0
    happiness = float('inf')
    coffee_level = "optimal"
    
    return {
        "status": "bug_free",
        "happiness": happiness,
        "message": "Have an amazing day! 🎉"
    }

# Running birthday protocol...
result = calculate_birthday_joy()
print(result["message"])`,
    terminalOutput: ">>> Running birthday_wish.py...\n>>> Compiling happiness...\n>>> Optimizing joy levels...\n>>> \n>>> Have an amazing day! 🎉\n>>> \n>>> Process completed with 0 bugs! ✓"
};

// ============================================
// Quiz Data
// ============================================
const QUIZ = {
    questions: [
        {
            question: "What's the most important thing on a birthday?",
            options: [
                "Cake 🍰",
                "Gifts 🎁",
                "Being happy 😊",
                "All of the above! 🎉"
            ],
            correct: 3,
            response: "Correct! All of these make birthdays special! 🎉"
        },
        {
            question: "What do software engineers wish for on their birthday?",
            options: [
                "No bugs in production",
                "Infinite coffee",
                "Meetings that could've been emails",
                "All of the above (obviously)"
            ],
            correct: 3,
            response: "You know us too well! 😄"
        }
    ],
    currentIndex: 0
};

// ============================================
// Fortune Messages
// ============================================
const FORTUNES = [
    "A beautiful adventure awaits you in the coming year. ✨",
    "The best conversations are yet to come. 💬",
    "Your code will compile on the first try this week. 💻",
    "Something wonderful is about to happen. 🌟",
    "The universe is conspiring to make you smile. 😊"
];

// ============================================
// State Management
// ============================================
const state = {
    currentSection: 1,
    isAnimating: false,
    particlesCreated: false,
    confettiTriggered: false,
    quizCompleted: false,
    fortuneOpened: false,
    balloonsPopped: 0,
    candleBlown: false,
    codeTyped: false
};

// ============================================
// DOM Elements Cache
// ============================================
let elements = {};

/**
 * Initialize DOM element references
 */
function initElements() {
    elements = {
        sections: {},
        buttons: {},
        progressBar: document.getElementById('progress-bar'),
        progressDots: document.getElementById('progress-dots'),
        particles: document.getElementById('particles'),
        confetti: document.getElementById('confetti'),
        hearts: document.getElementById('floating-hearts'),
        
        // Section-specific elements
        introText: document.getElementById('intro-text'),
        mysteryText: document.getElementById('mystery-text'),
        mysteryBox: document.getElementById('mystery-box'),
        quizContainer: document.getElementById('quiz-container'),
        quizQuestion: document.getElementById('quiz-question'),
        quizOptions: document.getElementById('quiz-options'),
        quizResult: document.getElementById('quiz-result'),
        fortuneCookie: document.getElementById('fortune-cookie'),
        fortuneMessage: document.getElementById('fortune-message'),
        codeContent: document.getElementById('code-content'),
        terminalOutput: document.getElementById('terminal-output'),
        terminalText: document.getElementById('terminal-text'),
        balloonGame: document.getElementById('balloon-game'),
        wishDisplay: document.getElementById('wish-display'),
        revealedWish: document.getElementById('revealed-wish'),
        balloonsPopped: document.getElementById('balloons-popped'),
        bigCandle: document.getElementById('big-candle'),
        candleFlame: document.getElementById('candle-flame'),
        blowInstruction: document.getElementById('blow-instruction'),
        wishMade: document.getElementById('wish-made'),
        finalEmojiBurst: document.getElementById('final-emoji-burst')
    };
    
    // Cache sections and buttons
    for (let i = 1; i <= CONFIG.totalSections; i++) {
        elements.sections[i] = document.getElementById(`section-${i}`);
        if (i < CONFIG.totalSections) {
            elements.buttons[i] = document.getElementById(`btn-next-${i}`);
        }
    }
    
    // Special buttons
    elements.btnRunCode = document.getElementById('btn-run-code');
    elements.btnRestart = document.getElementById('btn-restart');
}

// ============================================
// Progress Indicator
// ============================================

/**
 * Create progress dots
 */
function createProgressDots() {
    const container = elements.progressDots;
    container.innerHTML = '';
    
    for (let i = 1; i <= CONFIG.totalSections; i++) {
        const dot = document.createElement('span');
        dot.className = 'progress-dot';
        if (i === 1) dot.classList.add('active');
        container.appendChild(dot);
    }
}

/**
 * Update progress indicator
 */
function updateProgress() {
    const percentage = ((state.currentSection - 1) / (CONFIG.totalSections - 1)) * 100;
    elements.progressBar.style.width = `${percentage}%`;
    
    const dots = elements.progressDots.querySelectorAll('.progress-dot');
    dots.forEach((dot, index) => {
        dot.classList.remove('active', 'completed');
        if (index + 1 === state.currentSection) {
            dot.classList.add('active');
        } else if (index + 1 < state.currentSection) {
            dot.classList.add('completed');
        }
    });
}

// ============================================
// Typewriter Effect
// ============================================

/**
 * Creates a typewriter effect for the given text
 */
function typeWriter(element, text, callback) {
    if (!element) return;
    
    const lines = text.split('\n');
    let lineIndex = 0;
    let charIndex = 0;
    let currentText = '';
    
    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    
    function type() {
        if (lineIndex < lines.length) {
            const currentLine = lines[lineIndex];
            
            if (charIndex < currentLine.length) {
                currentText += currentLine[charIndex];
                element.innerHTML = currentText.replace(/\n/g, '<br>');
                element.appendChild(cursor);
                charIndex++;
                setTimeout(type, CONFIG.typewriter.speed);
            } else {
                lineIndex++;
                if (lineIndex < lines.length) {
                    currentText += '<br>';
                    charIndex = 0;
                    setTimeout(type, CONFIG.typewriter.pauseAfterLine);
                } else {
                    cursor.remove();
                    if (callback) callback();
                }
            }
        }
    }
    
    type();
}

/**
 * Type code with syntax highlighting
 */
function typeCode(element, code, callback) {
    let index = 0;
    
    function type() {
        if (index < code.length) {
            element.textContent = code.substring(0, index + 1);
            index++;
            setTimeout(type, 15);
        } else {
            // Apply syntax highlighting
            element.innerHTML = highlightCode(code);
            if (callback) callback();
        }
    }
    
    type();
}

/**
 * Simple syntax highlighting for Python
 */
function highlightCode(code) {
    return code
        .replace(/(def |return |float|print)/g, '<span class="code-keyword">$1</span>')
        .replace(/(#.*)/g, '<span class="code-comment">$1</span>')
        .replace(/(".*?")/g, '<span class="code-string">$1</span>')
        .replace(/('.*?')/g, '<span class="code-string">$1</span>')
        .replace(/(calculate_birthday_joy|result)/g, '<span class="code-function">$1</span>');
}

// ============================================
// Section Transitions
// ============================================

/**
 * Transition to a specific section
 */
function goToSection(sectionNumber) {
    if (state.isAnimating || sectionNumber === state.currentSection) return;
    if (sectionNumber < 1 || sectionNumber > CONFIG.totalSections) return;
    
    state.isAnimating = true;
    
    const currentSection = elements.sections[state.currentSection];
    currentSection.classList.remove('active');
    
    setTimeout(() => {
        const newSection = elements.sections[sectionNumber];
        newSection.classList.add('active');
        state.currentSection = sectionNumber;
        
        updateProgress();
        triggerSectionAnimations(sectionNumber);
        
        setTimeout(() => {
            state.isAnimating = false;
        }, 600);
    }, 400);
}

/**
 * Trigger section-specific animations
 */
function triggerSectionAnimations(sectionNumber) {
    switch (sectionNumber) {
        case 2:
            setTimeout(() => {
                typeWriter(elements.mysteryText, TEXT.mystery);
            }, 500);
            break;
            
        case 3:
            if (!state.confettiTriggered) {
                setTimeout(createConfetti, 300);
                state.confettiTriggered = true;
            }
            animateWishLines();
            break;
            
        case 4:
            initQuiz();
            break;
            
        case 6:
            animateTimeline();
            break;
            
        case 7:
            if (!state.codeTyped) {
                setTimeout(() => {
                    typeCode(elements.codeContent, TEXT.code, () => {
                        state.codeTyped = true;
                        elements.btnRunCode.classList.remove('hidden');
                    });
                }, 500);
            }
            break;
            
        case 8:
            initBalloonGame();
            break;
            
        case 10:
            animateCompliments();
            break;
            
        case 11:
            animateClosingLines();
            startFloatingHearts();
            triggerFinalEmojiBurst();
            break;
    }
}

// ============================================
// Section-Specific Animations
// ============================================

/**
 * Animate wish lines
 */
function animateWishLines() {
    const wishLines = document.querySelectorAll('.wish-line');
    wishLines.forEach((line, index) => {
        setTimeout(() => {
            line.classList.add('visible');
        }, (index + 1) * CONFIG.delays.wishLine);
    });
}

/**
 * Animate timeline items
 */
function animateTimeline() {
    const items = document.querySelectorAll('.timeline-item');
    items.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('visible');
        }, (index + 1) * CONFIG.delays.timeline);
    });
}

/**
 * Animate compliment cards
 */
function animateCompliments() {
    const cards = document.querySelectorAll('.compliment-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('visible');
        }, (index + 1) * CONFIG.delays.compliment);
    });
}

/**
 * Animate closing section
 */
function animateClosingLines() {
    const closingLines = document.querySelectorAll('.closing-line');
    const dividers = document.querySelectorAll('.closing-divider');
    const signature = document.querySelector('.signature');
    
    closingLines.forEach((line, index) => {
        setTimeout(() => {
            line.classList.add('visible');
        }, index * CONFIG.delays.closingLine);
    });
    
    dividers.forEach((divider, index) => {
        setTimeout(() => {
            divider.classList.add('visible');
        }, (3 + index * 3) * CONFIG.delays.closingLine);
    });
    
    setTimeout(() => {
        signature.classList.add('visible');
    }, closingLines.length * CONFIG.delays.closingLine + 500);
}

/**
 * Trigger final emoji burst
 */
function triggerFinalEmojiBurst() {
    const emojis = ['🎉', '✨', '🎂', '💖', '🌟', '🎈', '🥳', '💫'];
    const container = elements.finalEmojiBurst;
    
    setTimeout(() => {
        emojis.forEach((emoji, index) => {
            setTimeout(() => {
                const span = document.createElement('span');
                span.className = 'burst-emoji';
                span.textContent = emoji;
                span.style.animationDelay = `${index * 0.1}s`;
                container.appendChild(span);
            }, index * 100);
        });
    }, CONFIG.delays.closingLine * 10);
}

// ============================================
// Quiz System
// ============================================

/**
 * Initialize quiz
 */
function initQuiz() {
    QUIZ.currentIndex = 0;
    showQuizQuestion();
}

/**
 * Display current quiz question
 */
function showQuizQuestion() {
    const q = QUIZ.questions[QUIZ.currentIndex];
    elements.quizQuestion.textContent = q.question;
    elements.quizOptions.innerHTML = '';
    elements.quizResult.textContent = '';
    elements.quizResult.classList.remove('visible');
    
    q.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.textContent = option;
        btn.addEventListener('click', () => handleQuizAnswer(index));
        elements.quizOptions.appendChild(btn);
    });
}

/**
 * Handle quiz answer
 */
function handleQuizAnswer(selectedIndex) {
    const q = QUIZ.questions[QUIZ.currentIndex];
    const options = elements.quizOptions.querySelectorAll('.quiz-option');
    
    options.forEach((opt, index) => {
        opt.disabled = true;
        if (index === q.correct) {
            opt.classList.add('correct');
        } else if (index === selectedIndex && selectedIndex !== q.correct) {
            opt.classList.add('incorrect');
        }
    });
    
    elements.quizResult.textContent = q.response;
    elements.quizResult.classList.add('visible');
    
    setTimeout(() => {
        if (QUIZ.currentIndex < QUIZ.questions.length - 1) {
            QUIZ.currentIndex++;
            showQuizQuestion();
        } else {
            state.quizCompleted = true;
            elements.buttons[4].classList.remove('hidden');
        }
    }, 2000);
}

// ============================================
// Fortune Cookie
// ============================================

/**
 * Setup fortune cookie interaction
 */
function setupFortuneCookie() {
    elements.fortuneCookie.addEventListener('click', () => {
        if (state.fortuneOpened) return;
        
        state.fortuneOpened = true;
        elements.fortuneCookie.classList.add('cracked');
        
        setTimeout(() => {
            const fortune = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
            elements.fortuneMessage.querySelector('.fortune-text').textContent = fortune;
            elements.fortuneMessage.classList.remove('hidden');
            elements.buttons[5].classList.remove('hidden');
            elements.fortuneCookie.querySelector('.cookie-hint').classList.add('hidden');
        }, 500);
    });
}

// ============================================
// Balloon Game
// ============================================

/**
 * Initialize balloon popping game
 */
function initBalloonGame() {
    state.balloonsPopped = 0;
    elements.balloonsPopped.textContent = '0';
    elements.wishDisplay.classList.add('hidden');
    
    const balloons = elements.balloonGame.querySelectorAll('.game-balloon');
    balloons.forEach(balloon => {
        balloon.classList.remove('popped');
        balloon.style.visibility = 'visible';
    });
}

/**
 * Setup balloon game listeners
 */
function setupBalloonGame() {
    const balloons = elements.balloonGame.querySelectorAll('.game-balloon');
    
    balloons.forEach(balloon => {
        balloon.addEventListener('click', () => {
            if (balloon.classList.contains('popped')) return;
            
            balloon.classList.add('popped');
            state.balloonsPopped++;
            elements.balloonsPopped.textContent = state.balloonsPopped;
            
            const wish = balloon.dataset.wish;
            elements.revealedWish.textContent = wish;
            elements.wishDisplay.classList.remove('hidden');
            
            // Small confetti burst
            createMiniConfetti(balloon);
            
            setTimeout(() => {
                balloon.style.visibility = 'hidden';
            }, 300);
            
            if (state.balloonsPopped >= 6) {
                setTimeout(() => {
                    elements.buttons[8].classList.remove('hidden');
                }, 500);
            }
        });
    });
}

/**
 * Create mini confetti burst at balloon position
 */
function createMiniConfetti(element) {
    const rect = element.getBoundingClientRect();
    const colors = CONFIG.confetti.colors;
    
    for (let i = 0; i < 10; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.cssText = `
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top}px;
            width: 8px;
            height: 8px;
            background: ${color};
            animation-duration: 1.5s;
        `;
        
        elements.confetti.appendChild(confetti);
        setTimeout(() => confetti.remove(), 1500);
    }
}

// ============================================
// Candle Blow
// ============================================

/**
 * Setup candle blow interaction
 */
function setupCandleBlow() {
    elements.bigCandle.addEventListener('click', () => {
        if (state.candleBlown) return;
        
        state.candleBlown = true;
        elements.candleFlame.classList.add('blown-out');
        elements.blowInstruction.style.opacity = '0';
        
        // Create smoke effect
        createSmoke();
        
        setTimeout(() => {
            elements.wishMade.classList.remove('hidden');
            elements.buttons[9].classList.remove('hidden');
            
            // Small celebration
            createConfetti();
        }, 800);
    });
}

/**
 * Create smoke effect
 */
function createSmoke() {
    const candle = elements.bigCandle;
    const rect = candle.getBoundingClientRect();
    
    for (let i = 0; i < 5; i++) {
        const smoke = document.createElement('div');
        smoke.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top - 40}px;
            width: 10px;
            height: 10px;
            background: rgba(200, 200, 200, 0.5);
            border-radius: 50%;
            pointer-events: none;
            animation: smokeRise 1s ease-out forwards;
            animation-delay: ${i * 0.1}s;
        `;
        document.body.appendChild(smoke);
        setTimeout(() => smoke.remove(), 1000);
    }
}

// Add smoke animation
const smokeStyle = document.createElement('style');
smokeStyle.textContent = `
    @keyframes smokeRise {
        0% { transform: translateY(0) scale(1); opacity: 0.5; }
        100% { transform: translateY(-50px) scale(2); opacity: 0; }
    }
`;
document.head.appendChild(smokeStyle);

// ============================================
// Run Code Button
// ============================================

/**
 * Setup run code button
 */
function setupRunCode() {
    elements.btnRunCode.addEventListener('click', () => {
        elements.btnRunCode.classList.add('hidden');
        elements.terminalOutput.classList.remove('hidden');
        
        // Type terminal output
        let index = 0;
        const text = TEXT.terminalOutput;
        
        function typeTerminal() {
            if (index < text.length) {
                elements.terminalText.textContent = text.substring(0, index + 1);
                index++;
                setTimeout(typeTerminal, 30);
            } else {
                setTimeout(() => {
                    elements.buttons[7].classList.remove('hidden');
                }, 500);
            }
        }
        
        typeTerminal();
    });
}

// ============================================
// Confetti Effect
// ============================================

/**
 * Create confetti burst
 */
function createConfetti() {
    const container = elements.confetti;
    const colors = CONFIG.confetti.colors;
    
    for (let i = 0; i < CONFIG.confetti.count; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            const color = colors[Math.floor(Math.random() * colors.length)];
            const left = Math.random() * 100;
            const size = Math.random() * 10 + 5;
            const duration = Math.random() * 2 + 3;
            const shape = Math.random() > 0.5 ? '50%' : '0';
            
            confetti.style.cssText = `
                left: ${left}%;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border-radius: ${shape};
                animation-duration: ${duration}s;
            `;
            
            container.appendChild(confetti);
            setTimeout(() => confetti.remove(), duration * 1000);
        }, i * CONFIG.delays.confetti);
    }
}

// ============================================
// Floating Particles
// ============================================

/**
 * Create ambient floating particles
 */
function createParticles() {
    if (state.particlesCreated) return;
    
    const container = elements.particles;
    const colors = CONFIG.particles.colors;
    
    for (let i = 0; i < CONFIG.particles.count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 15 + 5;
        const left = Math.random() * 100;
        const duration = Math.random() * 10 + 15;
        const delay = Math.random() * 10;
        
        particle.style.cssText = `
            left: ${left}%;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
        `;
        
        container.appendChild(particle);
    }
    
    state.particlesCreated = true;
}

// ============================================
// Floating Hearts
// ============================================

/**
 * Start floating hearts animation
 */
function startFloatingHearts() {
    const container = elements.hearts;
    const hearts = ['💕', '💗', '💖', '✨', '🌸', '💫', '🌟'];
    
    function createHeart() {
        if (state.currentSection !== CONFIG.totalSections) return;
        
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        
        const left = Math.random() * 100;
        const duration = Math.random() * 2 + 3;
        const size = Math.random() * 1 + 0.8;
        
        heart.style.cssText = `
            left: ${left}%;
            font-size: ${size}rem;
            animation-duration: ${duration}s;
        `;
        
        container.appendChild(heart);
        setTimeout(() => heart.remove(), duration * 1000);
        setTimeout(createHeart, CONFIG.delays.heart + Math.random() * 800);
    }
    
    createHeart();
}

// ============================================
// Button Ripple Effect
// ============================================

/**
 * Create ripple effect on button click
 */
function createRipple(event) {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
    `;
    
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
}

// ============================================
// Restart Experience
// ============================================

/**
 * Reset and restart the experience
 */
function restartExperience() {
    // Reset state
    state.currentSection = 1;
    state.confettiTriggered = false;
    state.quizCompleted = false;
    state.fortuneOpened = false;
    state.balloonsPopped = 0;
    state.candleBlown = false;
    state.codeTyped = false;
    
    // Reset UI
    QUIZ.currentIndex = 0;
    
    // Reset all sections
    Object.values(elements.sections).forEach(section => {
        section.classList.remove('active');
    });
    
    // Reset visibility classes
    document.querySelectorAll('.visible').forEach(el => el.classList.remove('visible'));
    document.querySelectorAll('.hidden').forEach(el => {
        if (!el.classList.contains('always-hidden')) {
            el.classList.add('hidden');
        }
    });
    
    // Hide buttons that should be hidden initially
    [4, 5, 7, 8, 9].forEach(i => {
        if (elements.buttons[i]) {
            elements.buttons[i].classList.add('hidden');
        }
    });
    
    if (elements.btnRunCode) elements.btnRunCode.classList.add('hidden');
    if (elements.terminalOutput) elements.terminalOutput.classList.add('hidden');
    
    // Reset text content
    if (elements.introText) elements.introText.innerHTML = '';
    if (elements.mysteryText) elements.mysteryText.innerHTML = '';
    if (elements.codeContent) elements.codeContent.innerHTML = '';
    if (elements.terminalText) elements.terminalText.innerHTML = '';
    
    // Reset fortune cookie
    if (elements.fortuneCookie) {
        elements.fortuneCookie.classList.remove('cracked');
        const hint = elements.fortuneCookie.querySelector('.cookie-hint');
        if (hint) hint.classList.remove('hidden');
    }
    if (elements.fortuneMessage) elements.fortuneMessage.classList.add('hidden');
    
    // Reset candle
    if (elements.candleFlame) elements.candleFlame.classList.remove('blown-out');
    if (elements.blowInstruction) elements.blowInstruction.style.opacity = '1';
    if (elements.wishMade) elements.wishMade.classList.add('hidden');
    
    // Reset balloon game
    if (elements.balloonGame) {
        const balloons = elements.balloonGame.querySelectorAll('.game-balloon');
        balloons.forEach(b => {
            b.classList.remove('popped');
            b.style.visibility = 'visible';
        });
    }
    if (elements.balloonsPopped) elements.balloonsPopped.textContent = '0';
    if (elements.wishDisplay) elements.wishDisplay.classList.add('hidden');
    
    // Reset final emoji burst
    if (elements.finalEmojiBurst) elements.finalEmojiBurst.innerHTML = '';
    
    // Start fresh
    elements.sections[1].classList.add('active');
    updateProgress();
    
    setTimeout(() => {
        typeWriter(elements.introText, TEXT.intro);
    }, 800);
}

// ============================================
// Event Listeners
// ============================================

/**
 * Set up all event listeners
 */
function setupEventListeners() {
    // Navigation buttons
    for (let i = 1; i < CONFIG.totalSections; i++) {
        if (elements.buttons[i]) {
            elements.buttons[i].addEventListener('click', (e) => {
                createRipple(e);
                setTimeout(() => goToSection(i + 1), 200);
            });
        }
    }
    
    // Special interactions
    setupFortuneCookie();
    setupBalloonGame();
    setupCandleBlow();
    setupRunCode();
    
    // Restart button
    if (elements.btnRestart) {
        elements.btnRestart.addEventListener('click', (e) => {
            createRipple(e);
            setTimeout(restartExperience, 300);
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            if (state.currentSection < CONFIG.totalSections) {
                const btn = elements.buttons[state.currentSection];
                if (btn && !btn.classList.contains('hidden')) {
                    goToSection(state.currentSection + 1);
                }
            }
        }
    });
    
    // Touch swipe support
    let touchStartY = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    document.addEventListener('touchend', (e) => {
        const touchEndY = e.changedTouches[0].clientY;
        const diff = touchStartY - touchEndY;
        
        if (diff > 50 && state.currentSection < CONFIG.totalSections) {
            const btn = elements.buttons[state.currentSection];
            if (btn && !btn.classList.contains('hidden')) {
                goToSection(state.currentSection + 1);
            }
        }
    }, { passive: true });
}

// ============================================
// Initialization
// ============================================

/**
 * Initialize the birthday experience
 */
function init() {
    initElements();
    createProgressDots();
    updateProgress();
    setupEventListeners();
    createParticles();
    
    // Activate first section
    elements.sections[1].classList.add('active');
    
    // Start intro typewriter
    setTimeout(() => {
        typeWriter(elements.introText, TEXT.intro);
    }, 800);
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
