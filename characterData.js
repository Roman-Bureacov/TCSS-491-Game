'use strict';
const CHARACTER_DATA = {
    guy1: {
        img: "./assets/character/guy1/Guy.png",
        name: "guy1",
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
        frameWidth: 100,
        frameHeight: 150,

    },
    
    guy2: {
        img: "./assets/character/guy2/Guy2.png",
        name: "guy2",
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
        frameWidth: 100,
        frameHeight: 150,

    },
    
    warriorWoman: {
        img: "./assets/character/warriorWoman/warriorWoman.png",
        name: "warriorWoman",
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
        frameWidth: 142,
        frameHeight: 127,
    }
    
    
}

/**
 * Retrieves the characters data sheet
 * @param {string} theCharacter
 * @returns {CHARACTER_DATA}
 */
export function getCharacterData(theCharacter) {
    return CHARACTER_DATA[theCharacter];
}

/**
 * Retrieves all the characters data sheets
 *
 * @returns {CHARACTER_DATA} The whole character data object
 */
export function getAllCharacterData() {
    return CHARACTER_DATA;
}

/**
 * Switches the character sheet
 *
 * @param index The index of the character.
 * @returns {CHARACTER_DATA} The new character data sheet
 */
export function switchCharacter(index) {
   let characterMap = {
       0 : getCharacterData("guy1"),
       1 : getCharacterData("guy2"),
       2: getCharacterData("warriorWoman"),
   }

   return characterMap[index];
}