'use strict';

import {Animator} from "./animation.js";
import {Player} from "./player.js";
import {Character} from "./character.js";
import {getCharacterData} from "./characterData.js";
import {DIRECTIONS} from "../engine/constants.js";

/**
 * Factory class that makes characters.
 *
 * @author Kassie Whitney
 * @author Roman Bureacov
 */
export class CharacterConfigurator {


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
    static attachAnimators(player, name) {
        let data = getCharacterData(name);

        console.log(data)
        
        let S = Player.states

        const animations = [
            {
                state: S.MOVE,
                facing: DIRECTIONS.RIGHT,
                frames: data.moveR,
                duration: data.moveDur,
                isLooping: true
            },
            {
                state: S.MOVE,
                facing: DIRECTIONS.LEFT,
                frames: data.moveR,
                isReversed: true,
                duration: data.moveDur,
                isLooping: true
            },
            {
                state: S.IDLE,
                facing: DIRECTIONS.RIGHT,
                frames: data.idleR,
                duration: data.idleDur,
                isLooping: true
            },
            {
                state: S.IDLE,
                facing: DIRECTIONS.LEFT,
                frames: data.idleR,
                isReversed: true,
                duration: data.idleDur,
                isLooping: true
            },
            {
                state: S.ATTACK,
                facing: DIRECTIONS.RIGHT,
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
                facing: DIRECTIONS.LEFT,
                frames: data.attackR,
                isReversed: true,
                duration: data.attackDur,
                callback: () => {
                    player.attackHitbox.enabled = false;
                    player.stateLock = false;
                    player.state = player.lastState;
                }

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
