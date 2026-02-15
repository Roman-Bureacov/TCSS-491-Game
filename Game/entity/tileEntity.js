import {StaticEntity} from "./entity.js";
import {Hitbox} from "../engine/hitbox.js"
import {Rectangle2D} from "../engine/primitives.js";

/**
 * Describes a tile entity, which is a static object
 * with its own hitbox.
 *
 * Tile entities only stay still and don't update.
 *
 * @author Roman Bureacov
 */
export class TileEntity extends StaticEntity {

    /**
     * The hitbox corresponding to this tile
     *
     * @type {Hitbox}
     * @override
     */
    hitbox;

    /**
     * Creates a tile entity.
     *
     * @param {Spritesheet} spritesheet the corresponding spritesheet to the tile
     * @param {number} [dimX=1] the width of this tile
     * @param {number} [dimY=1] the height of this tile
     */
    constructor(spritesheet, dimX = 1, dimY = 1) {
        super(spritesheet);
        this.hitbox = new Hitbox(this, new Rectangle2D(0, 0, dimX, dimY));
    }


}