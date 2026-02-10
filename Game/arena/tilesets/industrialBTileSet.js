import {AssetManager} from "../../assets/assetmanager.js";
import {Spritesheet} from "../../entity/animation.js";
import {StaticEntity} from "../../entity/entity.js";
import {alphabetize, standardizeNames} from "../tileFactory.js";
import {TileEntity} from "../../entity/tileEntity.js";

/**
 * A factory for building tiles of the industrial style.
 *
 * Builds tiles with respect to `1_Industrial_Tileset_1.png`
 *
 * @author Roman Bureacov
 */
export class IndustrialBTileFactory {

    /**
     * Flag for if this factory needs to build its dependencies
     * @type {boolean}
     */
    static isBuilt = false;

    /**
     * The names for each tile in this set
     * @enum {string}
     */
    static tileNames;

    /**
     * The spritesheet the tiles from this factory share
     * @type {Spritesheet}
     */
    static #spritesheet = undefined;

    constructor() {
        throw new Error("Cannot instantiate factory (anti-pattern)");
    }

    /**
     * Makes the tile from this set.
     * @param {string} name the name of the tile
     * @return {TileEntity} the new tile entity
     */
    static makeTile(name) {
        this.buildSelf();

        let tile = new TileEntity(IndustrialBTileFactory.#spritesheet)
        let frame = this.tileNames[name];
        tile.drawingProperties.spriteRow = frame[0];
        tile.drawingProperties.spriteCol = frame[1];

        return tile;
    }

    /**
     * Builds self dependencies, otherwise returns early if already constructed
     */
    static buildSelf() {
        if (this.isBuilt) return;

        let rows = 4;
        let columns = 6;
        let img = AssetManager.getAsset("tileset/Industrial_Tileset/1_Industrial_Tileset_1B.png");
        IndustrialBTileFactory.#spritesheet = new Spritesheet(img, rows, columns);

        this.tileNames = alphabetize(rows, columns);

        this.isBuilt = true;
    }
}