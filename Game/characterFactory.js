'use strict';

import {getCharacterData} from "./characterData.js";
import {Animator, Spritesheet} from "./animation.js";
import {Player} from "./player.js";
import {AssetManager} from "./assets/assetmanager.js";
import {Character} from "./character.js";

/**
 * Factory class that makes characters.
 *
 * @author Kassie Whitney
 * @author Roman Bureacov
 */
export class CharacterFactory {

    /**
     * The mapping of character names.
     * @type {Readonly<string: string>}
     */
    static names = Object.freeze({
        guy : "guy",
        guy2 : "guy2",
        warriorWoman : "WarriorWoman",
    })


    constructor(characterName, assetManager) {
        this.data = getCharacterData(characterName);

        const path = "./assets/" + this.data.img;

        console.log(path);

        const img = assetManager.getAsset(path);
        console.log(img);
        this.spritesheet = new Spritesheet(img, this.data.numRow, this.data.numCol);

    }

    /**
     * Constructs a character.
     *
     * @param {string} name the character name
     * @param {GameEngine} [game=undefined] the game this character will live in.
     * If undefined the character constructed will have an undefined game.
     * @return {Player} a build character fresh off the line
     */
    static makePlayer(name, game=undefined) {

        let character;
        let spritesheet = undefined;

        console.log(name, CharacterFactory.names.guy)

        switch (name) {
            case CharacterFactory.names.guy:
                spritesheet = new Spritesheet(
                    AssetManager.getAsset("character/guy1/Guy.png"),
                    3, 14
                );
                character = makeGuy(game, spritesheet, 1, 2)
                break;
            case CharacterFactory.names.guy2:
                // TODO: make guy2
                break;
            case CharacterFactory.names.warriorWoman:
                // TODO: make warrior woman
                break;
            default:
                throw new Error("Unknown character name: "  + name);

        }


        character.currentAnimation = character.animations[character.animationName()];
        return character;
    }


    /**
     * Retrieves the characters spritesheet component as a new spritesheet object.
     * @returns {Spritesheet}
     */
    getCharacterSpriteSheet() {
        return this.spritesheet;
    }

    /**
     * Gets the Character data from CharacterData.js
     * @returns {*}
     */
    getCharacter() {
        return this.data;
    }


}

/// character classes
/// below, only the animators are constructed, the setting of the animation is done up in the make


/**
 * Creates the guy
 * @param {GameEngine} game the game engine
 * @param {Spritesheet} spritesheet the spritesheet
 * @param {number} dimX the dimension in X
 * @param {number} dimY the dimension in Y
 * @return {Player} the constructed player character
 */
const makeGuy = (game, spritesheet, dimX, dimY) => {
    let guy = new Player(game, spritesheet, dimX, dimY);

    guy.animations = {
        [Player.states.MOVE + Character.DIRECTION.RIGHT]: new Animator(
            spritesheet,
            [[1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5]],
            1),
        [Player.states.MOVE + Character.DIRECTION.LEFT]: new Animator(
            spritesheet,
            [[1, 13], [1, 12], [1, 11], [1, 10], [1, 9], [1, 8]],
            1),

        [Player.states.IDLE + Character.DIRECTION.RIGHT]: new Animator(
            spritesheet,
            [[0, 0]],
            1
        ),
        [Player.states.IDLE + Character.DIRECTION.LEFT]: new Animator(
            spritesheet,
            [[0, 0]],
            1,
            true
        ),
        [Player.states.ATTACK + Character.DIRECTION.RIGHT]: new Animator(
            spritesheet,
            [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6]],
            0.5,
            false,
            undefined,
            false,
            () => {
                guy.stateLock = false;
                guy.state = guy.lastState;
                guy.facing = Character.DIRECTION.RIGHT;
            }
        ),
        [Player.states.ATTACK + Character.DIRECTION.LEFT]: new Animator(
            spritesheet,
            [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6]],
            0.5,
            true,
            undefined,
            false,
            () => {
                guy.stateLock = false;
                guy.state = guy.lastState;
                guy.facing = Character.DIRECTION.LEFT;
            }
        ),
    };

    return guy;
}
