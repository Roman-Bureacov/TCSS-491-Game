'use strict';

import {Animator, Spritesheet} from "./animation.js";
import {Player} from "./player.js";
import {AssetManager} from "../assets/assetmanager.js";
import {Character} from "./character.js";
import {getCharacterData} from "./characterData.js";

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
        guy: "guy1",
        guy2: "guy2",
        warriorWoman: "WarriorWoman",
    })


    constructor() {
        throw new Error("Cannot instantiate factory (anti-pattern)");
    }


    static configurePlayer(player, name) {
        let data = getCharacterData(name);

        const animations = [
            {
                state: Player.states.MOVE,
                facing: Character.DIRECTION.RIGHT,
                frames: data.moveR,
                duration: data.moveDur,
                isLooping: true
            },
            {
                state: Player.states.MOVE,
                facing: Character.DIRECTION.LEFT,
                frames: data.moveL,
                duration: data.moveDur,
                isLooping: true
            },
            {
                state: Player.states.IDLE,
                facing: Character.DIRECTION.RIGHT,
                frames: data.idleR,
                duration: data.idleDur,
                isLooping: true
            },
            {
                state: Player.states.IDLE,
                facing: Character.DIRECTION.LEFT,
                frames: data.idleL,
                duration: data.idleDur,
                isLooping: true
            },
            {
                state: Player.states.ATTACK,
                facing: Character.DIRECTION.RIGHT,
                frames: data.attackR,
                duration: data.attackDur,
                callback: () => {
                    player.stateLock = false;
                    player.state = player.lastState;
                }
            },
            {
                state: Player.states.ATTACK,
                facing: Character.DIRECTION.LEFT,
                frames: data.attackL,
                duration: data.attackDur,
                callback: () => {
                    player.stateLock = false;
                    player.state = player.lastState;
                }
            }
        ];

        // compileAnimators but applied to THIS player
        for (let prop of animations) {
            player.animations[Player.buildAnimationName(prop.state, prop.facing)] = new Animator(
                prop.frames,
                prop.duration,
                prop.isReversed ?? false,
                prop.soundMap,
                prop.isLooping ?? false,
                prop.callback
            );
        }

        player.currentAnimation = player.animations[player.animationName()];
        return player;

    }

    /**
     * Constructs a character.
     *
     * @param {string} name the character name
     * @param {GameEngine} [game=undefined] the game this character will live in.
     * If undefined, the character constructed will have an undefined game.
     * @return {Player} a build character fresh off the line
     * @deprecated
     */
    static makePlayer(name, game = undefined) {

        let character;
        let spritesheet = undefined;

        switch (name) {
            case CharacterFactory.names.guy:
                spritesheet = new Spritesheet(
                    AssetManager.getAsset("character/guy1/Guy.png"),
                    3, 14
                );
                character = makeGuy(game, name, spritesheet, 1, 2)
                break;
            case CharacterFactory.names.guy2:
                // TODO: make guy2
                spritesheet = new Spritesheet(
                    AssetManager.getAsset("character/guy2/Guy2.png"),
                    3, 14
                );
                character = makeGuy(game, name, spritesheet, 1, 2);
                break;
            case CharacterFactory.names.warriorWoman:
                // TODO: make warrior woman
                break;
            default:
                throw new Error("Unknown character name: " + name);

        }


        character.currentAnimation = character.animations[character.animationName()];
        return character;
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
 * collection of constants for characters to use in their animators
 * @type {Object}
 */
const PlayerConstants = Object.freeze({
    attack: {
        duration: 0.5,
        callback: (player) => () => {
            player.stateLock = false;
            player.state = player.lastState;
        }
    },
})

/**
 * Creates the guy
 * @param {string} playerName The name of the player
 * @param {GameEngine} game the game engine
 * @param {string} name the name of the character.
 * @param {Spritesheet} spritesheet the spritesheet
 * @param {number} dimX the dimension in X
 * @param {number} dimY the dimension in Y
 * @return {Player} the constructed player character
 * @deprecated
 */
const makeGuy = (game, name, spritesheet, dimX, dimY) => {


    let character = new Player(game, spritesheet, dimX, dimY);

    let animations = [
        {
            state: Player.states.MOVE,
            facing: Character.DIRECTION.RIGHT,
            frames: getCharacterData(name).moveR,
            duration: getCharacterData(name).moveDur,
            isLooping: true
        },
        {
            state: Player.states.MOVE,
            facing: Character.DIRECTION.LEFT,
            frames: getCharacterData(name).moveL,
            duration: getCharacterData(name).moveDur,
            isLooping: true
        },
        {
            state: Player.states.IDLE,
            facing: Character.DIRECTION.RIGHT,
            frames: getCharacterData(name).idleR,
            duration: getCharacterData(name).idleDur,
            isLooping: true
        },
        {
            state: Player.states.IDLE,
            facing: Character.DIRECTION.LEFT,
            frames: getCharacterData(name).idleL,
            duration: getCharacterData(name).idleDur,
            isLooping: true
        },
        {
            state: Player.states.ATTACK,
            facing: Character.DIRECTION.RIGHT,
            frames: getCharacterData(name).attackR,
            duration: getCharacterData(name).attackDur,
            callback: PlayerConstants.attack.callback
        },
        {
            state: Player.states.ATTACK,
            facing: Character.DIRECTION.LEFT,
            frames: getCharacterData(name).attackL,
            duration: getCharacterData(name).attackDur,
            callback: PlayerConstants.attack.callback
        }
    ];

    compileAnimators(character, animations);
    return character;
}
