# Project Retrospective: Nebula Words

**Date:** January 19, 2026
**Project:** Nebula Words (Advanced Typing Game)

## 📊 Telemetry & Metrics Note
*As an AI Agent, I do not have direct access to backend infrastructure metrics such as exact token usage, GPU compute time, or specific processing latency per turn. However, I can provide a session-level summary of our collaboration:*

*   **Total Interactions**: ~20 major turns/steps.
*   **Code Files Created**: 7 (`index.html`, `style.css`, 5 JS modules).
*   **Pivot Count**: 1 (Major architecture switch from React to Vanilla JS).
*   **Artifacts Generated**: Gameplay Videos, Debug Screenshots, Walkthroughs, README.

---

## 🛠️ Process Review

The development of "Nebula Words" followed an agile, iterative process characterized by a significant early technical pivot and a strong focus on visual fidelity.

### Phase 1: Inception & The Pivot
**Goal**: Create a "Premium" typing game.
**Challenge**: The initial plan involved a heavy stack (Vite + React + TypeScript). However, we identified early on that a lighter, no-build approach would be faster and more robust for this specific context.
**Decision**: Switched to **Vanilla HTML/CSS/JS**.
**Outcome**: This decision paid off immensely. It allowed for rapid prototyping, easier debugging of the physics engine, and zero build-step friction.

### Phase 2: Core Systems (The Physics)
**Goal**: Make letters "float" in a nebula.
**Implementation**:
*   **Physics Engine**: Built a custom `PhysicsEngine` class using `requestAnimationFrame`.
*   **Movement**: Moved from simple CSS animations to JS-driven `x/y` coordinates for precise control.
*   **Collision**: Implemented *Elastic Collision Detection*, ensuring letters bounce off each other realistically.

### Phase 3: Visual Identity (The Nebula)
**Goal**: "Wow" the user.
**Design Language**:
*   **Glassmorphism**: Translucent panels with blur filters.
*   **Neon Palette**: Used Scrabble-tier rarity colors (Common Grey to Legendary Gold).
*   **Feedback**: Added screen shake and floating text (+Score) to make every interaction feel punchy.

### Phase 4: Feature Expansion
Once the core loop was solid, we iterated rapidly on features:
1.  **Dictionary**: Started with a hardcoded list -> Expanded to a local 1k JSON -> Upgraded to a remote 10k Google Corpus.
2.  **Settings**: Added a dedicated Control Panel for Difficulty and Duration.
3.  **Persistence**: Created `StorageManager` to save High Scores via `localStorage`.

### Phase 5: Polish & "Gold Master"
The final phase focused on Quality of Life:
*   **Penalty Logic**: Added a -1 penalty for missing letters to prevent button mashing.
*   **Time Bonus**: Connected score to time, changing the meta to a "survival" style.
*   **Cleanup**: Removed debug logs and finalized documentation (`README.md`).

## 🧠 Key Learnings
1.  **Vanilla JS is Capable**: For game loops and DOM manipulation, modern Vanilla JS is incredibly performant and often simpler than wrestling with React state for 60fps animations.
2.  **Visuals First**: Establishing the "Nebula" theme early helped guide the UI decisions (glass panels, glowing text).
3.  **Iterative Complexity**: We didn't start with collision detection or 10k words. We built the toy first, then made it a game, then made it a *product*.

---
*End of Retrospective*
