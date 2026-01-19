
document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();

    // UI Elements
    const nameInput = document.getElementById('player-name');
    const diffInputs = document.getElementsByName('difficulty');
    const durInput = document.getElementById('duration');
    const durVal = document.getElementById('dur-val');
    const scoreBody = document.getElementById('score-tbody');

    // 1. Load Data
    const prefs = StorageManager.getPreferences();
    const scores = StorageManager.getScores();

    // 2. Populate UI
    if (prefs.playerName) nameInput.value = prefs.playerName;
    if (prefs.duration) {
        durInput.value = prefs.duration;
        durVal.innerText = prefs.duration;
    }
    if (prefs.difficulty) {
        for (let r of diffInputs) {
            if (r.value === prefs.difficulty) r.checked = true;
        }
    }

    // Render Scores
    renderScores(scores);

    // 3. Event Listeners
    durInput.addEventListener('input', (e) => {
        durVal.innerText = e.target.value;
    });

    const startBtn = document.getElementById('start-btn');

    // Disable start until loaded
    startBtn.disabled = true;
    startBtn.innerText = 'LOADING...';
    startBtn.style.opacity = '0.5';

    game.dictionary.load().then(() => {
        startBtn.disabled = false;
        startBtn.innerText = 'INITIALIZE';
        startBtn.style.opacity = '1';
    });

    startBtn.addEventListener('click', () => {
        // Collect Config
        const playerName = nameInput.value.trim() || 'Guest';
        const duration = parseInt(durInput.value);

        let diff = 'medium';
        let mult = 1.0;

        for (let r of diffInputs) {
            if (r.checked) diff = r.value;
        }

        switch (diff) {
            case 'easy': mult = 0.5; break;
            case 'medium': mult = 1.0; break;
            case 'hard': mult = 2.0; break;
        }

        // Config Game
        game.setConfig({
            playerName: playerName,
            duration: duration,
            difficultyName: diff,
            difficultyMultiplier: mult
        });

        // Start
        game.start();
    });

    function renderScores(list) {
        scoreBody.innerHTML = '';
        if (!list || list.length === 0) {
            scoreBody.innerHTML = '<tr><td colspan="3" style="text-align:center; opacity:0.5;">No Records</td></tr>';
            return;
        }

        list.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.name}</td>
                <td><span class="badge ${item.difficulty}">${item.difficulty.substring(0, 3).toUpperCase()}</span></td>
                <td>${item.score}</td>
            `;
            scoreBody.appendChild(tr);
        });
    }
});
