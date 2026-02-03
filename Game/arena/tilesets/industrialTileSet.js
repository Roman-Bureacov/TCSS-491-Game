import {AssetManager} from "../../assets/assetmanager.js";
import {Spritesheet} from "../../character/animation.js";
import {StaticEntity} from "../../character/entity.js";

/**
 * A factory for building tiles of the industrial style.
 *
 * Builds tiles with respect to `1_Industrial_Tileset_1.png`
 *
 * @author Roman Bureacov
 */
export class IndustrialTileFactory {

    /**
     * The spritesheet the tiles from this factory share
     * @type {Spritesheet}
     */
    static #spritesheet = undefined;

    /**
     * The names for each tile in this set
     * @enum {string}
     */
    static name = Object.freeze({
        // row 1
        PLAT_LEFT : "platform1",
        PLAT_MID : "platform2",
        PLAT_RIGHT : "platform3",
        PLAT_SINGLE : "platform4",
        
        INNER_WALL_A1 : "type1",
        INNER_WALL_A2 : "type2",
        
        // row 2
        BLOCK_TOP_LEFT : "block1",
        BLOCK_TOP_MID : "block2",
        BLOCK_TOP_RIGHT : "block3",
        
        COL_TOP : "col1",
        
        INNER_WALL_B1 : "type3",
        INNER_WALL_B2 : "type4",
        
        // row 3
        BLOCK_MID_LEFT : "block4",
        BLOCK_MID_MID : "block5",
        BLOCK_MID_RIGHT : "block6",

        COL_MID : "col2",

        INNER_WALL_C1 : "type5",
        INNER_WALL_C2 : "type6",
        
        // row 4
        BLOCK_BOT_LEFT : "block7",
        BLOCK_BOT_MID : "block8",
        BLOCK_BOT_RIGHT : "block9",

        COL_BOT : "col3",

        INNER_WALL_D1 : "type7",
        INNER_WALL_D2 : "type8",
        
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
            // row 1
            case IndustrialTileFactory.name.PLAT_LEFT :
                tile.drawingProperties.row = 0;
                tile.drawingProperties.col = 0;
                break;
            case IndustrialTileFactory.name.PLAT_MID :
                tile.drawingProperties.row = 0;
                tile.drawingProperties.col = 1;
                break;
            case IndustrialTileFactory.name.PLAT_RIGHT :
                tile.drawingProperties.row = 0;
                tile.drawingProperties.col = 2;
                break;
            case IndustrialTileFactory.name.PLAT_SINGLE :
                tile.drawingProperties.row = 0;
                tile.drawingProperties.col = 3;
                break;
            case IndustrialTileFactory.name.INNER_WALL_A1 :
                tile.drawingProperties.row = 0;
                tile.drawingProperties.col = 4;
                break;
            case IndustrialTileFactory.name.INNER_WALL_A2 :
                tile.drawingProperties.row = 0;
                tile.drawingProperties.col = 5;
                break;
            // row 2
            case IndustrialTileFactory.name.BLOCK_TOP_LEFT:
                tile.drawingProperties.row = 1;
                tile.drawingProperties.col = 0;
                break;
            case IndustrialTileFactory.name.BLOCK_TOP_MID:
                tile.drawingProperties.row = 1;
                tile.drawingProperties.col = 1;
                break;
            case IndustrialTileFactory.name.BLOCK_TOP_RIGHT:
                tile.drawingProperties.row = 1;
                tile.drawingProperties.col = 2;
                break;
            case IndustrialTileFactory.name.COL_TOP:
                tile.drawingProperties.row = 1;
                tile.drawingProperties.col = 3;
                break;
            case IndustrialTileFactory.name.INNER_WALL_B1 :
                tile.drawingProperties.row = 1;
                tile.drawingProperties.col = 4;
                break;
            case IndustrialTileFactory.name.INNER_WALL_B2 :
                tile.drawingProperties.row = 1;
                tile.drawingProperties.col = 5;
                break;
            // row 3
            case IndustrialTileFactory.name.BLOCK_MID_LEFT:
                tile.drawingProperties.row = 2;
                tile.drawingProperties.col = 0;
                break;
            case IndustrialTileFactory.name.BLOCK_MID_MID:
                tile.drawingProperties.row = 2;
                tile.drawingProperties.col = 1;
                break;
            case IndustrialTileFactory.name.BLOCK_MID_RIGHT:
                tile.drawingProperties.row = 2;
                tile.drawingProperties.col = 2;
                break;
            case IndustrialTileFactory.name.COL_MID:
                tile.drawingProperties.row = 2;
                tile.drawingProperties.col = 3;
                break;
            case IndustrialTileFactory.name.INNER_WALL_C1 :
                tile.drawingProperties.row = 2;
                tile.drawingProperties.col = 4;
                break;
            case IndustrialTileFactory.name.INNER_WALL_C2 :
                tile.drawingProperties.row = 2;
                tile.drawingProperties.col = 5;
                break;
            // row 4
            case IndustrialTileFactory.name.BLOCK_BOT_LEFT:
                tile.drawingProperties.row = 3;
                tile.drawingProperties.col = 0;
                break;
            case IndustrialTileFactory.name.BLOCK_BOT_MID:
                tile.drawingProperties.row = 3;
                tile.drawingProperties.col = 1;
                break;
            case IndustrialTileFactory.name.BLOCK_BOT_RIGHT:
                tile.drawingProperties.row = 3;
                tile.drawingProperties.col = 2;
                break;
            case IndustrialTileFactory.name.COL_BOT:
                tile.drawingProperties.row = 3;
                tile.drawingProperties.col = 3;
                break;
            case IndustrialTileFactory.name.INNER_WALL_D1 :
                tile.drawingProperties.row = 3;
                tile.drawingProperties.col = 4;
                break;
            case IndustrialTileFactory.name.INNER_WALL_D2 :
                tile.drawingProperties.row = 3;
                tile.drawingProperties.col = 5;
                break;
        }

        return tile;
    }

}