/*
this file has code for creating tiles

 */

import {StaticEntity} from "../character/entity.js";
import {AssetManager} from "../assets/assetmanager.js";
import {Spritesheet} from "../character/animation.js";
import {IndustrialTileFactory} from "./tilesets/industrialTileSet.js";

/**
 * A static factory class that makes static tile objects.
 *
 * @author Roman Bureacov
 */
export class TileFactory {

    /**
     * The enumeration of the tile set names.
     * @readonly
     * @enum {string}
     */
    static setName = Object.freeze( {
        INDUSTRIAL : "industrial"
    })

    constructor() {
        throw new Error("Cannot instantiate factory (anti-pattern)");
    }

    /**
     * Constructs a tile static entity
     * @param {string} setName the name of the tile set
     * @param {string} tileName the name of tile type
     * @return {StaticEntity} the tile entity
     */
    static makeTile(setName, tileName) {
        switch (setName) {
            case TileFactory.setName.INDUSTRIAL:
                return IndustrialTileFactory.makeTile(tileName);
        }
    }
}

/**
 * standardizes the names by mapping a capital alphabetic
 * character to each name
 * @param {Object} names the names
 * @return {Readonly<Object>} the standardized names
 */
export const standardizeNames = (names) => {
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let index = 0;
    let standardized = {};

    for (let name in names) {
        standardized[characters.charAt(index++)] = names[name];
        if (index >= characters.length) break;
    }

    return Object.freeze(standardized);
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