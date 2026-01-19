
class FloatingLetter {
    constructor(char, containerWidth, containerHeight, speedMultiplier) {
        this.char = char;
        this.element = document.createElement('div');
        this.element.classList.add('floating-letter');
        this.element.classList.add('pop-in');

        // Setup inner content
        this.element.innerText = char;
        const sub = document.createElement('span');
        sub.classList.add('score-sub');

        // Score Lookup
        const LETTER_SCORES = {
            'A': 1, 'E': 1, 'I': 1, 'O': 1, 'U': 1, 'L': 1, 'N': 1, 'S': 1, 'T': 1, 'R': 1,
            'D': 2, 'G': 2,
            'B': 3, 'C': 3, 'M': 3, 'P': 3,
            'F': 4, 'H': 4, 'V': 4, 'W': 4, 'Y': 4,
            'K': 5,
            'J': 8, 'X': 8,
            'Q': 10, 'Z': 10
        };
        const score = LETTER_SCORES[char] || 1;
        sub.innerText = score;
        this.element.appendChild(sub);

        // Color Tiers
        this.element.classList.add('tier-common'); // Default Light Grey
        if (score >= 3) {
            this.element.classList.remove('tier-common');
            this.element.classList.add('tier-uncommon'); // Blue
        }
        if (score >= 5) {
            this.element.classList.remove('tier-uncommon');
            this.element.classList.add('tier-rare'); // Purple
        }
        if (score >= 8) {
            this.element.classList.remove('tier-rare');
            this.element.classList.add('tier-legendary'); // Gold
        }

        // Random Size variance
        this.size = 50;

        // Position: use slight padding to ensure completely visible
        const safeWidth = (containerWidth || 600) - this.size;
        const safeHeight = (containerHeight || 400) - this.size;

        this.x = Math.random() * safeWidth;
        this.y = Math.random() * safeHeight;


        this.y = Math.random() * safeHeight;


        // Random Velocity (Scaled by multiplier)
        const baseSpeed = 1.5;
        const speed = baseSpeed * (speedMultiplier || 1);
        const angle = Math.random() * Math.PI * 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;

        this.width = containerWidth;
        this.height = containerHeight;

        this.isRemoved = false;
    }

    update() {
        if (this.isRemoved) return;

        this.x += this.vx;
        this.y += this.vy;

        // Wall Bounce
        if (this.x <= 0) { this.x = 0; this.vx *= -1; }
        if (this.x >= this.width - this.size) { this.x = this.width - this.size; this.vx *= -1; }
        if (this.y <= 0) { this.y = 0; this.vy *= -1; }
        if (this.y >= this.height - this.size) { this.y = this.height - this.size; this.vy *= -1; }

        // Use top/left to avoid conflict with CSS transform animations (pop-in)
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }

    remove() {
        this.isRemoved = true;
        this.element.classList.remove('pop-in');
        this.element.classList.add('pop-out');
        setTimeout(() => {
            if (this.element.parentNode) {
                this.element.parentNode.removeChild(this.element);
            }
        }, 350);
    }
}

class PhysicsEngine {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.letters = [];
        this.isRunning = false;

        // Initial dims
        this.refreshDimensions();

        window.addEventListener('resize', () => this.refreshDimensions());
    }

    refreshDimensions() {
        if (this.container) {
            this.width = this.container.clientWidth || 600; // Fallback to max-width
            this.height = this.container.clientHeight || 400; // Fallback to default height
            this.letters.forEach(l => {
                l.width = this.width;
                l.height = this.height;
            });
        }
    }

    spawnLetter(char) {
        // Ensure dimensions are up-to-date in case container was hidden/resized
        if (this.width === 0) this.refreshDimensions();

        const letter = new FloatingLetter(char, this.width, this.height, this.speedMultiplier);
        this.letters.push(letter);
        this.container.appendChild(letter.element);
    }

    setDifficulty(multiplier) {
        this.speedMultiplier = multiplier;
    }

    start() {
        if (this.isRunning) return;
        this.refreshDimensions(); // Critical: Update dims as container is now visible
        this.isRunning = true;
        this.loop();
    }

    stop() {
        this.isRunning = false;
    }

    clear() {
        this.letters.forEach(l => {
            if (l.element.parentNode) l.element.parentNode.removeChild(l.element);
        });
        this.letters = [];
    }

    loop = () => {
        if (!this.isRunning) return;

        this.letters.forEach(l => l.update());
        this.handleCollisions();

        // Clean up removed letters strictly from array
        this.letters = this.letters.filter(l => !l.isRemoved);

        requestAnimationFrame(this.loop);
    }

    handleCollisions() {
        // Only active letters
        const active = this.letters.filter(l => !l.isRemoved);
        const radius = 25; // Size is 50, so radius is 25
        const minDistance = 50; // buffer slightly?

        for (let i = 0; i < active.length; i++) {
            for (let j = i + 1; j < active.length; j++) {
                const l1 = active[i];
                const l2 = active[j];

                const dx = l2.x - l1.x;
                const dy = l2.y - l1.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < minDistance && distance > 0) {
                    // 1. Resolve Overlap (Push apart)
                    const overlap = minDistance - distance;
                    const nx = dx / distance;
                    const ny = dy / distance;

                    const moveX = nx * overlap * 0.5;
                    const moveY = ny * overlap * 0.5;

                    l1.x -= moveX;
                    l1.y -= moveY;
                    l2.x += moveX;
                    l2.y += moveY;

                    // 2. Resolve Velocity (Elastic bounce)
                    // Normal velocity components
                    const dvx = l1.vx - l2.vx;
                    const dvy = l1.vy - l2.vy;
                    const p = dvx * nx + dvy * ny;

                    // Only bounce if moving towards each other
                    if (p > 0) {
                        l1.vx -= p * nx;
                        l1.vy -= p * ny;
                        l2.vx += p * nx;
                        l2.vy += p * ny;
                    }
                }
            }
        }
    }

    // Returns true if letters for the word are available and removes them
    // This is the core "Link" between Physics and Game Logic
    consumeLetters(word) {
        const wordChars = word.toUpperCase().split('');
        const available = this.letters.filter(l => !l.isRemoved).map(l => l.char); // simplified map for checking

        // Quick frequency check
        const wordFreq = {};
        for (let c of wordChars) wordFreq[c] = (wordFreq[c] || 0) + 1;

        const availableFreq = {};
        for (let c of available) availableFreq[c] = (availableFreq[c] || 0) + 1;

        for (let c in wordFreq) {
            if (!availableFreq[c] || availableFreq[c] < wordFreq[c]) {
                return false; // Not enough letters
            }
        }

        // Visualize removal
        // We need to pick specific instances to remove
        const toRemove = [];
        const currentLetters = [...this.letters]; // Copy to avoid mutation issues during search

        for (let c of wordChars) {
            const idx = currentLetters.findIndex(l => l.char === c && !l.isRemoved && !toRemove.includes(l));
            if (idx !== -1) {
                toRemove.push(currentLetters[idx]);
            }
        }

        toRemove.forEach(l => l.remove());
        return true;
    }

    getLetterCount() {
        return this.letters.filter(l => !l.isRemoved).length;
    }
}
