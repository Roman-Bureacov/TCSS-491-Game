'use strict';

import {getCharacterData} from "./characterData.js";

import {Spritesheet} from "./animation.js";

/**
 * Constructs the character
 */
export class characterFactory {

    constructor(theCharacterName, assetManager) {

        Object.assign(this, {character: theCharacterName, assetManager});
        this.sprite = getCharacterData(this.character);

        if (!this.sprite) throw new Error(`Unknown character: ${theCharacterName}`);
        console.log("Creating spriteSheet");

    }

    /**
     * Retrieves the characters spritesheet component as a new spritesheet object.
     * @returns {Spritesheet}
     */
    getCharacterSpriteSheet() {
        return new Spritesheet(this.assetManager.getAsset(this.sprite.img), this.sprite.numRow, this.sprite.numCol);
    }

    /**
     * Gets the Character data from CharacterData.js
     * @returns {*}
     */
    getCharacter() {
        return this.sprite;
    }

    getImageAsset() {
        return this.sprite.img;
    }

}