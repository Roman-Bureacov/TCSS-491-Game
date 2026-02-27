/*
A concrete implementation of the character class
 */

import {KeyMapper} from "../../engine/keymapper.js";
import {Player} from "../player.js";

export class PlayerTwo extends Player {

    constructor(game, spritesheet, startPosX, startPosY, dimX, dimY) {
        super(game, spritesheet, dimX, dimY, startPosX, startPosY,2)
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

