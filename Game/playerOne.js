/*
A concrete implementation of the character class
 */

import {Character} from "./entity/character.js"
import {KeyMapper} from "./engine/keymapper.js";
import {getCharacterData} from "./entity/characterData.js";
import {Spritesheet} from "./entity/animation.js";
import {Player} from "./entity/player.js";
import {SoundFX} from "./engine/soundFX.js";



export class PlayerOne extends Player {

    constructor(game, assetManager, characterName, startPosX, startPosY, scale = 1, dimX = 1, dimY = 1,) {

        const spritesheet = new Spritesheet(assetManager.getAsset(getCharacterData(characterName).img), getCharacterData(characterName).numRow, getCharacterData(characterName).numCol)

        super(game, spritesheet, scale, scale, startPosX, startPosY, Character.DIRECTION.RIGHT, characterName)

        this.playerHealth = 100;
        
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

    getPlayerHealth() {
        return this.playerHealth;
    }

    setPlayerHealth(damage) {
        this.playerHealth -= damage;
        // this.swordCollide();

        console.log("Player 2 hit player 1");
        
        
        if (this.getPlayerHealth() <= 0) {
            console.log("Player 2 won");
        }
    }

    


}