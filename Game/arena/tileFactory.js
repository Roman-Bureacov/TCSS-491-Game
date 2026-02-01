/*
this file has code for creating tiles

 */

import {StaticEntity} from "../character/entity.js";
import {AssetManager} from "../assets/assetmanager.js";
import {Spritesheet} from "../character/animation.js";
import {IndustrialTileFactory} from "./tilesets/factoryTileSet.js";

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
        A : "tileA"
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
            case TileFactory.setName.A:
                return IndustrialTileFactory.makeTile(tileName);
        }
    }
}