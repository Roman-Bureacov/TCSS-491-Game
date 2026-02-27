import {Spritesheet} from "../animation.js";
import {getCharacterData} from "../characterData.js";
import {AssetManager} from "../../assets/assetmanager.js";
import {CharacterConfigurator} from "../characterConfigurator.js";
import {PlayerOne} from "./playerOne.js";
import {PlayerTwo} from "./playerTwo.js";
import {DIRECTIONS} from "../../engine/constants.js";

/**
 * A factory for creating players
 *
 * @author Roman Bureacov
 */
export class PlayerFactory {

    /**
     * The possible players
     * 
     * @readonly
     * @enum {string}
     */
    static PLAYER_TYPES = Object.freeze({
        ONE : "one",
        TWO : "two",
    });

    constructor() {
        throw new Error("Cannot instantiate factory (anti-pattern)");
    }

    /**
     * Constructs a player character
     * @param {CHARACTER_NAMES} name the name of the character of the player
     * @param {PlayerFactory.PLAYER_TYPES} type what type of player this is
     * @param {GameEngine} game the game engine the player will use
     * @param {number} initX the initial X
     * @param {number} initY the initial Y
     * @param {number} dimX the dimension in the X
     * @param {number} dimY the dimension in the Y
     */
    static makePlayer(name, type, game,
                      initX, initY,
                      dimX, dimY) {

        const spritesheet =
            new Spritesheet(
                AssetManager.getAsset(
                    getCharacterData(name).img),
                    getCharacterData(name).numRow,
                    getCharacterData(name).numCol
            );

        let player;

        // instantiate the player class...
        switch (type) {
            case this.PLAYER_TYPES.ONE:
                player = new PlayerOne(
                    game, spritesheet,
                    initX, initY,
                    dimX, dimY
                );
                player.facing = DIRECTIONS.RIGHT;
                break;
            case this.PLAYER_TYPES.TWO:
                player = new PlayerTwo(
                    game, spritesheet,
                    initX, initY,
                    dimX, dimY
                );
                player.facing = DIRECTIONS.LEFT;
                break;
            default:
                throw new Error(`Unknown player type ${type}`)
        }

        // then call the configurator on it
        // (formerly CharacterFactory)
        player.name = name;
        CharacterConfigurator.attachAnimators(player, name);
        CharacterConfigurator.attachSoundFX(player, name);
        return player;

    }
}