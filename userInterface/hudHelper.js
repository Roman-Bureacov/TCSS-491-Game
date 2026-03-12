/**
 * HUD Helper Module
 * Provides simple functions to update the HUD from game code
 */

export class HUD {
    /**
     * Update player health
     * @param {number} player - Player number (1 or 2)
     * @param {number} health - Health value (0-100)
     */
    static updateHealth(player, health) {
        if (window.hudSystem) {
            window.hudSystem.updateHealth(player, health);
        }
    }

    /**
     * Update game timer
     * @param {number} seconds - Seconds remaining
     */
    static updateTimer(seconds) {
        if (window.hudSystem) {
            window.hudSystem.updateTimer(seconds);
        }
    }

    /**
     * Update round number
     * @param {number} round - Current round number
     */
    static updateRound(round) {
        if (window.hudSystem) {
            window.hudSystem.updateRound(round);
        }
    }

    /**
     * Update character name display
     * @param {number} player - Player number (1 or 2)
     * @param {string} characterName - Character identifier
     */
    static updateCharacterName(player, characterName) {
        if (window.hudSystem) {
            window.hudSystem.updateCharacterName(player, characterName);
        }
    }

    /**
     * Reset health bars to full
     */
    static resetHealth() {
        if (window.hudSystem) {
            window.hudSystem.resetHealth();
        }
    }

    /**
     * Start countdown timer
     * @param {number} duration - Timer duration in seconds
     * @param {Function} onComplete - Callback when timer reaches 0
     * @returns {number} Timer interval ID
     */
    static startTimer(duration = 99, onComplete) {
        if (window.hudSystem) {
            return window.hudSystem.startTimer(duration, onComplete);
        }
        return null;
    }
}

// Example usage:
// import { HUD } from './hudHelper.js';
// HUD.updateHealth(1, 75);
