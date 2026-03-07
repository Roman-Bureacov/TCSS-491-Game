'use strict';

import {Animator} from "./animation.js";
import {Player} from "./player.js";
import {Character} from "./character.js";
import {ANIMATOR_CONSTANTS, getCharacterData} from "./characterData.js";
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

        const animations = [];
        
        for (const [state, anim] of Object.entries(data.animation)) {
            // note: !undefined resolves to true
            const dataRight = {
                state: state,
                facing: DIRECTIONS.RIGHT,
                frames: anim[DIRECTIONS.RIGHT] ?? anim[DIRECTIONS.LEFT],
                duration: anim.duration,
                isReversed: (!anim[DIRECTIONS.RIGHT]), // if the right is undefined, reverse
                isLooping: true,
            }
            const dataLeft = {
                state: state,
                facing: DIRECTIONS.LEFT,
                frames: anim[DIRECTIONS.LEFT] ?? anim[DIRECTIONS.RIGHT],
                duration: anim.duration,
                isReversed: (!anim[DIRECTIONS.LEFT]), // if the left is undefined, reverse
                isLooping: true,
            }

            switch (state) {
                case Player.states.ATTACK:
                    dataRight.callback = ANIMATOR_CONSTANTS.ATTACK_CALLBACK(player);
                    dataRight.isLooping = false;
                    dataLeft.callback = ANIMATOR_CONSTANTS.ATTACK_CALLBACK(player);
                    dataLeft.isLooping = false;
                    break;
                case Player.states.BLOCK:
                    dataRight.callback = ANIMATOR_CONSTANTS.BLOCK_CALLBACK(player);
                    dataRight.isLooping = false;
                    dataLeft.callback = ANIMATOR_CONSTANTS.BLOCK_CALLBACK(player);
                    dataLeft.isLooping = false;
                    break;
                case Player.states.FINISHER:
                    dataRight.callback = ANIMATOR_CONSTANTS.FINISHER_CALLBACK(player);
                    dataRight.isLooping = false;
                    dataLeft.callback = ANIMATOR_CONSTANTS.FINISHER_CALLBACK(player);
                    dataLeft.isLooping = false;
                    break;
            }

            animations.push(dataRight);
            animations.push(dataLeft);
        }


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
