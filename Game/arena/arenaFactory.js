'use strict';

import {Spritesheet} from "../character/animation.js";

import {Drawable} from "../engine/render/Render.js";
import {StaticEntity} from "../character/entity.js";


/**
 * Factory for building arenas
 *
 * @author Kassie Whitney
 * @author Roman Bureacov
 */
export class ArenaFactory {

    constructor() {
        throw new Error("Cannot instantiate factory (anti-pattern)");
    }


    /**
     * Gets the grid coordinate of the tiles position based on index
     *
     * @param theTileID The tile index value.
     * @returns {{sx: number, sy: number, sw, sh}}
     */
    srcRect(theTileID) {
        const cols = Math.floor(this.theTileSheet.width / this.tileWidth);
        if (!cols) throw new Error("Tileset image not loaded yet (width=0).");

        const sx = (theTileID % cols) * this.tileWidth;
        const sy = Math.floor(theTileID / cols) * this.tileHeight;

        return {sx, sy, sw: this.tileWidth, sh: this.tileHeight};
    }

    /**
     * Draws the tile onto the canvas based on the data in the map
     *
     * @param ctx The canvas context object.
     * @param map The mapping of the tile blocks.
     */
    draw(ctx, map) {
        for (let y = 0; y < this.tileRows; y++) {
            for (let x = 0; x < this.tileCols; x++) {
                const tileId = map[y * this.tileCols + x];
                if (tileId < 0) continue;
                const {sx, sy, sw, sh} = this.srcRect(tileId);

                ctx.drawImage(
                    this.theTileSheet,
                    sx, sy, sw, sh,
                    x * this.tileWidth, y * this.tileHeight,
                    this.tileWidth, this.tileHeight);
            }
        }
    }

    update() {
    }

}


/**
 * Parses the arena map text file into tiles given the passed legend and the map text.
 *
 * @param txt The path to the map text file
 * @param cols The number of columns in the tile set
 * @param rows The number of rows in the tile set
 * @param legend The map translator.
 * @returns {any[]} a 2d array of how the tilesets tile numerical value
 */
export function parseTxtToMap(txt, cols, rows, legend) {
    const lines = txt.replace(/\r/g, "").split("\n"); // KEEP blank lines

    const map = new Array(cols * rows).fill(-1);

    for (let y = 0; y < rows; y++) {
        const line = (lines[y] ?? "").padEnd(cols, " ").slice(0, cols);

        for (let x = 0; x < cols; x++) {
            const ch = line[x];
            map[y * cols + x] = (ch in legend) ? legend[ch] : -1;
        }
    }
    return map;
}

/**
 * Loads the arena map text file
 *
 * @param path The path to the map file
 * @returns {Promise<string>} returns the map file.
 */
export async function loadArenaTxt(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
    return await res.text();
}

/**
 * Gets the tiles based on the current column and row
 */
export class TileMap {
    constructor(factory, map) {
        this.factory = factory;
        this.map = map;
        this.removeFromWorld = false;
    }
}

/**
 * Turns the tilemap into a drawable
 */

export class TileMapDrawable extends StaticEntity {
    /**
     * @param {TileMap} tileMap - your TileMap(factory, map)
     * @param {number} pixelW - canvas width in pixels
     * @param {number} pixelH - canvas height in pixels
     * @param scaleX
     * @param scaleY
     */
    constructor(tileMap, pixelW, pixelH) {
        // 1) draw the entire map into an offscreen canvas
        const offScreenCanvas = document.createElement("canvas");
        offScreenCanvas.width = pixelW;
        offScreenCanvas.height = pixelH;

        const offScreenCtx = offScreenCanvas.getContext("2d");
        offScreenCtx.imageSmoothingEnabled = false;

        // use existing tile renderer
        tileMap.factory.draw(offScreenCtx, tileMap.map);

        // 2) turn that canvas into a 1x1 spritesheet
        const spritesheet = new Spritesheet(offScreenCanvas, 1, 1);

        // 3) make it a Drawable with the same pixel dimensions as the canvas
        super(spritesheet, pixelW, pixelH);


        // 4) choose the only frame
        this.drawingProperties.row = 0;
        this.drawingProperties.col = 0;

    }



    update() {
        // static background; no-op
    }
}


