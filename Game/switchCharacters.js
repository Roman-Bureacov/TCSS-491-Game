'use strict';
import {switchCharacter} from "./characterData.js";


export class switchCharacters {
   index = 1;

    constructor (thePlayer) {
        Object.assign(this, {thePlayer : thePlayer})
    }

    switchCharacter() {
        let CurrentPlayer = this.thePlayer.getCurrentCharacter();
        let NextCharacter = switchCharacter(this.index++%3)

        if(NextCharacter.name === CurrentPlayer.name) {
            this.index++;
            
            NextCharacter = switchCharacter(this.index++%3)
        }
        this.thePlayer.setNewCharacter(NextCharacter);
    }

}