'use strict';

class BackgroundFactory {
    constructor(theImg) {
        this.img = theImg;
        this.removeFromWorld = false;
    }
    update() {};

    draw(ctx) {

        ctx.drawImage(this.img, 0, 0, ctx.canvas.width, ctx.canvas.height);
    }
}