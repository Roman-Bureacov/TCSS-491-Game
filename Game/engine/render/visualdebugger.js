/*

Here we allow for us to intercept the game engine and debug hitboxes

Because this is intended for debugging purposes, this code isn't expected
to follow the principle of OO the best and purposefully violates all
convention, just to debug.

As a result, the debugger is only guaranteed to work if you work towards
updating it appropriately as you update the main code.

This requires in-depth knowledge of the code base.

*/

import {DrawableObject} from "./Render.js";
import {Hitbox} from "../hitbox.js";

/**
 * Handles debugging of the game
 * @author Roman Bureacov
 */
export class EngineDebugger {

    /**
     *
     * @param {GameEngine} game the game engine
     * @param {Pane} gameplayPane the pane where entities live
     */
    constructor(game, gameplayPane) {
        this.game = game;
        this.gameplayPane = gameplayPane;
        /**
         * a simple flag for if we need to keep adding hitboxes
         * @type {boolean}
         */
        this.addHitboxes = false;

    }

    showHitboxes() {
        this.addHitboxes = true;

        const repeat = () => {
            if (!this.addHitboxes) return;

            for (let hitbox of this.game.hitboxes.dynamic) {
                if (!this.gameplayPane.drawables.includes(hitbox)) {
                    this.gameplayPane.addDrawable(hitbox);
                }
            }
            setTimeout(repeat, 50)
        }

        setTimeout(repeat, 0);
        console.log("showing hitboxes...")
    }

    hideHitboxes() {
        this.addHitboxes = false;
        this.gameplayPane.drawables
            .filter(d => d instanceof Hitbox)
            .map(h => {
                this.gameplayPane.drawables.splice(
                    this.gameplayPane.drawables.indexOf(h),
                    1);
            })
    }

}