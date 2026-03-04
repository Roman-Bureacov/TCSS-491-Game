/*
A concrete implementation of the character class
 */

import {KeyMapper} from "../../engine/keymapper.js";
import {Player} from "../player.js";


export class PlayerOne extends Player {

    constructor(game, spritesheet, startPosX, startPosY, dimX, dimY) {
        super(game, spritesheet, dimX, dimY, startPosX, startPosY)
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
            [KeyMapper.getName("KeyW", false)]: "jump",
            [KeyMapper.getName("KeyQ", true)]: "finisher",
        };
    }

}