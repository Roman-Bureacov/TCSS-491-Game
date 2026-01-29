'use strict';

import {getCharacterData} from "./characterData.js";
import {Spritesheet} from "./animation.js";

/**
 * Constructs the character
 */
export class characterFactory {

    constructor(characterName, assetManager) {
    this.data = getCharacterData(characterName);
    
    const path = "./assets/" + this.data.img;
    
    console.log(path);

    const img = assetManager.getAsset(path);
    console.log(img);
    this.spritesheet = new Spritesheet(img, this.data.numRow, this.data.numCol);

  }




    /**
     * Retrieves the characters spritesheet component as a new spritesheet object.
     * @returns {Spritesheet}
     */
    getCharacterSpriteSheet() {
        return this.spritesheet;
    }

    /**
     * Gets the Character data from CharacterData.js
     * @returns {*}
     */
    getCharacter() {
        return this.data;
    }


}