/*
this file has code for creating tiles

 */

import {IndustrialTileFactory} from "./tilesets/industrialTileSet.js";
import {IndustrialBTileFactory} from "./tilesets/industrialBTileSet.js";
import {TileEntity} from "../entity/tileEntity.js";
import {Spritesheet} from "../entity/animation.js";
import {AssetManager} from "../assets/assetmanager.js";
import {tileData} from "./tileData.js";

/**
 * A static factory class that makes static tile objects.
 *
 * @author Roman Bureacov
 */
export class TileFactory {

    /**
     * the collection of spritesheets
     * @type {{string : Spritesheet[]}}
     */
    static spritesheetCache = {}

    /**
     * the mapping of alphabetic characters to an index
     * @type {{string : number}}
     * @readonly
     */
    static alphaNumber = {}

    static {
        const tileAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        for (let i = 0; i < tileAlphabet.length; i++) {
            this.alphaNumber[tileAlphabet.charAt(i)] = i;
        }
    }

    constructor() {
        throw new Error("Cannot instantiate factory (anti-pattern)");
    }

    /**
     * Creates a tile entity
     *
     * @see {TILESET_NAMES}
     *
     * @param {string} setName the name of the tile set
     * @param {string} name the alphabetic tile name
     * @return {TileEntity} the resulting tile entity
     */
    static makeTile(setName, name) {
        let tile = new TileEntity(TileFactory.getSpritesheet(setName))
        let data = tileData[setName];
        let row = Math.floor(TileFactory.alphaNumber[name] / data.rows);
        let col = TileFactory.alphaNumber[name] % data.rows;
        tile.drawingProperties.spriteRow = row;
        tile.drawingProperties.spriteCol = col;

        return tile;
    }

    /**
     * Gets the spritesheet object associated with the set
     *
     * @see {TILESET_NAMES}
     *
     * @param {string} setName
     * @return {Spritesheet}
     */
    static getSpritesheet(setName) {
        let spritesheet = TileFactory.spritesheetCache[setName];
        if (spritesheet) return spritesheet;

        TileFactory.makeSpritesheet(setName);
        return TileFactory.spritesheetCache[setName];
    }

    /**
     * Creates a spritesheet and puts it in the cache
     *
     * @see {TILESET_NAMES}
     *
     * @param {string} setName
     */
    static makeSpritesheet(setName) {
        const data = tileData[setName];
        TileFactory.spritesheetCache[setName] = new Spritesheet(
            AssetManager.getAsset(setName),
            data.rows, data.cols
        )
    }
}

/**
 * creates a map of a tile alphabet to matrix row column
 * @param rows the number of rows to consider
 * @param columns the number of columns to consider
 * @return {Object} the mapping of an alphabet to a 2-element list [row: number, column: number]
 */
export const alphabetize = (rows, columns) => {
    const tileAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let index = 0;

    let map = {}

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            map[tileAlphabet.charAt(index++)] = [r, c];
        }
    }

    return map;
}