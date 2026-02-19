'use strict';

const CHARACTER_DATA = {
    guy1: {
        img: "character/guy1/Guy.png",
        numRow: 3,
        numCol: 14,
        moveR: [[1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5]],
        moveL: [[1, 13], [1, 12], [1, 11], [1, 10], [1, 9], [1, 8]],
        movePadY: 0,
        idleR: [[0, 0]],
        idleL: [[0, 13]],
        deadR: [[0, 0]],
        idlePadY: 0,
        attackR: [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6]],
        attackL: [[2, 13], [2, 12], [2, 11], [2, 10], [2, 9], [2, 8], [2, 7]],
        jumpR: [[0, 0]],
        attackPadY: 0,
        idleDur: 1,
        moveDur: 1,
        attackDur: 0.5,
        scale: 1,
        swordSound: "quickSwordSwoosh2",
        gender: "male",


    },

    guy2: {
        img: "character/guy2/Guy2.png",
        numRow: 3,
        numCol: 14,
        moveR: [[1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5]],
        moveL: [[1, 13], [1, 12], [1, 11], [1, 10], [1, 9], [1, 8]],
        movePadY: 0,
        idleR: [[0, 0]],
        idleL: [[0, 13]],
        idlePadY: 0,
        deadR: [[0, 0]],
        attackR: [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6]],
        attackL: [[2, 13], [2, 12], [2, 11], [2, 10], [2, 9], [2, 8], [2, 7]],
        jumpR: [[0, 0]],
        attackPadY: 0,
        idleDur: 1,
        moveDur: 1,
        attackDur: 0.5,
        scale: 1,
        swordSound: "quickSwordSwoosh2",
        gender: "male",


    },

    warriorWoman: {
        img: "character/warriorWoman/warriorWoman.png",
        numRow: 5,
        numCol: 24,
        moveR: [[1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7]],
        moveL: [[1, 23], [1, 22], [1, 21], [1, 20], [1, 19], [1, 18], [1, 17], [1, 16]],
        movePadY: -20,
        idleR: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7]],
        idleL: [[0, 23], [0, 22], [0, 21], [0, 20], [0, 19], [0, 18], [0, 17], [0, 16]],
        idlePadY: -15,
        attackR: [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [2, 7], [2, 8], [2, 9], [2, 10], [2, 11]],
        attackL: [[2, 23], [2, 22], [2, 21], [2, 20], [2, 19], [2, 18], [2, 17], [2, 16], [2, 15], [2, 14], [2, 13], [2, 12]],
        jumpR: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7]],
        attackPadY: -58,
        idleDur: 10,
        deadR: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7]],
        moveDur: 1,
        attackDur: 0.5,
        scale: 2.5,
        swordSound: "heavySwordSwoosh1",
        gender: "female",
    },

    knight: {
        img: "character/knight/knight.png",
        numRow: 12,
        numCol: 16,
        moveR: [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6]],
        moveL: [[2, 15], [2, 14], [2, 13], [2, 12], [2, 11], [2, 10], [2, 9]],
        movePadY: -55,
        idleR: [[0, 0], [0, 1], [0, 2], [0, 3]],
        idleL: [[0, 15], [0, 14], [0, 13], [0, 12]],
        idlePadY: -45,
        attackR: [[3, 0], [3, 1], [3, 2], [3, 3], [3, 4], [3, 5]],
        attackL: [[3, 15], [3, 14], [3, 13], [3, 12], [3, 11], [3, 10]],
        attackPadY: -65,
        deadR: [[9, 0], [9, 1], [9, 2], [9, 4]],
        deadL: [[9, 15], [9, 14], [9, 13], [9, 12]],
        jumpR: [[8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5]],
        jumpL: [[8, 15], [8, 14], [8, 13], [8, 12], [8, 11], [8, 10]],
        idleDur: 10,
        moveDur: 1,
        attackDur: 0.5,
        scale: 2.5,
        swordSound: "heavySwordSwoosh3",
        gender: "male",

    },

    samurai1: {
        img: "character/samurai/samurai1.png",
        numRow: 10,
        numCol: 18,
        moveR: [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [2, 7]],
        moveL: [[2, 17], [2, 16], [2, 15], [2, 14], [2, 13], [2, 12], [2, 11], [2, 10]],
        movePadY: -170,
        idleR: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5]],
        idleL: [[0, 17], [0, 16], [0, 15], [0, 14], [0, 13]],
        idlePadY: -170,
        attackR: [[4, 0], [4, 1], [4, 2], [4, 3], [4, 4]],
        attackL: [[4, 17], [4, 16], [4, 15], [4, 14], [4, 13]],
        attackPadY: -170,
        deadR: [[9, 0], [9, 1], [9, 2], [9, 3], [9, 4], [9, 5]],
        deadL: [[9, 17], [9, 16], [9, 15], [9, 14], [9, 13], [9, 12]],
        jumpR: [[7, 0], [7, 1], [7, 2], [7, 3], [7, 4], [7, 5], [7, 6], [7, 7], [7, 8]],
        jumpL: [[7, 17], [7, 16], [7, 15], [7, 14], [7, 13], [7, 12], [7, 11], [7, 10], [7, 9]],
        idleDur: 1,
        moveDur: 1,
        attackDur: 0.5,
        scale: 2.5,
        swordSound: "heavySwordSwoosh1",
        gender: "male",


    },

    samurai2: {
        img: "character/samurai/samurai2.png",
        numRow: 10,
        numCol: 12,
        moveR: [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [2, 7]],
        //moveL: [[2,17],[2,16],[2,15],[2,14],[2,13],[2,12],[2,11],[2,10]],
        movePadY: -170,
        idleR: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5]],
        //idleL: [[0,17],[0,16],[0,15],[0,14],[0,13]],
        idlePadY: -170,
        attackR: [[4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5]],
        //attackL: [[4,17],[4,16],[4,15],[4,14],[4,13]],
        attackPadY: -170,
        deadR: [[9, 0], [9, 1], [9, 2]],
        //deadL: [[9,17],[9,16],[9,15],[9,14],[9,13],[9,12]],
        jumpR: [[3, 0], [3, 1], [3, 2], [3, 3], [3, 4], [3, 5], [3, 6], [3, 7], [3, 8], [3, 9], [3, 10], [3, 11]],
        //jumpL: [[7,17],[7,16],[7,15],[7,14],[7,13],[7,12],[7,11],[7,10],[7,9]],
        idleDur: 1,
        moveDur: 1,
        attackDur: 0.5,
        scale: 2.5,
        swordSound: "heavySwordSwoosh2",
        gender: "male",


    }


}

/**
 * @typedef
 * @param {string}theCharacter
 * @returns {*}
 */
export function getCharacterData(theCharacter) {
    return CHARACTER_DATA[theCharacter];
}