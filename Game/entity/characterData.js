'use strict';

import {Player} from "./player.js";
import {DIRECTIONS} from "../engine/constants.js";

/**
 * The possible character names
 * @readonly
 * @enum {string}
 */
export const CHARACTER_NAMES = Object.freeze({
    GUY: "guy1",
    GUY2: "guy2",
    WARRIOR_WOMAN: "warriorWoman",
    KNIGHT : "knight",
    SAMURAI_A: "samurai1",
    SAMURAI_B: "samurai2",
    SKELETON: "skeleton",
    MONK: "monk",
    MINOTAUR: "minotaur",
    GANGSTER: "gangster",
    MAGE: "mage",
    NINJA: "ninja",

})

/**
 * The collection of constants animators use
 */
export const ANIMATOR_CONSTANTS = Object.freeze({
    ATTACK_DURATION: 0.5,
    FINISHER_DURATION: 1,
    FINISHER_CALLBACK: (player) => () => {
        player.stateLock = false;
        player.state = player.lastState;
    },
    ATTACK_CALLBACK: (player) => () => {
        player.attackHitbox.enabled = false;
        player.stateLock = false;
        player.state = player.lastState;
    },
    STAGGER_DURATION: Player.CONSTANTS.STAGGER_TIMEOUT,
    BLOCK_DURATION: Player.CONSTANTS.BLOCKING.TIMEOUT,
    BLOCK_CALLBACK: (player) => () => {
        player.stateLock = false;
        player.state = player.lastState;
    },
})

/**
 * @typedef CharacterDatum
 * @property {{img: string, numRow: number, numCol: number}} spritesheet the spritesheet data
 * @property {Object.<Player.states : AnimatorProps>} animation
 * @property {string} swordSound
 * @property {string} gender
 */

/**
 * The animator properties. Any property defined must list at least one direction's worth of
 * frames, if not both.
 * @typedef AnimatorProps
 * @property {[number, number][]} [right] the possible frames on the right direction
 * @property {[number, number][]} [left] the possible frames on the left direction
 * @property {number} duration the duration of the animation
 */

/**
 *
 * @type {CHARACTER_NAMES : CharacterDatum}
 */
const CHARACTER_DATA = {
    /*
    NOTE THE FORMAT
    characters have the properties of a spritesheet specification, animations, and some extra details

    the animation details are a map of player states to frames for the respective sides
    and the duration of the animation. One or both of the animations should be specified:
    * if one side's animation is specified, then the animation for the other side copies the one sides
        animation and reverses it
    * if both animations are specified, then both animation frames will be used
    * if neither are specified, *there will be undefined behavior*

    Always specify one or both, never neither.
     */

    [CHARACTER_NAMES.GUY] : {
        spritesheet: {
            img: "character/guy1/Guy.png",
            numRow: 3,
            numCol: 14,
        },
        swordSound: "quickSwordSwoosh2",
        gender: "male",
        animation: {
            [Player.states.MOVE]: {
                [DIRECTIONS.RIGHT]: [[1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5]],
                [DIRECTIONS.LEFT]: [[1, 13], [1, 12], [1, 11], [1, 10], [1, 9], [1, 8]],
                duration: 1
            },
            [Player.states.IDLE]: {
                [DIRECTIONS.RIGHT]: [[0, 0]],
                [DIRECTIONS.LEFT]: [[0, 13]],
                duration: 1
            },
            [Player.states.ATTACK]: {
                [DIRECTIONS.RIGHT]: [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6]],
                [DIRECTIONS.LEFT]: [[2, 13], [2, 12], [2, 11], [2, 10], [2, 9], [2, 8], [2, 7]],
                duration: ANIMATOR_CONSTANTS.ATTACK_DURATION
            },
            [Player.states.JUMP]: {
                [DIRECTIONS.RIGHT]: [[0, 0]],
                duration: 1
            },

            [Player.states.BLOCK]: {
                [DIRECTIONS.RIGHT]: [[2, 0], [2, 1], [2, 2]],
                duration: ANIMATOR_CONSTANTS.BLOCK_DURATION
            },
            [Player.states.FINISHER]: {
                [DIRECTIONS.RIGHT]: [[2, 0], [2, 0], [2, 0], [2, 3], [2, 5]],
                duration: ANIMATOR_CONSTANTS.FINISHER_DURATION
            },

            [Player.states.STAGGERED]: {
                [DIRECTIONS.RIGHT]: [[0, 0]],
                duration:  ANIMATOR_CONSTANTS.STAGGER_DURATION
            },
            [Player.states.DEAD]: {
                [DIRECTIONS.RIGHT]: [[0, 0]],
                duration: 1
            }
        },
    },
    
    [CHARACTER_NAMES.GUY2]: {
        spritesheet: {
            img: "character/guy2/Guy2.png",
            numRow: 3,
            numCol: 14,
        },
        swordSound: "quickSwordSwoosh2",
        gender: "male",
        animation: {
            [Player.states.MOVE]: {
                [DIRECTIONS.RIGHT]: [[1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5]],
                [DIRECTIONS.LEFT]: [[1, 13], [1, 12], [1, 11], [1, 10], [1, 9], [1, 8]],
                duration: 1
            },
            [Player.states.IDLE]: {
                [DIRECTIONS.RIGHT]: [[0, 0]],
                [DIRECTIONS.LEFT]: [[0, 13]],
                duration: 1
            },
            [Player.states.ATTACK]: {
                [DIRECTIONS.RIGHT]: [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6]],
                [DIRECTIONS.LEFT]: [[2, 13], [2, 12], [2, 11], [2, 10], [2, 9], [2, 8], [2, 7]],
                duration: ANIMATOR_CONSTANTS.ATTACK_DURATION
            },
            [Player.states.JUMP]: {
                [DIRECTIONS.RIGHT]: [[0, 0]],
                duration: 1
            },
            [Player.states.BLOCK]: {
                [DIRECTIONS.RIGHT]: [[2, 0], [2, 1], [2, 2]],
                duration: ANIMATOR_CONSTANTS.BLOCK_DURATION
            },
            [Player.states.STAGGERED]: {
                [DIRECTIONS.RIGHT]: [[0, 0]],
                duration:  ANIMATOR_CONSTANTS.STAGGER_DURATION
            },
            [Player.states.DEAD]: {
                [DIRECTIONS.RIGHT]: [[0, 0]],
                duration: 1
            }
        },
    },
    
    [CHARACTER_NAMES.WARRIOR_WOMAN]: {
        spritesheet: {
            img: "character/warriorWoman/warriorWoman.png",
            numRow: 5,
            numCol: 24,
        },
        swordSound: "heavySwordSwoosh1",
        gender: "female",
        animation: {
            [Player.states.MOVE]: {
                [DIRECTIONS.RIGHT]: [[1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7]],
                [DIRECTIONS.LEFT]: [[1, 23], [1, 22], [1, 21], [1, 20], [1, 19], [1, 18], [1, 17], [1, 16]],
                duration: 1,
            },
            [Player.states.IDLE]: {
                [DIRECTIONS.RIGHT]: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7]],
                [DIRECTIONS.LEFT]: [[0, 23], [0, 22], [0, 21], [0, 20], [0, 19], [0, 18], [0, 17], [0, 16]],
                duration: 10,
            },
            [Player.states.ATTACK]: {
                [DIRECTIONS.RIGHT]: [
                    [2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [2, 7], [2, 8], [2, 9], 
                    [2, 10], [2, 11]
                ],
                [DIRECTIONS.LEFT]: [
                    [2, 23], [2, 22], [2, 21], [2, 20], [2, 19], [2, 18], [2, 17], [2, 16], [2, 15], 
                    [2, 14], [2, 13], [2, 12]
                ],
                duration: ANIMATOR_CONSTANTS.ATTACK_DURATION
            },
            [Player.states.JUMP]: {
                [DIRECTIONS.RIGHT]: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7]],
                duration: 1
            },

            [Player.states.BLOCK]: {
                [DIRECTIONS.RIGHT]: [[0,0]],
                duration: ANIMATOR_CONSTANTS.BLOCK_DURATION
            },
			[Player.states.FINISHER]: {
				// TODO: implement
			},

            [Player.states.STAGGERED]: {
                [DIRECTIONS.RIGHT]: [[0, 0], [0, 1], [0, 2], [0, 3]],
                duration:  ANIMATOR_CONSTANTS.STAGGER_DURATION
            },

            [Player.states.DEAD]: {
                [DIRECTIONS.RIGHT]: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7]],
                duration: 1
            },
        }
    },

    [CHARACTER_NAMES.KNIGHT]: {
        spritesheet: {
            img: "character/knight/knight.png",
            numRow: 12,
            numCol: 16,
        },
        swordSound: "heavySwordSwoosh3",
        gender: "male",
        animation: {
            [Player.states.MOVE]: {
                [DIRECTIONS.RIGHT]: [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6]],
                [DIRECTIONS.LEFT]: [[2, 15], [2, 14], [2, 13], [2, 12], [2, 11], [2, 10], [2, 9]],
                duration: 1 
            },
            [Player.states.IDLE]: {
                [DIRECTIONS.RIGHT]: [[0, 0], [0, 1], [0, 2], [0, 3]],
                [DIRECTIONS.LEFT]: [[0, 15], [0, 14], [0, 13], [0, 12]],
                duration: 1,
            },
            [Player.states.ATTACK]: {
                [DIRECTIONS.RIGHT]: [[3, 0], [3, 1], [3, 2], [3, 3], [3, 4], [3, 5]],
                [DIRECTIONS.LEFT]: [[3, 15], [3, 14], [3, 13], [3, 12], [3, 11], [3, 10]],
                duration: ANIMATOR_CONSTANTS.ATTACK_DURATION
            },
            [Player.states.JUMP]: {
                [DIRECTIONS.RIGHT]: [[8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5]],
                [DIRECTIONS.LEFT]: [[8, 15], [8, 14], [8, 13], [8, 12], [8, 11], [8, 10]],
                duration: 1
            },
            [Player.states.BLOCK]: {
                [DIRECTIONS.RIGHT]: [[11, 0], [11, 1], [11, 2],[11,3],[11,4]],
                duration: ANIMATOR_CONSTANTS.BLOCK_DURATION
            },
			[Player.states.FINISHER]: {
				// TODO: implement
			},
            [Player.states.STAGGERED]: {
                [DIRECTIONS.RIGHT]: [[9, 0], [9, 1]],
                duration:  ANIMATOR_CONSTANTS.STAGGER_DURATION
            },

            [Player.states.DEAD]: {
                [DIRECTIONS.RIGHT]: [[9, 0], [9, 1], [9, 2], [9, 4]],
                [DIRECTIONS.LEFT]: [[9, 15], [9, 14], [9, 13], [9, 12]],
                duration: 1
            },
        },
    },

    [CHARACTER_NAMES.SAMURAI_A]: {
        spritesheet: {
            img: "character/samurai/samurai1.png",
            numRow: 10,
            numCol: 18,
        },
        swordSound: "heavySwordSwoosh1",
        gender: "male",
        animation: {
            [Player.states.MOVE]: {
                [DIRECTIONS.RIGHT]: [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [2, 7]],
                [DIRECTIONS.LEFT]: [[2, 17], [2, 16], [2, 15], [2, 14], [2, 13], [2, 12], [2, 11], [2, 10]],
                duration: 1,
                
            },
            [Player.states.IDLE]: {
                [DIRECTIONS.RIGHT]: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5]],
                [DIRECTIONS.LEFT]: [[0, 17], [0, 16], [0, 15], [0, 14], [0, 13]],
                duration: 1,
            },
            [Player.states.ATTACK]: {
                [DIRECTIONS.RIGHT]: [[4, 0], [4, 1], [4, 2], [4, 3], [4, 4]],
                [DIRECTIONS.LEFT]: [[4, 17], [4, 16], [4, 15], [4, 14], [4, 13]],
                duration: 0.5,
                
            },
            [Player.states.JUMP]: {
                [DIRECTIONS.RIGHT]: [[7, 0], [7, 1], [7, 2], [7, 3], [7, 4], [7, 5], [7, 6], [7, 7], [7, 8]],
                [DIRECTIONS.LEFT]: [[7, 17], [7, 16], [7, 15], [7, 14], [7, 13], [7, 12], [7, 11], [7, 10], [7, 9]],
                duration: 1,
            },
            [Player.states.BLOCK]: {
                [DIRECTIONS.RIGHT]: [[7, 0], [7, 1], [7, 2]],
                duration: ANIMATOR_CONSTANTS.BLOCK_DURATION
            },
			[Player.states.FINISHER]: {
				// TODO: implement
			},
            [Player.states.STAGGERED]: {
                [DIRECTIONS.RIGHT]: [[9, 0], [9, 1], [9, 2]],
                duration:  ANIMATOR_CONSTANTS.STAGGER_DURATION
            },
            [Player.states.DEAD]: {
                [DIRECTIONS.RIGHT]: [[9, 0], [9, 1], [9, 2], [9, 3], [9, 4], [9, 5]],
                [DIRECTIONS.LEFT]: [[9, 17], [9, 16], [9, 15], [9, 14], [9, 13], [9, 12]],
                duration: 1,
            },
        },
    },

    [CHARACTER_NAMES.SAMURAI_B]: {
        spritesheet: {
            img: "character/samurai/samurai2.png",
            numRow: 10,
            numCol: 12,
        },
        swordSound: "heavySwordSwoosh1",
        gender: "male",
        animation: {
            [Player.states.MOVE]: {
                [DIRECTIONS.RIGHT]: [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [2, 7]],
                duration: 1,
            },
            [Player.states.IDLE]: {
                [DIRECTIONS.RIGHT]: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5]],
                duration: 1,

            },
            [Player.states.ATTACK]: {
                [DIRECTIONS.RIGHT]: [[4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5]],
                duration: ANIMATOR_CONSTANTS.ATTACK_DURATION,
            },
            [Player.states.JUMP]: {
                [DIRECTIONS.RIGHT]: [[3, 0], [3, 1], [3, 2], [3, 3], [3, 4], [3, 5], [3, 6], [3, 7], [3, 8], [3, 9], [3, 10], [3, 11]],
                duration: 1,
            },
            [Player.states.BLOCK]: {
                [DIRECTIONS.RIGHT]: [[8, 0], [8, 1], [8, 2]],
                duration: ANIMATOR_CONSTANTS.BLOCK_DURATION
            },
			[Player.states.FINISHER]: {
				// TODO: implement
			},
            [Player.states.STAGGERED]: {
                [DIRECTIONS.RIGHT]: [[9, 0], [9, 1]],
                duration:  ANIMATOR_CONSTANTS.STAGGER_DURATION
            },
            [Player.states.DEAD]: {
                [DIRECTIONS.RIGHT]: [[9, 0], [9, 1], [9, 2]],
                duration: 1,
            },
        },
    },

    [CHARACTER_NAMES.SKELETON]: {
        spritesheet: {
            img: "character/skeleton/skeleton.png",
            numRow: 10,
            numCol: 10,
        },
        swordSound: "heavySwordSwoosh1",
        gender: "male",
        animation: {
            [Player.states.MOVE]: {
                [DIRECTIONS.RIGHT]: [[2,0],[2,1],[2,2],[2,3],[2,4]],
                duration: 1,
            },
            [Player.states.IDLE]: {
                [DIRECTIONS.RIGHT] : [[0,0],[0,1], [0,2],[0,3],[0,4],[0,5],[0,6]],
                duration: 1,
            },
            [Player.states.ATTACK]: {
                [DIRECTIONS.RIGHT]: [[3,0],[3,1],[3,2],[3,3],[3,4]],
                duration: ANIMATOR_CONSTANTS.ATTACK_DURATION
            },
            [Player.states.JUMP]: {
                [DIRECTIONS.RIGHT]: [[7,0],[7,1],[7,2],[7,3],[7,4],[7,5]],
                duration: 1,
            },
            [Player.states.BLOCK]: {
                [DIRECTIONS.RIGHT]: [[6,0], [6,1]],
                duration: ANIMATOR_CONSTANTS.BLOCK_DURATION
            },
			[Player.states.FINISHER]: {
				// TODO: implement
			},
             [Player.states.STAGGERED]: {
                [DIRECTIONS.RIGHT]: [[8,0],[8,1],[8,2]],
                duration:  ANIMATOR_CONSTANTS.STAGGER_DURATION
            },
            [Player.states.DEAD]: {
                [DIRECTIONS.RIGHT]: [[9,0],[9,1],[9,2],[9,3],[9,4]],
                duration: 1,
            },
        },
    },

    [CHARACTER_NAMES.MONK]: { 
        spritesheet: {
            img: "character/monk/monk.png",
            numRow: 10,
            numCol: 9,
        },
        swordSound: "heavySwordSwoosh1",
        gender: "male",
        animation: {
            [Player.states.MOVE]: {
                [DIRECTIONS.RIGHT]: [[2,0],[2,1],[2,2],[2,3],[2,4],[2,5],[2,6],[2,7]],
                duration: 1,
            },
            [Player.states.IDLE]: {
                [DIRECTIONS.RIGHT] : [[0,0],[0,1], [0,2],[0,3],[0,4],[0,5],[0,6]],
                duration: 1,
            },
            [Player.states.ATTACK]: {
                [DIRECTIONS.RIGHT]: [[3,0],[3,1],[3,2],[3,3],[3,4]],
                duration: ANIMATOR_CONSTANTS.ATTACK_DURATION
            },
            [Player.states.JUMP]: {
                [DIRECTIONS.RIGHT]: [[6,0],[6,1],[6,2],[6,3],[6,4],[6,5],[6,6],[6,7],[6,8]],
                duration: 1,
            },
            [Player.states.BLOCK]: {
                [DIRECTIONS.RIGHT]: [[8,0], [8,1],[8,2],[8,3]],
                duration: ANIMATOR_CONSTANTS.BLOCK_DURATION
            },
			[Player.states.FINISHER]: {
				// TODO: implement
			},
             [Player.states.STAGGERED]: {
                [DIRECTIONS.RIGHT]: [[4,0],[4,1],[4,2]],
                duration:  ANIMATOR_CONSTANTS.STAGGER_DURATION
            },
            [Player.states.DEAD]: {
                [DIRECTIONS.RIGHT]: [[9,0],[9,1],[9,2],[9,3],[9,4]],
                duration: 1,
            },
        },
    },

    [CHARACTER_NAMES.MINOTAUR]: {
        spritesheet: {
            img: "character/minotaur/minotaur.png",
            numRow: 6,
            numCol: 12,
        },
        swordSound: "heavySwordSwoosh1",
        gender: "male",
        animation: {
            [Player.states.MOVE]: {
                [DIRECTIONS.RIGHT]: [[1,0],[1,1],[1,2],[1,3],[1,4],[1,5],[1,6],[1,7],[1,8],[1,9],[1,10],[1,11]],
                duration: 1,
            },
            [Player.states.IDLE]: {
                [DIRECTIONS.RIGHT] : [[0,0],[0,1], [0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8],[0,9]],
                duration: 1,
            },
            [Player.states.ATTACK]: {
                [DIRECTIONS.RIGHT]: [[2,0],[2,1],[2,2],[2,3],[2,4]],
                duration: ANIMATOR_CONSTANTS.ATTACK_DURATION
            },
            [Player.states.JUMP]: {
                [DIRECTIONS.RIGHT]: [[1,0],[1,1],[1,2],[1,3],[1,4],[1,5],[1,6],[1,7],[1,8],[1,9],[1,10],[1,11]],
                duration: 1,
            },
            [Player.states.BLOCK]: {
                [DIRECTIONS.RIGHT]: [[3,0], [3,1],[3,2]],
                duration: ANIMATOR_CONSTANTS.BLOCK_DURATION
            },
			[Player.states.FINISHER]: {
				// TODO: implement
			},
             [Player.states.STAGGERED]: {
                [DIRECTIONS.RIGHT]: [[4,0],[4,1]],
                duration:  ANIMATOR_CONSTANTS.STAGGER_DURATION
            },
            [Player.states.DEAD]: {
                [DIRECTIONS.RIGHT]: [[4,0],[4,1],[4,2],[4,3],[4,4]],
                duration: 1,
            },
        },
    },

    [CHARACTER_NAMES.GANGSTER]: {
        spritesheet: {
            img: "character/gangsters/Gangsters.png",
            numRow: 10,
            numCol: 13,
        },
        swordSound: "heavySwordSwoosh1",
        gender: "male",
        animation: {
            [Player.states.MOVE]: {
                [DIRECTIONS.RIGHT]: [[3,0],[3,1],[3,2],[3,3],[3,4],[3,5],[3,6],[3,7],[3,8],[3,9]],
                duration: 1,
            },
            [Player.states.IDLE]: {
                [DIRECTIONS.RIGHT] : [[1,0],[1,1],[1,2],[1,3],[1,4],[1,5],[1,6],[1,7],[1,8],[1,9],[1,10],[1,11],[1,12]],
                duration: 1,
            },
            [Player.states.ATTACK]: {
                [DIRECTIONS.RIGHT]: [[5,0],[5,1],[5,2],[5,3],[5,4],[5,5]],
                duration: ANIMATOR_CONSTANTS.ATTACK_DURATION
            },
            [Player.states.JUMP]: {
                [DIRECTIONS.RIGHT]: [[4,0],[4,1],[4,2],[4,3],[4,4],[4,5],[4,6],[4,7],[4,8],[4,9]],
                duration: 1,
            },
            [Player.states.BLOCK]: {
                [DIRECTIONS.RIGHT]: [[5,0], [5,1]],
                duration: ANIMATOR_CONSTANTS.BLOCK_DURATION
            },
			[Player.states.FINISHER]: {
				// TODO: implement
			},
             [Player.states.STAGGERED]: {
                [DIRECTIONS.RIGHT]: [[9,0], [9,1]],
                duration:  ANIMATOR_CONSTANTS.STAGGER_DURATION
            },
            [Player.states.DEAD]: {
                [DIRECTIONS.RIGHT]: [[9,0],[9,1],[9,2],[9,3],[9,4]],
                duration: 1,
            },
        },
    },

    [CHARACTER_NAMES.MAGE]: {
        spritesheet: {
            img: "character/mage/mage.png",
            numRow: 10,
            numCol: 15,
        },
        swordSound: "heavySwordSwoosh1",
        gender: "female",
        animation: {
            [Player.states.MOVE]: {
                [DIRECTIONS.RIGHT]: [[2,0],[2,1],[2,2],[2,3],[2,4],[2,5],[2,6],[2,7]],
                duration: 1,
            },
            [Player.states.IDLE]: {
                [DIRECTIONS.RIGHT] : [[0,0],[0,1], [0,2],[0,3],[0,4],[0,5],[0,6]],
                duration: 1,
            },
            [Player.states.ATTACK]: {
                [DIRECTIONS.RIGHT]: [[3,0],[3,1],[3,2],[3,3],[3,4],[3,5],[3,6],[3,7],[3,8],[3,9]],
                duration: ANIMATOR_CONSTANTS.ATTACK_DURATION
            },
            [Player.states.JUMP]: {
                [DIRECTIONS.RIGHT]: [[7,0],[7,1],[7,2],[7,3],[7,4],[7,5],[7,6],[7,7]],
                duration: 1,
            },
            [Player.states.BLOCK]: {
                [DIRECTIONS.RIGHT]: [[8,0], [8,1],[8,2]],
                duration: ANIMATOR_CONSTANTS.BLOCK_DURATION
            },
			[Player.states.FINISHER]: {
				// TODO: implement
			},
            [Player.states.STAGGERED]: {
                [DIRECTIONS.RIGHT]: [[9,0],[9,1],[9,2]],
                duration:  ANIMATOR_CONSTANTS.STAGGER_DURATION
            },
            [Player.states.DEAD]: {
                [DIRECTIONS.RIGHT]: [[9,0],[9,1],[9,2],[9,3],[9,4]],
                duration: 1,
            },
        },
    },

    [CHARACTER_NAMES.NINJA]: {
        spritesheet: {
            img: "character/ninja/monk.png",
            numRow: 10,
            numCol: 9,
        },
        swordSound: "heavySwordSwoosh1",
        gender: "male",
        animation: {
            [Player.states.MOVE]: {
                [DIRECTIONS.RIGHT]: [[2,0],[2,1],[2,2],[2,3],[2,4],[2,5],[2,6],[2,7]],
                duration: 1,
            },
            [Player.states.IDLE]: {
                [DIRECTIONS.RIGHT] : [[0,0],[0,1], [0,2],[0,3],[0,4],[0,5],[0,6]],
                duration: 1,
            },
            [Player.states.ATTACK]: {
                [DIRECTIONS.RIGHT]: [[3,0],[3,1],[3,2],[3,3],[3,4]],
                duration: ANIMATOR_CONSTANTS.ATTACK_DURATION
            },
            [Player.states.JUMP]: {
                [DIRECTIONS.RIGHT]: [[6,0],[6,1],[6,2],[6,3],[6,4],[6,5],[6,6],[6,7],[6,8]],
                duration: 1,
            },
            [Player.states.BLOCK]: {
                [DIRECTIONS.RIGHT]: [[8,0], [8,1],[8,2],[8,3]],
                duration: ANIMATOR_CONSTANTS.BLOCK_DURATION
            },
			[Player.states.FINISHER]: {
				// TODO: implement
			},
            [Player.states.STAGGERED]: {
                [DIRECTIONS.RIGHT]: [[9,0],[9,1],[9,2]],
                duration:  ANIMATOR_CONSTANTS.STAGGER_DURATION
            },
            [Player.states.DEAD]: {
                [DIRECTIONS.RIGHT]: [[9,0],[9,1],[9,2],[9,3],[9,4]],
                duration: 1,
            },
        },
    }
}

/**
 * @typedef
 * @param {string}theCharacter
 * @returns {CharacterDatum}
 */
export function getCharacterData(theCharacter) {
    return CHARACTER_DATA[theCharacter];
}