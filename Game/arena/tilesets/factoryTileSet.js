import {AssetManager} from "../../assets/assetmanager.js";
import {Spritesheet} from "../../character/animation.js";
import {StaticEntity} from "../../character/entity.js";

/**
 * A factory for building tiles of the industrial style.
 *
 * @author Roman Bureacov
 */
export class IndustrialTileFactory {

    /**
     * The spritesheet the tiles from this factory share
     * @type {Spritesheet}
     */
    static #spritesheet = undefined;

    static name = Object.freeze({
        A : "type1",
        B : "type2",
        C : "type3",
        D : "type4",
    })

    constructor() {
        throw new Error("Cannot instantiate factory (anti-pattern)");
    }

    /**
     * Makes the tile from this set.
     * @param {string} name the name of the tile
     */
    static makeTile(name) {
        if (IndustrialTileFactory.#spritesheet === undefined) {
            let img = AssetManager.getAsset("tileset/Industrial_Tileset/1_Industrial_Tileset_1.png");
            IndustrialTileFactory.#spritesheet = new Spritesheet(img, 4, 6)
        }

        let tile = new StaticEntity(IndustrialTileFactory.#spritesheet)

        switch (name) {
            case IndustrialTileFactory.name.A :
                tile.drawingProperties.row = 0;
                tile.drawingProperties.col = 0;
                break;
            case IndustrialTileFactory.name.B :
                tile.drawingProperties.row = 0;
                tile.drawingProperties.col = 1;
                break;
            case IndustrialTileFactory.name.C :
                tile.drawingProperties.row = 0;
                tile.drawingProperties.col = 2;
                break;
            case IndustrialTileFactory.name.D :
                tile.drawingProperties.row = 0;
                tile.drawingProperties.col = 3;
                break;
        }

        return tile;
    }

}