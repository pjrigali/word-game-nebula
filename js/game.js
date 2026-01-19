
class Game {
    constructor() {
        this.dictionary = new Dictionary();
        this.physics = new PhysicsEngine('letter-box');

        // DOM Elements
        this.scoreDisplay = document.getElementById('score-display');
        this.timerDisplay = document.getElementById('timer-display');
        this.input = document.getElementById('word-input');
        this.feedback = document.getElementById('feedback');

        this.startScreen = document.getElementById('start-screen');
        this.gameUI = document.getElementById('game-ui');
        this.gameOverScreen = document.getElementById('game-over-screen');
        this.finalScoreDisplay = document.getElementById('final-score');

        // Game Config (Default)
        this.GAME_DURATION = 60;
        this.TARGET_LETTER_COUNT = 15;
        this.difficultyMultiplier = 1;
        this.difficultyName = 'medium';
        this.playerName = 'Guest';

        // State
        this.score = 0;
        this.timeLeft = 0;
        this.timerInterval = null;
        this.isPlaying = false;

        this.attachEventListeners();
    }

    setConfig(config) {
        // config: { duration, difficultyMultiplier, difficultyName, playerName }
        if (config.duration) this.GAME_DURATION = parseInt(config.duration);
        if (config.difficultyMultiplier) {
            this.difficultyMultiplier = parseFloat(config.difficultyMultiplier);
            this.physics.setDifficulty(this.difficultyMultiplier);
        }
        if (config.difficultyName) this.difficultyName = config.difficultyName;
        if (config.playerName) this.playerName = config.playerName || 'Guest';
    }

    attachEventListeners() {
        // Handled by main.js now for start button to capture inputs
        document.getElementById('restart-btn').addEventListener('click', () => {
            // Reboot System -> Go to Main Menu (Reset)
            this.reset();
        });

        document.getElementById('main-menu-btn').addEventListener('click', () => this.reset());
        document.getElementById('reset-game-btn').addEventListener('click', () => this.reset());

        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && this.isPlaying) {
                this.submitWord(this.input.value.trim());
            }
        });

        // Keep focus
        document.addEventListener('click', (e) => {
            if (this.isPlaying && e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT') this.input.focus();
        });
    }

    reset() {
        this.isPlaying = false;
        clearInterval(this.timerInterval);
        this.physics.stop();
        this.physics.clear();

        // Return to start screen
        this.gameUI.classList.remove('active');
        this.gameOverScreen.classList.remove('active'); // Ensure Game Over is hidden
        this.startScreen.classList.add('active');

        // Update stats (optional, mainly just needs to clean up)
        this.score = 0;
        this.timeLeft = this.GAME_DURATION;
    }

    start() {
        this.score = 0;
        this.timeLeft = this.GAME_DURATION;
        this.isPlaying = true;

        this.updateHUD();
        this.physics.clear();
        this.input.value = '';
        this.input.focus();
        this.feedback.innerText = '';

        // Switch Screens
        this.startScreen.classList.remove('active');
        this.gameUI.classList.add('active');
        this.gameOverScreen.classList.remove('active'); // Ensure this is hidden

        // Start Systems
        setTimeout(() => {
            this.physics.start();
            this.startTimer();

            // Initial Spawn
            this.maintainLetterCount();
        }, 100);
    }

    end() {
        this.isPlaying = false;
        clearInterval(this.timerInterval);
        this.physics.stop();

        this.gameUI.classList.remove('active');
        this.gameOverScreen.classList.add('active');

        // Final Score Calculation (Apply Multiplier)
        const rawScore = this.score;
        // Round to nearest integer if needed
        const finalScore = Math.round(this.score * this.difficultyMultiplier);
        this.score = finalScore; // Update state for display

        this.finalScoreDisplay.innerHTML = `${finalScore} <small>(x${this.difficultyMultiplier})</small>`;

        // Save Score
        StorageManager.saveScore({
            name: this.playerName,
            score: finalScore,
            difficulty: this.difficultyName,
            time: this.GAME_DURATION,
            date: new Date().toLocaleDateString()
        });

        // Update Prefs
        StorageManager.savePreferences({
            playerName: this.playerName,
            difficulty: this.difficultyName,
            duration: this.GAME_DURATION
        });
    }

    startTimer() {
        clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.updateHUD();
            if (this.timeLeft <= 0) {
                this.end();
            }
        }, 1000);
    }

    updateHUD() {
        this.scoreDisplay.innerText = this.score;
        this.timerDisplay.innerText = this.timeLeft;
        // Visual warning for low time?
        if (this.timeLeft <= 10) {
            this.timerDisplay.style.color = '#ff4757';
        } else {
            this.timerDisplay.style.color = '#fff';
        }
    }

    maintainLetterCount() {
        const currentCount = this.physics.getLetterCount();
        const needed = this.TARGET_LETTER_COUNT - currentCount;
        if (needed > 0) {
            for (let i = 0; i < needed; i++) {
                // Stagger spawns slightly for visual effect
                setTimeout(() => {
                    if (!this.isPlaying) return;
                    this.physics.spawnLetter(this.dictionary.getRandomLetter());
                }, i * 100);
            }
        }
    }

    showFeedback(msg, type) {
        this.feedback.innerText = msg;
        this.feedback.className = `feedback ${type}`;
        this.feedback.style.opacity = 1;

        // Reset animation
        setTimeout(() => {
            this.feedback.style.opacity = 0;
        }, 1000);
    }

    submitWord(word) {
        if (!word) return;

        // 1. Check Dictionary
        if (!this.dictionary.isValid(word)) {
            this.showFeedback('UNKNOWN WORD', 'error');
            this.input.classList.add('shake');
            setTimeout(() => this.input.classList.remove('shake'), 300);
            return;
        }

        // 2. Check Letters Available & Consume
        if (this.physics.consumeLetters(word)) {
            // Success!
            const baseScore = this.dictionary.getScore(word);
            this.score += baseScore;
            this.timeLeft += baseScore; // Bonus Time

            this.updateHUD();
            this.showFeedback(`+${baseScore} PTS & SEC`, 'success');
            this.input.value = '';

            // Refill letters
            this.maintainLetterCount();
        } else {
            // Failure: Missing Letters. Penalty applied.
            this.score = Math.max(0, this.score - 1);
            this.updateHUD();
            this.showFeedback('-1 (MISSING LETTERS)', 'error');

            this.input.classList.add('shake');
            setTimeout(() => this.input.classList.remove('shake'), 300);
        }
    }
}
