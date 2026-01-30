'use strict';

import {getCharacterData} from "./characterData.js";
import {Animator, Spritesheet} from "./animation.js";
import {Player, PlayerStates} from "./player.js";
import {AssetManager} from "../assets/assetmanager.js";
import {Character, CharacterDirections} from "./character.js";

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

/**
 * @typedef {Object} AnimatorProp
 * @property {string} state the player state of this animator property
 * @property {string} facing the direction of this animator property
 * @property {Array<[number, number]>} frames the frames for the animator
 * @property {number} duration the total duration of the animation in seconds
 * @property {boolean} [isReversed] if the animation frame should be reversed
 * @property {{[key: number]: Audio}} [soundMap] the mapping of frame numbers to audio playback
 * @property {boolean} [isLooping] if the animation should loop
 * @property {(player: Character) => (() => void)} [callback] the callback if the animation is not looping and has finished
 */

/**
 * Compiles and creates the animators for the character
 * @param {Character} character the character to compile animators into
 * @param {AnimatorProp[]} properties the properties of every animator for the character
 */
const compileAnimators = (character, properties) => {
    for (let prop of properties) {
        character.animations[Player.buildAnimationName(prop.state, prop.facing)] = new Animator(
            prop.frames,
            prop.duration,
            prop.isReversed ?? false,
            prop.soundMap,
            prop.isLooping ?? false,
            prop.callback?.(character)
        );
    }

    character.currentAnimation = character.animations[character.animationName()];
}


/// character classes

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

    let animations = [
        {
            state: Player.states.MOVE,
            facing: Character.DIRECTION.RIGHT,
            frames: [[1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5]],
            duration: 1
        },
        {
            state: Player.states.MOVE,
            facing: Character.DIRECTION.LEFT,
            frames: [[1, 13], [1, 12], [1, 11], [1, 10], [1, 9], [1, 8]],
            duration: 1
        },
        {
            state: Player.states.IDLE,
            facing: Character.DIRECTION.RIGHT,
            frames: [[0, 0]],
            duration: 1
        },
        {
            state: Player.states.IDLE,
            facing: Character.DIRECTION.LEFT,
            frames: [[0, 0]],
            duration: 1,
            isReversed: true
        },
        {
            state: Player.states.ATTACK,
            facing: Character.DIRECTION.RIGHT,
            frames: [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6]],
            duration: 0.5,
            callback : (player) => () => {
                player.stateLock = false;
                player.state = player.lastState;
            },
        },
        {
            state: Player.states.ATTACK,
            facing: Character.DIRECTION.LEFT,
            frames: [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6]],
            duration: 0.5,
            isReversed: true,
            callback : (player) => () => {
                player.stateLock = false;
                player.state = player.lastState;
            },
        }
    ];

    compileAnimators(guy, animations);
    return guy;
}
