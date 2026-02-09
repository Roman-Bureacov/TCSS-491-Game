import {KeyMapper} from "../engine/keymapper.js";

/**
 * Assigns the keymap to a character based on the name specified
 * @author Roman Bureacov
 *
 * @param {string} name a string name for the player
 * @param {Player} player the player to assign an input map keymap to
 */
export const assignKeymap = (name, player) => {
    switch (name) {
        case PLAYER.ONE: {

            player.keymapper.inputMap = {
                [KeyMapper.getName("KeyD", true)]: "move right",
                [KeyMapper.getName("KeyA", true)]: "move left",
                [KeyMapper.getName("KeyS", true)]: "attack",
                [KeyMapper.getName("KeyD", false)]: "stop right",
                [KeyMapper.getName("KeyA", false)]: "stop left",
            };
            break;
        }
        case PLAYER.TWO: {
            player.keymapper.inputMap = {
                [KeyMapper.getName("KeyL", true)]: "move right",
                [KeyMapper.getName("KeyJ", true)]: "move left",
                [KeyMapper.getName("KeyK", true)]: "attack",
                [KeyMapper.getName("KeyL", false)]: "stop right",
                [KeyMapper.getName("KeyJ", false)]: "stop left",
            };
            break;
        }
    }
}

/**
 * The enum of valid names for `assignKeymap`
 *
 * @enum {string}
 */
export const PLAYER = Object.freeze({
    ONE : "playerOne",
    TWO : "playerTwo"
})