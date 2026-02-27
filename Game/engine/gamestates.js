/*

Here we hold an object that is the game state.

The purpose of this file is that we wish to have a game and a UI that both
run independently.

Because of this, however, someone needs to keep track of the game's meta rules
(two players, if one dies game is over, request a restart of the game).

The reason is we want to have the game engine merely run *some* game, but what
game is running it does not care exactly. The game engine merely provides the means
to actually run a game, whereas here the game state object offers to run a *specific*
game by enforcing rules and states.

The game engine is stateless, this game state is the thing that has state.

*/

import {PropertyChangeSupport} from "../../lib/propertychangesupport.js";
import {Player} from "../entity/player.js";

/**
 * A game state object, holding onto the state of the game in play.
 *
 * @see {GameState.PROPERTIES}
 *
 * @author Roman Bureacov
 * @implements {PropertyChangeNotifier}
 * @implements {PropertyChangeListener}
 */
export class GameState {
    /**
     * The properties one may listen to for the game state
     *
     * @readonly
     * @enum {string}
     */
    static PROPERTIES = Object.freeze({
        /** the game is over */
        GAME_OVER: "GameState.GAME_OVER",
        /** a new game has started */
        NEW_GAME: "GameState.NEW_GAME",
        /** the game has been paused */
        PAUSE_GAME: "GameState.PAUSE_GAME",
        /** the game has been resumed */
        RESUME_GAME: "GameState.RESUME_GAME",
    })

    /**
     * The game to take care of
     * @type {GameEngine}
     */
    game;

    /**
     * The canonical "player one"
     * @type {Player}
     */
    playerOne;

    /**
     * The canonical "player two"
     * @type {Player}
     */
    playerTwo;

    /**
     * The canonical arena
     * @type {ArenaProperties}
     */
    arena;

    /**
     * Creates a new game state object to handle the game and its state.
     *
     * @param {GameEngine} game the game to handle the state of
     * @param {Player} playerOne the canonical "player one" of the game
     * @param {Player} playerTwo the canonical "player two" of the game
     * @param {ArenaProperties} arena the arena for the game
     */
    constructor(game, playerOne, playerTwo, arena) {
        this.PCS = new PropertyChangeSupport();
        this.game = game;
        this.playerOne = playerOne;
        this.playerTwo = playerTwo;
        this.arena = arena;

        // set up listeners to handle state
        this.playerOne.addPropertyListener(Player.PROPERTIES.DIED, this);
        this.playerTwo.addPropertyListener(Player.PROPERTIES.DIED, this);

    }

    // modify game state

    /**
     * Pauses the game
     */
    pauseGame() {
        this.game.running = false;

        this.notifyListeners(GameState.PROPERTIES.PAUSE_GAME);
    }

    /**
     * Resumes the game
     */
    resumeGame() {
        this.game.running = true;

        new Promise(() => this.game.start())
            .catch((reason) => console.log("Something went wrong: ", reason));

        this.notifyListeners(GameState.PROPERTIES.RESUME_GAME);
    }

    /**
     * Starts a new game
     */
    newGame() {
        this.playerOne.setPosition(
            this.arena.playerAStart.x ?? -1,
            this.arena.playerAStart.y ?? 0
        );
        this.playerOne.reinit();

        this.playerTwo.setPosition(
            this.arena.playerBStart.x ?? 1,
            this.arena.playerBStart.y ?? 0
        );
        this.playerTwo.reinit();

        new Promise(() => this.game.start())
            .catch((reason) => console.log("Something went wrong: ", reason));

        this.notifyListeners(GameState.PROPERTIES.NEW_GAME);
    }

    /**
     * Ends the game
     */
    endGame() {
        this.game.running = false;

        this.notifyListeners(GameState.PROPERTIES.GAME_OVER);
    }

    // implemented behaviors

    notify(prop, then, now) {
        switch (prop) {
            case Player.PROPERTIES.DIED:
                this.endGame();
                break;
        }
    }

    addPropertyListener(prop, listener) {
        this.PCS.addPropertyListener(prop, listener);
    }

    notifyListeners(prop, then = undefined, now = undefined) {
        this.PCS.notifyListeners(prop, then, now);
    }

    removePropertyListener(prop, listener) {
        this.PCS.removePropertyListener(prop, listener);
    }
}