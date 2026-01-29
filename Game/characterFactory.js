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
     * @return {Character} a build character fresh off the line
     */
    static make(name, game=undefined) {

        let character;
        let spritesheet = undefined;
        let dimX = 1;
        let dimY = 1;

        console.log(name, CharacterFactory.names.guy)

        switch (name) {
            case CharacterFactory.names.guy:
                spritesheet = new Spritesheet(
                    AssetManager.getAsset("character/guy1/Guy.png"),
                    3, 14
                );
                character = new Player(game, spritesheet, dimX, dimY)
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

class _Guy extends Player {

    /**
     * Creates the guy
     * @param {GameEngine} game the game engine
     * @param {Spritesheet} spritesheet the spritesheet
     */
    constructor(game, spritesheet) {
        super(game, spritesheet);

        this.animations = {
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
                    this.stateLock = false;
                    this.state = this.lastState;
                    this.facing = Character.DIRECTION.RIGHT;
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
                    this.stateLock = false;
                    this.state = this.lastState;
                    this.facing = Character.DIRECTION.LEFT;
                }
            ),
        };
    }
}