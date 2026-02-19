/*
A concrete implementation of the character class
 */

import {Character} from "./entity/character.js"
import {KeyMapper} from "./engine/keymapper.js";
import {getCharacterData} from "./entity/characterData.js";
import {Spritesheet} from "./entity/animation.js";
import {Player} from "./entity/player.js";
import {SoundFX} from "./engine/soundFX.js";


export class PlayerTwo extends Player {


    constructor(game, assetManager, characterName, startPosX, startPosY, scale = 1, dimX = 1, dimY = 1,) {

        const spritesheet = new Spritesheet(assetManager.getAsset(getCharacterData(characterName).img), getCharacterData(characterName).numRow, getCharacterData(characterName).numCol)

        super(game, spritesheet, scale, scale, startPosX, startPosY, Character.DIRECTION.LEFT, characterName)

        this.setupKeymap();

    }

    setupKeymap() {
        
        this.keymapper.inputMap = {
            [KeyMapper.getName("KeyL", true)]: "move right",
            [KeyMapper.getName("KeyJ", true)]: "move left",
            [KeyMapper.getName("KeyK", true)]: "attack",
            [KeyMapper.getName("KeyL", false)]: "stop right",
            [KeyMapper.getName("KeyJ", false)]: "stop left",
            [KeyMapper.getName("KeyI", true)]: "jump",
            [KeyMapper.getName("KeyI", false)]: "jump",
        };
    }

}

