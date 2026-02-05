'use strict';


import {collision_detection as CollisionDetection} from "./CollisionDetection.js";

export class BoundingBox {
    constructor(x, y, width, height) {
        Object.assign(this, {x,y, width, height});
    }

    /**
     * 
     * @param {BoundingBox} other
     * @returns {boolean}
     */
    collide(other) {
        return CollisionDetection.does_collide_boxes(this.width, this.height, this.x, this.y, other.width, other.height, other.x, other.y)
    }

}