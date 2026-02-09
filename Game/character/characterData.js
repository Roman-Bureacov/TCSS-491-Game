'use strict';

const CHARACTER_DATA = {
    guy1: {
        img: "character/guy1/Guy.png",
        numRow: 3,
        numCol: 14,
        moveR: [[1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5]],
        moveL: [[1, 13], [1, 12], [1, 11], [1, 10], [1, 9], [1, 8]],
        movePadY: 0,
        idleR : [[0, 0]],
        idleL: [[0, 13]],
        idlePadY: 0,
        attackR: [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6]],
        attackL: [[2, 13], [2, 12], [2, 11], [2, 10], [2, 9], [2, 8], [2, 7]],
        attackPadY: 0,
        idleDur: 1,
        moveDur: 1,
        attackDur: 0.5,
        scale:1,
        swordSound: "quickSwordSwoosh2",

    },
    
    guy2: {
        img: "character/guy2/Guy2.png",
        numRow: 3,
        numCol: 14,
        moveR: [[1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5]],
        moveL: [[1, 13], [1, 12], [1, 11], [1, 10], [1, 9], [1, 8]],
        movePadY: 0,
        idleR : [[0, 0]],
        idleL: [[0, 13]],
        idlePadY: 0,
        attackR: [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6]],
        attackL: [[2, 13], [2, 12], [2, 11], [2, 10], [2, 9], [2, 8], [2, 7]],
        attackPadY: 0,
        idleDur: 1,
        moveDur: 1,
        attackDur: 0.5,
        scale:1,
        swordSound: "quickSwordSwoosh2",

    },
    
    warriorWoman: {
        img: "./character/warriorWoman/warriorWoman.png",
        numRow: 5,
        numCol: 24,
        moveR: [[1,0],[1,1],[1,2],[1,3],[1,4],[1,5],[1,6],[1,7]],
        moveL: [[1,23],[1,22], [1,21],[1,20], [1,19],[1,18], [1,17], [1,16]],
        movePadY: -20,
        idleR : [[0,0],[0,1], [0,2],[0,3],[0,4],[0,5],[0,6],[0,7]],
        idleL: [[0,23],[0,22], [0,21],[0,20], [0,19],[0,18], [0,17],[0,16]],
        idlePadY: 15,
        attackR: [[2,0],[2,1],[2,2],[2,3],[2,4],[2,5],[2,6],[2,7],[2,8],[2,9],[2,10],[2,11]],
        attackL: [[2,23],[2,22],[2,21],[2,20],[2,19],[2,18],[2,17],[2,16],[2,15],[2,14],[2,13],[2, 12]],
        attackPadY: -58,
        idleDur: 10,
        moveDur: 1,
        attackDur: 0.5,
        scale:2.5,
        swordSound: "heavySwordSwoosh1",
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