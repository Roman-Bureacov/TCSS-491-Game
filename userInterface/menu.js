// Menu and HUD Management System
import {launchGame} from "../Game/gamelauncher.js";
import {CHARACTER_NAMES} from "../Game/entity/characterData.js";
import {ArenaFactory} from "../Game/arena/arenaFactory.js";
import {GameEngine} from "../Game/engine/gameengine.js";
import {GameState} from "../Game/engine/render/gamestates.js";

export class MenuSystem {
    constructor() {
        this.gameCanvas = document.querySelector('#gameWorld');
        this.selectedCharacters = {
            player1: null,
            player2: null
        };
        this.selectedArena = ArenaFactory.ARENAS.BASIC;
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
                const characterNames = {
                    [CHARACTER_NAMES.GUY] : 'Warrior',
                    [CHARACTER_NAMES.GUY2]: 'Knight',
                    [CHARACTER_NAMES.WARRIOR_WOMAN]: 'Valkyrie',
                    [CHARACTER_NAMES.SAMURAI_A]: 'Samurai1',
                    [CHARACTER_NAMES.SAMURAI_B]: 'Samurai2',
                    [CHARACTER_NAMES.MONK]: 'Monk',
                    [CHARACTER_NAMES.MINOTAUR]: 'Minotaur',
                    [CHARACTER_NAMES.MAGE]: 'Mage',
                    [CHARACTER_NAMES.GANGSTER]: 'Gangster',
                    [CHARACTER_NAMES.NINJA]: 'Ninja',
                };
                displayElement.textContent = characterNames[character];

                // Check if we can enable start button
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
    }

    updateStartButton() {
        const startBtn = document.getElementById('startGameBtn');
        if (this.selectedCharacters.player1 && this.selectedCharacters.player2) {
            startBtn.disabled = false;
        } else {
            startBtn.disabled = true;
        }
    }

    startGame() {
        // Hide menu, show game
        document.getElementById('mainMenu').classList.add('hidden');
        document.getElementById('gameScreen').classList.remove('hidden');

        // Initialize the game with selected options
        window.gameConfig = {
            character1: this.selectedCharacters.player1,
            character2: this.selectedCharacters.player2,
            arena: this.selectedArena
        };

        const game = launchGame({
            playerOneCharacter: this.selectedCharacters.player1,
            playerTwoCharacter: this.selectedCharacters.player2,
            arenaName: this.selectedArena,
            canvas: this.gameCanvas,
        }).then((gameState) => {
            // TODO: the listener attached needs to be a concrete class
            //   (perhaps the `MenuSystem` itself implements `PropertyChangeListener`
            //   from `propertychangesupport.js`?)
            const logger = {
                notify(prop, then, now) {
                    switch (prop) {
                        case GameState.PROPERTIES.GAME_OVER:
                            console.log("Game Over, player died");
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
            window.GAMESTATE = gameState;

            gameState.addPropertyListener(GameState.PROPERTIES.GAME_OVER, logger)
            gameState.addPropertyListener(GameState.PROPERTIES.PAUSE_GAME, logger)
            gameState.addPropertyListener(GameState.PROPERTIES.RESUME_GAME, logger)
        });



        // Dispatch event to signal game should start
        // window.dispatchEvent(new CustomEvent('gameStart', {
        //     detail: window.gameConfig
        // }));
    }
}

// HUD Management System
export class HUDSystem {
    constructor() {
        this.maxHealth = 100;
        this.player1Health = 100;
        this.player2Health = 100;
        this.timer = 99;
        this.round = 1;
    }

    updateHealth(player, health) {
        const healthPercentage = Math.max(0, Math.min(100, health));

        if (player === 1) {
            this.player1Health = healthPercentage;
            this.updateHealthBar('p1', healthPercentage);
        } else if (player === 2) {
            this.player2Health = healthPercentage;
            this.updateHealthBar('p2', healthPercentage);
        }
    }

    updateHealthBar(playerPrefix, health) {
        const healthBar = document.getElementById(`${playerPrefix}Health`);
        const healthText = document.getElementById(`${playerPrefix}HealthText`);

        if (healthBar && healthText) {
            healthBar.style.width = `${health}%`;
            healthText.textContent = `${Math.round(health)}%`;

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

    updateRound(round) {
        this.round = round;
        const roundElement = document.getElementById('roundInfo');
        if (roundElement) {
            roundElement.textContent = `ROUND ${round}`;
        }
    }

    updateCharacterName(player, characterName) {
        const characterNames = { // TODO: this fragment is duplicated, maybe it could be simplified?
            [CHARACTER_NAMES.GUY] : 'Warrior',
            [CHARACTER_NAMES.GUY2]: 'Knight',
            [CHARACTER_NAMES.WARRIOR_WOMAN]: 'Valkyrie'
        };

        const displayName = characterNames[characterName] || characterName;
        const element = document.getElementById(`p${player}CharName`);
        if (element) {
            element.textContent = displayName;
        }
    }

    resetHealth() {
        this.updateHealth(1, 100);
        this.updateHealth(2, 100);
    }

    startTimer(duration = 99, onComplete) {
        this.timer = duration;
        this.updateTimer(this.timer);

        const timerInterval = setInterval(() => {
            this.timer--;
            this.updateTimer(this.timer);

            if (this.timer <= 0) {
                clearInterval(timerInterval);
                if (onComplete) onComplete();
            }
        }, 1000);

        return timerInterval;
    }
}

// Initialize menu when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.menuSystem = new MenuSystem();
    window.hudSystem = new HUDSystem();
});

// Make systems available globally
export { MenuSystem as default };