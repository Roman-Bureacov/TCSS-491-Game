/**
 * @typedef ArenaData
 * @property {string} [backgroundAssetPath] the relative path to the background image asset
 * @property {string} arenaAssetPath the relative path to the text asset defining the arena
 * @property {string} tileSetPath the relative path to the tile set spritesheet image
 */

import {ArenaFactory} from "./arenaFactory.js";
import {TILESET_NAMES} from "./tileData.js";

/**
 *
 * @type {{[key: ARENAS] : ArenaData}}
 */
export const arenaData = {
    [ArenaFactory.ARENAS.BASIC] : {
        backgroundAssetPath : "background/background03.jpeg",
        arenaAssetPath : "arena/basic.txt",
        tileSetPath : TILESET_NAMES.INDUSTRIAL,
    },
    [ArenaFactory.ARENAS.ARENA2] : {
        backgroundAssetPath : undefined,
        arenaAssetPath : "arena/arena2.txt",
        tileSetPath : TILESET_NAMES.INDUSTRIALB,
    }
}