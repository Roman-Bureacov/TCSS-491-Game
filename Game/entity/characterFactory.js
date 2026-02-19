'use strict';

import {Animator} from "./animation.js";
import {Player} from "./player.js";
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
        warriorWoman: "warriorWoman",
        samurai1: "samurai1",
        samurai2: "samurai2"
    })


    constructor() {
        throw new Error("Cannot instantiate factory (anti-pattern)");
    }


    /**
     * configures the characters animation and moving
     * @param {Player} player The player object
     * @param name The name of the character.
     *
     * @author Kassie Whitney
     */
    static configurePlayer(player, name) {
        let data = getCharacterData(name);

        console.log(data)
        
        let S = player.constructor.states

        const animations = [
            {
                state: S.MOVE,
                facing: Character.DIRECTION.RIGHT,
                frames: data.moveR,
                duration: data.moveDur,
                isLooping: true
            },
            {
                state: S.MOVE,
                facing: Character.DIRECTION.LEFT,
                frames: data.moveR,
                isReversed: true,
                duration: data.moveDur,
                isLooping: true
            },
            {
                state: S.IDLE,
                facing: Character.DIRECTION.RIGHT,
                frames: data.idleR,
                duration: data.idleDur,
                isLooping: true
            },
            {
                state: S.IDLE,
                facing: Character.DIRECTION.LEFT,
                frames: data.idleR,
                isReversed: true,
                duration: data.idleDur,
                isLooping: true
            },
            {
                state: S.ATTACK,
                facing: Character.DIRECTION.RIGHT,
                frames: data.attackR,
                duration: data.attackDur,
                callback: () => {
                    player.attackHitbox.enabled = false;
                    player.stateLock = false;
                    player.state = player.lastState;
                }

            },
            {
                state: S.ATTACK,
                facing: Character.DIRECTION.LEFT,
                frames: data.attackR,
                isReversed: true,
                duration: data.attackDur,
                callback: () => {
                    player.attackHitbox.enabled = false;
                    player.stateLock = false;
                    player.state = player.lastState;
                }

            },
            {
                state : S.JUMP,
                facing: Character.DIRECTION.LEFT,
                frames: data.jumpR,
                isReversed: true,
                duration: 1,

            },
            {
                state : S.JUMP,
                facing: Character.DIRECTION.RIGHT,
                frames: data.jumpR,
                isReversed: false,
                duration: 1,

            },
            {
                state:S.DEAD,
                facing: Character.DIRECTION.RIGHT,
                frames:data.deadR,
                duration: 1,
            },
            {
                state:S.DEAD,
                facing: Character.DIRECTION.LEFT,
                frames:data.deadR,
                isReversed: true,
                duration: 1,
            }
        ];

        // compileAnimators but applied to THIS player
        for (let prop of animations) {
            player.animations[Character.buildAnimationName(prop.state, prop.facing)] = new Animator(
                prop.frames,
                prop.duration,
                prop.isReversed ?? false,
                prop.soundMap,
                prop.isLooping ?? false,
                prop.callback
            );
        }

        player.currentAnimation = player.animations[player.animationName()];

    }
}
