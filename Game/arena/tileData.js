/**
 * @typedef TileData
 * @property {number} rows the number of rows in the spritesheet
 * @property {number} cols the number of columns in the spritesheet
 */

/**
 * The possible tile set names
 * @enum {string}
 * @readonly
 */
export const TILESET_NAMES = Object.freeze({
    INDUSTRIAL: "tileset/Industrial_Tileset/1_Industrial_Tileset_1.png",
    INDUSTRIALB: "tileset/Industrial_Tileset/1_Industrial_Tileset_1B.png"
})

/**
 * 
 * @readonly
 * @type {{[key: TILESET_NAMES]: TileData}}
 */
export const tileData = Object.freeze({
    [TILESET_NAMES.INDUSTRIAL] : {
        rows: 4,
        cols: 6
    },
    [TILESET_NAMES.INDUSTRIALB] : {
        rows: 4,
        cols: 6
    }
})