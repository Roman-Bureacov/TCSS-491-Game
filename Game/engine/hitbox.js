/*
This file has the information for hitboxes
 */

import {MatrixOp} from "../../Matrix/Matrix.js";
import {DIRECTIONS} from "./constants.js";

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
     * If a hitbox expires before the game engine gets to
     * updating it and removing it, the intersection test will
     * automatically fail.
     *
     * @param {Hitbox} other
     * @return {undefined | IntersectionTestProperties}
     * if the hitboxes intersect: the intersection test properties;
     * otherwise `undefined` (no intersection found)
     */
    intersects(other) {
        if (this.expired) return undefined;

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
    resolveIntersection(properties) {
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
 * For an illustration on how pushing works, see [this](https://www.desmos.com/calculator/zclnpnrjoh)
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

    // find point vectors, from center of other to start/end points of subject
    let vectorStartX = properties.subjectStartX - otherCenterX;
    let vectorStartY = properties.subjectStartY - otherCenterY;
    let vectorEndX = properties.subjectEndX - otherCenterX;
    let vectorEndY = properties.subjectEndY - otherCenterY;

    let pushDirection;

    // do we need to use bias?
    if (vectorStartX * vectorEndX * vectorStartY * vectorEndY >= 0) {
        // if they disagree or agree on both, use bias

        // find bias vector
        let subjectClosestX = (
            subjectCenterX < otherCenterX
        ) ? properties.subjectEndX : properties.subjectStartX;

        let subjectClosestY = (
            subjectCenterY < otherCenterY
        ) ? properties.subjectStartY : properties.subjectEndY

        let vectorBiasX = subjectClosestX - otherCenterX;
        let vectorBiasY = subjectClosestY - otherCenterY;
        if (vectorBiasX === 0) {
            vectorBiasX = (
                otherCenterX < subjectCenterX
            ) ? -Number.EPSILON : Number.EPSILON;
        }
        if (vectorBiasY === 0) {
            vectorBiasY = (
                subjectCenterY >= otherCenterY
            ) ? -Number.EPSILON : Number.EPSILON;
        }

        if (vectorStartX * vectorEndX <= 0 && vectorStartY * vectorEndY <= 0) {
            // both vectors disagree on both axis, use smaller component of bias to decide
            // then push in that opposite direction
            if (Math.abs(vectorBiasX) < Math.abs(vectorBiasY)) { // y-axis as tie-breaker
                pushDirection = ( // right as tie-breaker
                    vectorBiasX < 0
                ) ? DIRECTIONS.RIGHT : DIRECTIONS.LEFT;
            } else {
                pushDirection = ( // down as tie-breaker
                    vectorBiasY <= 0
                ) ? DIRECTIONS.UP : DIRECTIONS.DOWN;
            }
        } else {
            // both vectors agree on both axis, use bigger component of bias to decide
            if (Math.abs(vectorBiasX) <= Math.abs(vectorBiasY)) { // y-axis as tie-breaker
                pushDirection = ( // down as tie-breaker
                    vectorBiasY > 0
                ) ? DIRECTIONS.UP : DIRECTIONS.DOWN;
            } else {
                pushDirection = ( // right as tie-breaker
                    vectorBiasX >= 0
                ) ? DIRECTIONS.RIGHT : DIRECTIONS.LEFT;
            }
        }
        
    } else {
        if (vectorStartX * vectorEndX <= 0) { // disagree on X, y-axis as tie-breaker
            pushDirection = ( // down as tie-breaker
                vectorStartY > 0
            ) ? DIRECTIONS.UP : DIRECTIONS.DOWN;
        } else { // disagree on Y
            pushDirection = ( // right as tie-breaker
                vectorStartX < 0
            ) ? DIRECTIONS.LEFT : DIRECTIONS.RIGHT;
        }
    }

    let dx = 0;
    let dy = 0
    switch (pushDirection) {
        case DIRECTIONS.UP:
            dy = properties.otherStartY - properties.subjectEndY;
            break;
        case DIRECTIONS.DOWN:
            dy = -(properties.subjectStartY - properties.otherEndY)
            break;
        case DIRECTIONS.LEFT:
            dx = -(properties.subjectEndX - properties.otherStartX)
            break;
        case DIRECTIONS.RIGHT:
            dx = properties.otherEndX - properties.subjectStartX;
            break;
    }

    properties.subject.parent.setObjectPosition(
        properties.subject.parent.objectX() + dx,
        properties.subject.parent.objectY() + dy,
        properties.subject.parent.objectZ()
    )
}

export const HitboxOp = { separate }