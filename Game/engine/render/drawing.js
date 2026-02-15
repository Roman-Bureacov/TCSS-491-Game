/**
 * A container that represents the properties necessary for drawing
 *
 * @author Roman Bureacov
 */
export class DrawingProperties {

    /**
     * The spritesheet
     * @type {Spritesheet}
     */
    spritesheet;

    /**
     * The spritesheet row to look at
     * @type {number}
     */
    spriteRow = 0;

    /**
     * The spritesheet column to look at
     * @type {number}
     */
    spriteCol = 0;

    /**
     * If the drawing should be reversed
     * @type {boolean}
     */
    isReversed = false;

    /**
     * The bounds of the sprite frame
     * @type {Rectangle2D}
     */
    bounds;

    /**
     * If the drawing should be omitted or not.
     * @type {boolean}
     */
    hidden = false;

    /**
     * Constructs drawing properties to be used by the renderer
     * @param {Spritesheet} spritesheet
     * @param {Rectangle2D} bounds
     */
    constructor(spritesheet, bounds) {
        this.spritesheet = spritesheet;
        this.bounds = bounds;
    }
}