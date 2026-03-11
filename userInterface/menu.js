// Menu and HUD Management System
import {launchGame} from "../Game/gamelauncher.js";
import {CHARACTER_NAMES} from "../Game/entity/characterData.js";
import {ArenaFactory} from "../Game/arena/arenaFactory.js";
import {GameState} from "../Game/engine/gamestates.js";
import {HUD} from "./hudHelper.js";
import {PropertyChangeListener} from "../lib/propertychangesupport.js";
import {Player} from "../Game/entity/player.js";


const CHARACTERS = {
    [CHARACTER_NAMES.GUY]: 'Warrior',
    [CHARACTER_NAMES.GUY2]: 'Warrior2',
    [CHARACTER_NAMES.WARRIOR_WOMAN]: 'Valkyrie',
    [CHARACTER_NAMES.SAMURAI_A]: 'Samurai1',
    [CHARACTER_NAMES.SAMURAI_B]: 'Samurai2',
    [CHARACTER_NAMES.MONK]: 'Monk',
    [CHARACTER_NAMES.MINOTAUR]: 'Minotaur',
    [CHARACTER_NAMES.MAGE]: 'Mage',
    [CHARACTER_NAMES.GANGSTER]: 'Gangster',
    [CHARACTER_NAMES.KNIGHT]: 'Knight',
    [CHARACTER_NAMES.SKELETON]: 'Skeleton',

};

/**
 *
 * @implements {PropertyChangeListener}
 * @author Parker Nelson
 */
export class MenuSystem {


    /**
     * @type {PropertyChangeListener}
     */
    playerOneListener = {
        notify(prop, then, now) {
            switch (prop) {
                case Player.PROPERTIES.HEALTH:
                    HUD.updateHealth(1, now);
                    break;
                case Player.PROPERTIES.DIED:
                    HUD.updateHealth(1, now);
                    break;
                case Player.PROPERTIES.POSTURE:
                    HUD.updatePosture(1, now)
                    break;
                case Player.PROPERTIES.SOULS:
                    HUD.removeLifeStock(1, now);
                    break;
            }
        }
    }

    /**
     * @type {PropertyChangeListener}
     */
    playerTwoListener = {
        notify(prop, then, now) {
            switch (prop) {
                case Player.PROPERTIES.HEALTH:
                    HUD.updateHealth(2, now);
                    break;
                case Player.PROPERTIES.DIED:
                    HUD.updateHealth(2, now);
                    break;
                case Player.PROPERTIES.POSTURE:
                    HUD.updatePosture(2, now)
                    break;
                case Player.PROPERTIES.SOULS:
                    HUD.removeLifeStock(2, now);
                    break;
            }
        }
    }

    constructor() {
        this.gameCanvas = document.querySelector('#gameWorld');
        this.currentGameState = null;

        this.selectedCharacters = {
            player1: null,
            player2: null
        };
        this.selectedArena = ArenaFactory.ARENAS.ARENA1;
        this.initializeMenu();


    }

    initializeMenu() {
        // Character selection
        document.querySelectorAll('.character-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const button = e.currentTarget;
                const player = button.dataset.player;
                const character = button.dataset.character;

                // Remove selected class from other buttons for this player
                document.querySelectorAll(`[data-player="${player}"]`).forEach(b => {
                    b.classList.remove('selected');
                });

                // Add selected class to clicked button
                button.classList.add('selected');

                // Update selected character
                this.selectedCharacters[`player${player}`] = character;

                // Update display
                const displayElement = document.getElementById(`p${player}Selected`);

                displayElement.textContent = CHARACTERS[character];

                // Check if we can enable the start button
                this.updateStartButton();
            });
        });

        // Arena selection
        document.querySelectorAll('.arena-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const button = e.currentTarget;
                const arena = button.dataset.arena;
                console.log(button.dataset)

                // Remove selected class from all arena buttons
                document.querySelectorAll('.arena-btn').forEach(b => {
                    b.classList.remove('selected');
                });

                // Add selected class to clicked button
                button.classList.add('selected');

                // Update selected arena
                this.selectedArena = arena;
            });
        });

        // Start game button
        document.getElementById('startGameBtn').addEventListener('click', () => {
            this.startGame();
        });

        // Instructions overlay
        document.getElementById('instructionsBtn').addEventListener('click', () => {
            document.getElementById('instructionsOverlay').classList.remove('hidden');
        });

        document.getElementById('closeInstructionsBtn').addEventListener('click', () => {
            document.getElementById('instructionsOverlay').classList.add('hidden');
        });

        document.getElementById('newGameBtn').addEventListener('click', () => {
            this.returnToMenu();
        })
    }

    updateStartButton() {
        const startBtn = document.getElementById('startGameBtn');
        startBtn.disabled = !(this.selectedCharacters.player1 && this.selectedCharacters.player2);
    }

    startGame() {

        // Hide menu, show game
        document.getElementById('mainMenu').classList.add('hidden');
        document.getElementById('gameScreen').classList.remove('hidden');

        const player1 = document.querySelector(".player-1-name");
        const player2 = document.querySelector(".player-2-name");
        player1.textContent = CHARACTERS[this.selectedCharacters.player1];
        player2.textContent = CHARACTERS[this.selectedCharacters.player2];


        // Initialize the game with selected options
        window.gameConfig = {
            character1: this.selectedCharacters.player1,
            character2: this.selectedCharacters.player2,
            arena: this.selectedArena
        };

        launchGame({
            playerOneCharacter: this.selectedCharacters.player1,
            playerTwoCharacter: this.selectedCharacters.player2,
            arenaName: this.selectedArena,
            canvas: this.gameCanvas,
        }).then((gameState) => {

            this.currentGameState = gameState;

            HUD.startTimer(180, function () {
                gameState.endGame();
            })

            // listen to game state
            gameState.addPropertyListener(GameState.PROPERTIES.GAME_OVER, this)
            gameState.addPropertyListener(GameState.PROPERTIES.PAUSE_GAME, this)
            gameState.addPropertyListener(GameState.PROPERTIES.RESUME_GAME, this)

            // listen to players
            gameState.playerOne.addPropertyListener(
                Player.PROPERTIES.HEALTH,
                this.playerOneListener
            );
            gameState.playerOne.addPropertyListener(
                Player.PROPERTIES.SOULS,
                this.playerOneListener
            );
            gameState.playerOne.addPropertyListener(
                Player.PROPERTIES.POSTURE,
                this.playerOneListener
            );

            gameState.playerTwo.addPropertyListener(
                Player.PROPERTIES.HEALTH,
                this.playerTwoListener
            );
            gameState.playerTwo.addPropertyListener(
                Player.PROPERTIES.SOULS,
                this.playerTwoListener
            );
            gameState.playerTwo.addPropertyListener(
                Player.PROPERTIES.POSTURE,
                this.playerTwoListener
            );


            window.GAMESTATE = gameState;

            requestAnimationFrame(() => {
                this.gameCanvas.focus();
            })
        });

    }

    returnToMenu() {
        HUD.stopTimer();

        if (this.currentGameState) {
            try {
                this.currentGameState.endGame();
            } catch (evt) {
                console.warn("Could not end game cleanly", evt);
            }
            this.currentGameState = null;
        }

        document.getElementById('gameScreen').classList.add('hidden');
        document.getElementById('mainMenu').classList.remove('hidden');
        document.getElementById('gameOverScreenOverlay').classList.add('hidden');

        this.resetMenu();

        HUD.resetHealth();
        HUD.updatePosture(1, 0);
        HUD.updatePosture(2, 0);
        HUD.resetLifeStock(1);
        HUD.resetLifeStock(2);
        HUD.resetTimer();


    }

    resetMenu() {
        this.selectedCharacters = {
            player1: null,
            player2: null
        };

        this.selectedArena = ArenaFactory.ARENAS.ARENA1;

        document.querySelectorAll('.character-btn').forEach(btn => {
            btn.classList.remove('selected');
        });

        document.querySelectorAll('.arena-btn').forEach(btn => {
            btn.classList.remove('selected');
        });

        const defaultArenaBtn = document.querySelector('[data-arena="arena1"]');
        if (defaultArenaBtn) {
            defaultArenaBtn.classList.add('selected');

            document.getElementById('p1Selected').textContent = 'Select Character';
            document.getElementById('p2Selected').textContent = 'Select Character';

            document.getElementById('startGameBtn').disabled = true;
        }
    }

    notify(prop, then, now) {
        switch (prop) {
            case GameState.PROPERTIES.GAME_OVER:
                console.log("Game Over, player died");
                document.getElementById('gameOverScreenOverlay').classList.remove('hidden');
                const winnersName = document.querySelector('.winnersName');
                winnersName.textContent = now;
                break;
            case GameState.PROPERTIES.PAUSE_GAME:
                console.log("Game was paused");
                break;
            case GameState.PROPERTIES.RESUME_GAME:
                console.log("Game was resumed");
                break;
        }
    }
}

// HUD Management System
export class HUDSystem {
    constructor() {
        this.maxHealth = 100;
        this.maxPosture = 100;
        this.maxStocks = 3;
        this.timer = 180;
        this.maxTime = 180;
        this.timerIntervalId = null;
    }

    updatePosture(player, postureNow) {
        const posture = Math.max(0, Math.min(this.maxPosture, postureNow));

        if (player === 1) {
            this.updatePostureBar('p1', posture);
        } else if (player === 2) {
            this.updatePostureBar('p2', posture);
        }
    }

    updateHealth(player, health) {
        const healthPercentage = Math.max(0, Math.min(this.maxHealth, health));

        if (player === 1) {
            this.updateHealthBar('p1', healthPercentage);
        } else if (player === 2) {
            this.updateHealthBar('p2', healthPercentage);
        }
    }

    /**
     * removes the stock
     * @param {Number} player The player id [1 | 2]
     * @param {Number} life The number of life left
     */
    removeStock(player, life) {
        const stocks = Math.max(0, Math.min(this.maxStocks, life));

        if (player === 1) {
            this.updateStockNumber('p1', stocks);
        } else if (player === 2) {
            this.updateStockNumber('p2', stocks);
        }
    }

    updateStockNumber(playerPrefix, life) {
        // This removes the life as 2,1,0. The stocks are 0 indexed.
        document.getElementById(`${playerPrefix}Life${life}`).style.display = "none";
    }


    /**
     * Resets the stocks back to default
     * @param {Number} player The player id [1 | 2]
     */
    resetStocks(player) {
        const playerPrefix = player === 1 ? 'p1' : 'p2';

        for (let i = 0; i <= 2; i++) {
            const el = document.getElementById(`${playerPrefix}Life${i}`);
            if (el) el.style.display = "";
        }
    }


    updatePostureBar(playerPrefix, posture) {
        const bar = document.getElementById(`${playerPrefix}Posture`);
        const txt = document.getElementById(`${playerPrefix}PostureText`);
        if (!bar) return;

        bar.style.width = `${posture}%`;

        if (txt) txt.textContent = `Posture: ${Math.round(posture)}%`;

        bar.classList.remove('high', 'critical');
        if (posture >= 85) bar.classList.add('critical');
        else if (posture >= 50) bar.classList.add('high');
    }

    updateHealthBar(playerPrefix, health) {
        const healthBar = document.getElementById(`${playerPrefix}Health`);


        if (healthBar) {
            healthBar.style.width = `${health}%`;

            // Update color based on health
            healthBar.classList.remove('low', 'critical');
            if (health <= 25) {
                healthBar.classList.add('critical');
            } else if (health <= 50) {
                healthBar.classList.add('low');
            }
        }
    }

    updateTimer(seconds) {
        this.timer = seconds;
        const timerElement = document.getElementById('gameTimer');
        if (timerElement) {
            timerElement.textContent = seconds;
        }
    }

    resetTimer() {
        const timerElement = document.getElementById('gameTimer');

        if (timerElement) {
            timerElement.textContent = this.maxTime;
        }
    }

    resetHealth() {
        this.updateHealth(1, 100);
        this.updateHealth(2, 100);
    }

    startTimer(duration = 99, onComplete) {
        // stop an existing timer first (prevents multiple intervals)
        this.stopTimer();

        this.timer = duration;
        this.updateTimer(this.timer);

        this.timerIntervalId = window.setInterval(() => {
            this.timer--;
            this.updateTimer(this.timer);

            if (this.timer <= 0) {
                this.stopTimer();
                if (onComplete) onComplete();
            }
        }, 1000);

        return this.timerIntervalId;
    }

    stopTimer() {
        if (this.timerIntervalId !== null) {
            window.clearInterval(this.timerIntervalId);
            this.timerIntervalId = null;
        }
    }
}

// Initialize menu when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.menuSystem = new MenuSystem();
    window.hudSystem = new HUDSystem();
});

// Make systems available globally
export {MenuSystem as default};