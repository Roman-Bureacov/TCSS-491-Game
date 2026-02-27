'use strict';

import {Animator} from "./animation.js";
import {Player} from "./player.js";
import {Character} from "./character.js";
import {getCharacterData} from "./characterData.js";
import {DIRECTIONS} from "../engine/constants.js";
import {SoundFX} from "../engine/soundFX.js";

/**
 * Configuration class that makes characters.
 *
 * @author Kassie Whitney
 * @author Roman Bureacov
 */
export class CharacterConfigurator {
    // formerly Character Factory

    constructor() {
        throw new Error("Cannot instantiate configurator (anti-pattern)");
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

            },
            {
                state : S.JUMP,
                facing: DIRECTIONS.LEFT,
                frames: data.jumpR,
                isReversed: true,
                duration: 1,

            },
            {
                state : S.JUMP,
                facing: DIRECTIONS.RIGHT,
                frames: data.jumpR,
                isReversed: false,
                duration: 1,

            },
            {
                state:S.DEAD,
                facing: DIRECTIONS.RIGHT,
                frames:data.deadR,
                isReversed: false,
                duration: 1,
            },
            {
                state:S.DEAD,
                facing: DIRECTIONS.LEFT,
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

    /**
     * Attaches sound effects to the player
     * @param {Player} player the player to attach sound to
     * @param {string} name the name of the character
     */
    static attachSoundFX(player, name) {
        const dat = getCharacterData(name);

        const hitSound = (
            dat.gender === "male"
        ) ? `maleHurt` : `femaleHurt`;

        const deadSound = (
            dat.gender === "male"
        ) ? `maleDeath` : `femaleDeath`;

        player.soundEvents.playHitSound = () => {
            let rnd_int = Math.floor(Math.random() * 5) + 1;
            SoundFX.play(`${hitSound}${rnd_int}`)
        }

        player.soundEvents.playDeadSound = () => {
            let rnd_int = Math.floor(Math.random() * 5) + 1;
            SoundFX.play(`${deadSound}${rnd_int}`)
        }

        player.soundEvents.playSwingSound = () => {
            SoundFX.play(dat.swordSound);
        }
    }
}
