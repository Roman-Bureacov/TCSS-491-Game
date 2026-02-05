'use strict';

/**
 * @author Kassie Whitney
 */
export class collision_detection {
    /**
     * Checks if there is a collision detection using a circle
     *
     * @param {Number} charW Character Width
     * @param {Number} charH Character Height
     * @param {Number} charX Character x position
     * @param {Number} charY Character y position
     * @param {Number} objW Objects width
     * @param {Number} objH objects height
     * @param {Number} objX objects x position
     * @param {Number} objY objects y position
     * @returns {boolean} true if collision is detected false otherwise.
     */
    static does_collide_circle(charW, charH, charX, charY, objW, objH, objX, objY) {
        const char_radius = 0.5 * Math.max(charW, charH);
        const obj_radius = 0.5 * Math.max(objW, objH);

        const circle1 = {radius: char_radius, x: charX + charW / 2, y: charY + charH / 2};
        const circle2 = {radius: obj_radius, x: objX + objW / 2, y: objY + objY / 2};

        const dx = circle1.x - circle2.x;
        const dy = circle1.y - circle2.y;

        const distance = Math.sqrt(dx ** 2 + dy ** 2)

        return distance < circle1.radius + circle2.radius;

    }

    /**
     * Checks if there is a collision detection using a box
     *
     * @param {Number} charW Character Width
     * @param {Number} charH Character Height
     * @param {Number} charX Character x position
     * @param {Number} charY Character y position
     * @param {Number} objW Objects width
     * @param {Number} objH objects height
     * @param {Number} objX objects x position
     * @param {Number} objY objects y position
     * @returns {boolean} true if collision is detected false otherwise.
     */
    static does_collide_boxes(charW, charH, charX, charY, objW, objH, objX, objY) {

        const charLeft = charX;
        const charRight = charX + charW;
        const charTop = charY;
        const charBottom = charY + charH;

        const objLeft = objX;
        const objRight = objX + objW;
        const objTop = objY;
        const objBottom = objY + objH;

        if (charLeft > objRight) return false;    // char completely right
        if (charRight < objLeft) return false;    // char completely left
        if (charTop > objBottom) return false;    // char completely under
        if (charBottom < objTop) return false;    // char completely above

        return true;

    }
    
}