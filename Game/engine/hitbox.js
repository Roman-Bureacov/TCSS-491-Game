/*
This file has the information for hitboxes
 */

import {MatrixOp} from "../../Matrix/Matrix.js";

/**
 * @typedef IntersectionTestProperties
 * @property {Hitbox} subject the hitbox that initiated the intersection test
 * @property {Hitbox} other the other hitbox that resulted in the intersection
 * @property {number} subjectStartX the start x coordinate of the tester hitbox
 * @property {number} subjectStartY the start y coordinate of the tester hitbox
 * @property {number} subjectEndX the end x coordinate of the tester hitbox
 * @property {number} subjectEndY the end y coordinate of the tester hitbox
 * @property {number} otherStartX the start x coordinate of the testee hitbox
 * @property {number} otherStartY the start y coordinate of the testee hitbox
 * @property {number} otherEndX the end x coordinate of the testee hitbox
 * @property {number} otherEndY the end y coordinate of the testee hitbox
 */

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
     * If this hitbox has expired.
     *
     * @type {boolean} if the hitbox has expired
     */
    expired = false;

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
     * updates the state of this hitbox by the timestep specified.
     *
     * @param {number} timestep the time step in seconds
     */
    update(timestep) {
        // ...
    }

    /**
     * Tests if this hitbox intersects with the other hitbox.
     *
     * Touching edges do not count as intersections.
     *
     * @param {Hitbox} other
     * @return {undefined | IntersectionTestProperties}
     * if the hitboxes intersect: the intersection test properties;
     * otherwise `undefined` (no intersection found)
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

        if (testOverlap(thisStartX, thisEndX, otherStartX, otherEndX)
            && testOverlap(thisStartY, thisEndY, otherStartY, otherEndY)) {
            return {
                subject : this,
                other : other,
                subjectStartX : thisStartX,
                subjectStartY : thisStartY,
                subjectEndX : thisEndX,
                subjectEndY : thisEndY,
                otherStartX : otherStartX,
                otherStartY : otherStartY,
                otherEndX : otherEndX,
                otherEndY : otherEndY
            }
        } else return undefined;
    }

    /**
     * Instructs what happens on intersections with the other hitbox
     * @param {IntersectionTestProperties} properties the properties pertaining to an intersection
     */
    onIntersectionWith(properties) {
        // ...
    }


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
const testOverlap = (a, b, c, d) => {
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

/**
 * Separates the two hitboxes by pushing the subject (the one who found the intersection) from the other
 * (the one who was found to be intersecting with) to solve the intersection.
 * 
 * Note that this assumes that the two boxes are already intersecting.
 *
 * For an illustration on how pushing works, see [this](https://www.desmos.com/calculator/owehi6a6po)
 *
 * The algorithm will solve ambiguous ties on pushing trying to:
 *  1. push down (otherwise push up)
 *  2. push right (otherwise push left)
 *
 * @param {IntersectionTestProperties} properties
 * the properties to work with. The `subject` will be moved to solve the intersection,
 * whereas the `other` will remain stationary.
 */
const separate = (properties) => {

    // we need to find which axis to push on first
    // thinking in top-left origin
    let otherCenterX = (properties.otherStartX + properties.otherEndX) / 2
    let otherCenterY = (properties.otherStartY + properties.otherEndY) / 2
    let subjectCenterX = (properties.subjectStartX + properties.subjectEndX) / 2
    let subjectCenterY = (properties.subjectStartY + properties.subjectEndY) / 2
    let intersectDimX = Math.abs(otherCenterX - subjectCenterX);
    let intersectDimY = Math.abs(otherCenterY - subjectCenterY);

    // we need to push on the greater axis
    let dx = 0;
    let dy = 0
    if (intersectDimX <= intersectDimY) { // we need to push on the y-axis
        if (subjectCenterY > otherCenterY) { // push up
            dy = properties.otherStartY - properties.subjectEndY;
        } else { // push down
            dy = -(properties.subjectStartY - properties.otherEndY)
        }
    } else { // we need to push on the x-axis
        if (subjectCenterX >= otherCenterX) { // push right
            dx = properties.otherEndX - properties.subjectStartX;
        } else { // push left
            dx = -(properties.subjectEndX - properties.otherStartX)
        }
    }

    properties.subject.parent.setObjectPosition(
        properties.subject.parent.objectX() + dx,
        properties.subject.parent.objectY() + dy,
        properties.subject.parent.objectZ()
    )
}

export const HitboxOp = { separate }