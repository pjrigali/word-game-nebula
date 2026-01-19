
const STORAGE_KEYS = {
    SCORES: 'nebula_scores',
    PREFS: 'nebula_prefs'
};

class StorageManager {
    static getScores() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.SCORES);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Failed to load scores', e);
            return [];
        }
    }

    static saveScore(entry) {
        // Entry: { name, score, difficulty, time, date }
        const scores = this.getScores();
        scores.push(entry);

        // Sort by score desc
        scores.sort((a, b) => b.score - a.score);

        // Keep top 10
        const top10 = scores.slice(0, 10);

        localStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify(top10));
        return top10;
    }

    static getPreferences() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.PREFS);
            return data ? JSON.parse(data) : {
                playerName: '',
                difficulty: 'easy', // easy, medium, hard
                duration: 60
            };
        } catch (e) {
            return { playerName: '', difficulty: 'medium', duration: 60 };
        }
    }

    static savePreferences(prefs) {
        localStorage.setItem(STORAGE_KEYS.PREFS, JSON.stringify(prefs));
    }
}
