/*
A concrete implementation of the character class
 */

import {Character} from "./entity/character.js"
import {KeyMapper} from "./engine/keymapper.js";
import {getCharacterData} from "./entity/characterData.js";
import {Spritesheet} from "./entity/animation.js";
import {Player} from "./entity/player.js";


export class PlayerOne extends Player {

    constructor(game, assetManager, characterName, startPosX, startPosY, scale = 1, dimX = 1, dimY = 1) {

        const spritesheet = new Spritesheet(assetManager.getAsset(getCharacterData(characterName).img), getCharacterData(characterName).numRow, getCharacterData(characterName).numCol);
        super(game, spritesheet,dimX, dimY, startPosX, startPosY);


        this.setupKeymap();
    }


    setupKeymap() {

        this.keymapper.inputMap = {
            [KeyMapper.getName("KeyD", true)]: "move right",
            [KeyMapper.getName("KeyA", true)]: "move left",
            [KeyMapper.getName("KeyS", true)]: "attack",
            [KeyMapper.getName("KeyD", false)]: "stop right",
            [KeyMapper.getName("KeyA", false)]: "stop left",
            [KeyMapper.getName("KeyW", true)]: "jump",
            [KeyMapper.getName("KeyW", false)]: "jump"
        };
    }

}