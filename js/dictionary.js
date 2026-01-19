
const LETTER_SCORES = {
    'A': 1, 'E': 1, 'I': 1, 'O': 1, 'U': 1, 'L': 1, 'N': 1, 'S': 1, 'T': 1, 'R': 1,
    'D': 2, 'G': 2,
    'B': 3, 'C': 3, 'M': 3, 'P': 3,
    'F': 4, 'H': 4, 'V': 4, 'W': 4, 'Y': 4,
    'K': 5,
    'J': 8, 'X': 8,
    'Q': 10, 'Z': 10
};

// Distribution for spawning (Scrabble distribution somewhat)
const LETTER_DISTRIBUTION = [
    ...'AAAAAAAAABBCCDDDDEEEEEEEEEEEEFFGGGHHIIIIIIIIIJKLLLLMMNNNNNNOOOOOOOOPPQRRRRRRSSSSTTTTTTUUUUVVWWXYYZ'
];


class Dictionary {
    constructor() {
        this.words = new Set();
        this.isLoaded = false;
    }

    async load() {
        try {
            // Try fetching full 10k list from remote
            const response = await fetch('https://raw.githubusercontent.com/rsms/inter/master/docs/lab/words-google-10000-english-usa-no-swears.json');
            if (!response.ok) throw new Error('Remote fetch failed');
            const list = await response.json();
            this.words = new Set(list.map(w => w.toUpperCase()));
            this.isLoaded = true;
            console.log(`Dictionary loaded (Remote): ${this.words.size} words`);
        } catch (e) {
            console.warn('Remote dictionary failed, falling back to local...', e);
            try {
                const localResponse = await fetch('words.json');
                const localList = await localResponse.json();
                this.words = new Set(localList.map(w => w.toUpperCase()));
                this.isLoaded = true;
                console.log(`Dictionary loaded (Local): ${this.words.size} words`);
            } catch (e2) {
                console.error('Local dictionary failed', e2);
                this.words = new Set(["THE", "AND", "YOU", "FOR", "NOT"]);
            }
        }
    }

    isValid(word) {
        return this.words.has(word.toUpperCase());
    }

    getScore(word) {
        let score = 0;
        for (let char of word.toUpperCase()) {
            score += (LETTER_SCORES[char] || 0);
        }
        return score;
    }

    getRandomLetter() {
        const idx = Math.floor(Math.random() * LETTER_DISTRIBUTION.length);
        return LETTER_DISTRIBUTION[idx];
    }
}

