'use strict';
import {BackgroundFactory} from "./backgroundFactory.js";

export class ArenaFactory {

    /**
     * Constructs the arena factory object
     * @param theTileSheet The tile asset sheet path
     * @param arenaBackgroundPath The path to the arena background
     * @param arenaName The name of the arena
     * @param tileWidth The width of the tileSet
     * @param tileHeight The height of the tileSet
     * @param assetManager
     * @param gameEngine
     * @param canvasH
     * @param canvasW
     */
    constructor(theTileSheet, arenaBackgroundPath, arenaName, tileWidth, tileHeight, assetManager, gameEngine, canvasW, canvasH) {

        Object.assign(this, {
            theTileSheet,
            arenaName,
            tileWidth,
            tileHeight,
            assetManager,
            gameEngine,
            canvasH,
            canvasW
        });


        this.tileCols = canvasW / this.tileWidth;
        this.tileRows = canvasH / this.tileHeight;


        // In ArenaFactory constructor (remove the assetManager.downloadAll(...) wrapper)

        const bgImg = new Image();
        bgImg.onload = () => {
            this.bgImg = bgImg;
            // IMPORTANT: add background FIRST so it draws behind everything
            this.gameEngine.addEntity(new BackgroundFactory(bgImg))
        };

        bgImg.onerror = () => console.error("Background failed to load:", arenaBackgroundPath);
        bgImg.src = arenaBackgroundPath;


    }

    srcRect(theTileID) {
        const cols = Math.floor(this.theTileSheet.width / this.tileWidth);
        if (!cols) throw new Error("Tileset image not loaded yet (width=0).");

        const sx = (theTileID % cols) * this.tileWidth;
        const sy = Math.floor(theTileID / cols) * this.tileHeight;

        return {sx, sy, sw: this.tileWidth, sh: this.tileHeight};
    }


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
}

/**
 * Parses the arena map text file into tiles given the passed legend and the map text.
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

    update() {
        // no-op (static background)
    }

    draw(ctx) {
        this.factory.draw(ctx, this.map);

    }
}

