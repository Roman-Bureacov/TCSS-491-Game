/*
A concrete implementation of the character class
 */

import {Character} from "./entity/character.js"
import {KeyMapper} from "./engine/keymapper.js";
import {CharacterFactory} from "./entity/characterFactory.js";
import {Player} from "./entity/player.js";
import {getCharacterData} from "./entity/characterData.js";
import {Spritesheet} from "./entity/animation.js";

export class PlayerOne extends Player {
    constructor(game, assetManager, characterName, startPosX, startPosY, scale = 1) {
        
        const spritesheet = new Spritesheet(assetManager.getAsset(getCharacterData(characterName).img),getCharacterData(characterName).numRow, getCharacterData(characterName).numCol)
        
        console.log(spritesheet);
        
        super(game, spritesheet, scale, scale, startPosX, startPosY, Character.DIRECTION.RIGHT, characterName)
        
        Object.assign(this, {facingDir: Character.DIRECTION.RIGHT})
        Object.assign(this, {game, assetManager, characterName})
        
        this.setupKeymap();

    }

    
    setupKeymap() {
  this.keymapper.inputMap = {
    [KeyMapper.getName("KeyD", true)]:  "move right",
    [KeyMapper.getName("KeyA", true)]:  "move left",
    [KeyMapper.getName("KeyS", true)]:  "attack",
    [KeyMapper.getName("KeyD", false)]: "stop right",
    [KeyMapper.getName("KeyA", false)]: "stop left",
  };
}


}