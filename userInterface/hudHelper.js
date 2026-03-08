/**
 * HUD Helper Module
 * Provides simple functions to update the HUD from game code
 */
import MenuSystem from "./menu.js";

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
     * Update player posture
     * @param {number} player - Player number (1 or 2)
     * @param {number} delta - Posture value (0 - 100)
     */
    static updatePosture(player, delta) {
        if (window.hudSystem) {
            window.hudSystem.updatePosture(player, delta);
        }
    }

    /**
     * Update the number stocks left.
     * @param {number} player - Player number (1 or 2)
     * @param {number} life - stock value (0-2)
     */
    static removeLifeStock(player, life) {
        if(window.hudSystem) {
            window.hudSystem.removeStock(player, life);
        }
    }

    /**
     * Resets the stock to 3
     *
     * @param {number} player The player id 1 or 2
     */
    static resetLifeStock(player) {
        if(window.hudSystem) {
            window.hudSystem.resetStocks(player);
        }
    }


    static resetTimer() {
        if (window.hudSystem) {
            window.hudSystem.resetTimer();
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

    static stopTimer() {
        if (window.hudSystem) {
            return window.hudSystem.stopTimer()
        }
        return null;
    }

    static newGame() {
        if (window.menuSystem) {
            window.menuSystem.returnToMenu();
        }
    }
}