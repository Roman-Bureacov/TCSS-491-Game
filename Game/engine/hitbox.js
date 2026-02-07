/*
This file has the information for hitboxes
 */

import {MatrixOp} from "../../Matrix/Matrix.js";

/**
 * Class that represents a hitbox on the x and y plane
 *
 * @author Roman Bureacov
 */
export class Hitbox {
    /**
     * The parent of this hitbox
     * @type {SpaceObject}
     */
    parent;

    /**
     * The bounds of this hitbox
     * @type {Rectangle2D}
     */
    bounds;

    /**
     * Creates a hitbox
     * @param {SpaceObject} parent the parent of this hitbox
     * @param {Rectangle2D} bounds the bounds for this hitbox
     */
    constructor(parent, bounds) {
       this.parent = parent;
       this.bounds = bounds;
    }

    /**
     * Tests if this hitbox intersects with the other hitbox.
     *
     * Touching edges do not count as intersections.
     *
     * @param {Hitbox} other
     * @return {boolean} if this hitbox intersects with the other
     */
    intersects(other) {
        let thisStart = MatrixOp.multiply(this.parent.transform, this.bounds.start);
        let thisEnd = MatrixOp.multiply(this.parent.transform, this.bounds.end);
        let thisStartX = thisStart.get(0, 0);
        let thisStartY = thisStart.get(1, 0);
        let thisEndX = thisEnd.get(0, 0);
        let thisEndY = thisEnd.get(1, 0);
        
        
        let otherStart = MatrixOp.multiply(other.parent.transform, other.bounds.start);
        let otherEnd = MatrixOp.multiply(other.parent.transform, other.bounds.end);
        let otherStartX = otherStart.get(0, 0);
        let otherStartY = otherStart.get(1, 0);
        let otherEndX = otherEnd.get(0, 0);
        let otherEndY = otherEnd.get(1, 0);

        // Separating Axis Theorem: https://dyn4j.org/2010/01/sat/
        // we may simplify the projection part by assuming that all rectangles are going to be axis-aligned

        return Hitbox.#testOverlap(thisStartX, thisEndX, otherStartX, otherEndX)
            && Hitbox.#testOverlap(thisStartY, thisEndY, otherStartY, otherEndY);

    }

    /**
     * Instructs what happens on intersections with the other hitbox
     * @param {Hitbox} other the hitbox intersected with
     */
    onIntersectionWith(other) {
        // ...
    }

    /**
     * Tests if two projected lines intersect
     *
     * Touching points do not count as an intersection
     *
     * For illustration, see [this](https://www.desmos.com/calculator/frrxrpi9vb)
     *
     * @param {number} a the start of the first line
     * @param {number} b the end of the first line
     * @param {number} c the start of the second line
     * @param {number} d the end of the second line
     * @return {boolean} if the lines intersect
     */
    static #testOverlap(a, b,
                          c, d) {
        // algorithm only works if a <= b and c <= d
        let temp;
        if (b < a) {
            temp = a;
            a = b;
            b = temp;
        }
        if (d < c) {
            temp = d;
            d = c;
            c = temp;
        }


        // if a < c, then c < b for overlap
        // otherwise
        // if a = c, then b = d for overlap
        // else it is c < a, then a < d for overlap
        return a < c ? c < b
            : a === c && b === d
            || a < d;
    }
}