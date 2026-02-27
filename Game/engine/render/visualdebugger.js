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
        this.hitboxVisibilityLoop = false;
        /**
         * A simple flag for if we need to keep adding drawable sprites
         */
        this.spriteVisibilityLoop = false;
    }

    showHitboxes() {
        this.hitboxVisibilityLoop = true;

        const repeat = () => {
            if (!this.hitboxVisibilityLoop) return;

            for (let hitbox of this.game.hitboxes.dynamic) {
                if (!this.gameplayPane.drawables.includes(hitbox)) {
                    this.gameplayPane.addDrawable(hitbox);
                }
            }

            this.gameplayPane.drawables
                .filter(d => d instanceof Hitbox)
                .map(h => {
                    if (h.expired) { // remove expired hitboxes automatically
                        this.gameplayPane.drawables.splice(
                            this.gameplayPane.drawables.indexOf(h),
                            1);
                    }
                })

            setTimeout(repeat, 50)
        }

        setTimeout(repeat, 0);
        console.log("showing hitboxes...")
    }

    hideHitboxes() {
        this.hitboxVisibilityLoop = false;
        this.gameplayPane.drawables
            .filter(d => d instanceof Hitbox)
            .map(h => {
                this.gameplayPane.drawables.splice(
                    this.gameplayPane.drawables.indexOf(h),
                    1);
            })
    }

    showSpritesBoxes() {
        this.spriteVisibilityLoop = true;

        this.spriteBoxes = [];
        this.game.entities.dynamic
            .map(e => this.spriteBoxes.push(
                new Hitbox(e, e.drawingProperties.bounds)
            ))

        this.spriteBoxes
            .map(e => this.gameplayPane.drawables.push(e));
    }

    hideSpritesBoxes() {
        this.spriteVisibilityLoop = false;

        this.spriteBoxes
            .forEach(b => this.gameplayPane.drawables.splice(
                this.gameplayPane.drawables.indexOf(b),
                1
            ))
    }

}