# Nebula Words (v2.0)

**Nebula Words** is a premium, browser-based typing game where you capture floating letters from a nebula to form words before time runs out. Developed with Vanilla JavaScript, it features a glassmorphism aesthetic, physics-based letter interactions, and persistent high scores.

![Gameplay Demo](nebula_words_gold_master_1768859021706.webp)

## 🎮 How to Play

1.  **Initialize**: Enter your **Pilot Name**, select a **Difficulty**, and set your **Duration**.
2.  **Type Words**: Look at the floating letters in the central box. Type a word using ONLY those letters and press `ENTER`.
3.  **Score & survive**:
    *   **Valid Word**: You gain points based on letter rarity (Scrabble rules) AND **bonus time** (1 point = +1 second).
    *   **Invalid Word**: Shake effect, no penalty.
    *   **Missing Letters**: If you type a real word but don't have the letters on screen, you get a **-1 Point Penalty**.
4.  **Game Over**: When the timer hits 0, your session ends. Check the leaderboard to see if you made the Top 10!

## ✨ Features

- **Physics Engine**: Custom 2D physics with wall bouncing and **elastic collisions** (letters bounce off each other).
- **Dynamic Scoring**:
    - **Letter Rarity**: Common (1pt), Uncommon (3pts), Rare (5pts), Legendary (8+pts).
    - **Speed Multiplier**: 
        - Easy (0.5x Speed/Score)
        - Medium (1.0x Speed/Score)
        - Hard (2.0x Speed/Score)
- **Time Attack**: Every point scored adds seconds to your timer, allowing skilled players to extend their runs.
- **Start Screen Command Center**:
    - **Leaderboard**: Persistent local high scores.
    - **Settings**: Adjustable difficulty and duration sliders.
- **Dictionary**:
    - **10,000 Word Vocabulary**: Fetched from a remote corpus (Google 10k).
    - **Offline Fallback**: built-in 1,000 word list (`words.json`) if internet fails.
- **Visuals**: Premium "Sci-Fi Glass" aesthetic with neon glows, smooth CSS animations, and reactive inputs.

## 🛠️ Technical Overview

The project is built with **Vanilla HTML, CSS, and JavaScript**. No build tools or frameworks required.

### File Structure
*   `index.html`: The main entry point. Contains the 3-column Layout (Leaderboard, Main, Settings) and Game UI.
*   `css/style.css`: All styling. Uses CSS Variables for theming (`--primary`, `--secondary`) and Flexbox/Grid for layout.
*   `js/main.js`: Bootstrapper. Handles the Start Screen logic, Settings inputs, and initializes the `Game` instance.
*   `js/game.js`: The central controller. Manages game state (`isPlaying`, `score`, `timer`), handles Input events, and coordinates `Physics` and `Dictionary`.
*   `js/physics.js`: A custom 2D physics engine.
    *   `FloatingLetter` class: Handles individual letter rendering, movement, and wall bouncing.
    *   `PhysicsEngine` class: Manages the loop (`requestAnimationFrame`), collision detection, and letter spawning.
*   `js/dictionary.js`: Manages word validation. Fetches an external JSON list on load.
*   `js/storage.js`: A static helper class for `localStorage` persistence (High Scores & Preferences).
*   `words.json`: A local fallback list of ~1,000 common English words.

## 📜 Change Log

### v2.0 - The "Nebula" Update
*   **Added**: Collision Detection (letters no longer overlap).
*   **Added**: Time Bonus (Score = Time).
*   **Added**: Missing Letter Penalty (-1 point).
*   **Added**: 10,000 Word Dictionary (Remote Fetch).
*   **Added**: Reset Button (Abort game).
*   **Added**: Menu Button (In-game HUD navigation).
*   **Updated**: Start Screen Layout (3-Column Grid).
*   **Updated**: Physics Engine (Elastic Bouncing).

### v1.0 - Initial Release
*   Basic floating mechanics.
*   Scrabble scoring.
*   Local Storage High Scores.


(testing commit)