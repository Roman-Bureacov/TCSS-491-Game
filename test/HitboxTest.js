import test from "node:test";
import { strictEqual } from "node:assert/strict";
import { Hitbox } from "../Game/engine/hitbox.js";
import {Rectangle2D} from "../Game/engine/primitives.js";
import {SpaceObject} from "../Game/engine/render/Render.js";

const parent = new SpaceObject();

/**
 * Creates a hitbox at x and y with dimension 1 x 1
 * @param {number} x the x coordinate
 * @param {number} y the y coordinate
 * @return {Hitbox} the
 */
const make = (x, y) => {
    return new Hitbox(parent, new Rectangle2D(x, y, 1, 1))
}

const intersectFalseString = "h1 intersect h2 is not false";
const intersectTrueString = "h1 intersect h2 is not true";

test("two touching non-overlapping hitboxes", () => {
    let h1 = make(0, 0,);
    let h2 = make(1, 0);

    let points = [
        // note that the edges do touch, but 
        // they aren't counted as "overlapping"
        [-1, 1], [0, 1], [1, 1],
        [-1, 0],         [1, 0],
        [-1,-1], [0,-1], [1,-1]
    ]

    for (let point of points) {
        h2.bounds.setStart(point[0], point[1]);
        strictEqual(h1.intersects(h2), false, intersectFalseString);
    }
})

test("two non-overlapping hitboxes", () => {
    let h1 = make(0, 0,);
    let h2 = make(1, 0);

    let points = [
        [-2, 2], [0, 2], [2, 2],
        [-2, 0],         [2, 0],
        [-2,-2], [0,-2], [2,-2]
    ]

    for (let point of points) {
        h2.bounds.setStart(point[0], point[1]);
        strictEqual(h1.intersects(h2), false, intersectFalseString);
    }
})

test("two overlapping hitboxes", () => {
    let h1 = make(0, 0);
    let h2 = make(0, 0);

    let points = [
        [-0.5, 0.5], [0, 0.5], [0.5, 0.5],
        [-0.5,   0],           [0.5,   0],
        [-0.5,-0.5], [0,-0.5], [0.5,-0.5]
    ]

    for (let point of points) {
        h2.bounds.setStart(point[0], point[1]);
        strictEqual(h1.intersects(h2), true, intersectTrueString);
    }
})