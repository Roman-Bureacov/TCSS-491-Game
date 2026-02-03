'use strict';

import {Spritesheet} from "../character/animation.js";

import {Drawable} from "../engine/render/Render.js";
import {StaticEntity} from "../character/entity.js";
import {AssetManager} from "../assets/assetmanager.js";
import {ArenaParser} from "./compiler/arenaParser.js";
import {TileFactory} from "./tileFactory.js";


/**
 * Factory for building arenas
 *
 * @author Kassie Whitney
 * @author Roman Bureacov
 */
export class ArenaFactory {

    /**
     * The enumeration of arena names
     * @enum {string}
     */
    static arenas = Object.freeze({
        BASIC : "basicArena"
    });

    constructor() {
        throw new Error("Cannot instantiate factory (anti-pattern)");
    }

    /**
     * Creates an arena
     *
     * @param {string} name the arena name
     * @return {StaticEntity[]} the collection of static entities that make up this arena
     */
    static makeArena(name) {
        let text;
        let tileset;

        switch (name) {
            case this.arenas.BASIC :
                tileset = TileFactory.setName.INDUSTRIAL;
                text = AssetManager.getText("arena/basic.txt");
                break;
            default: throw new Error("Unknown arena name " + name);
        }

        let builder = new ArenaParser(tileset, text);

        return builder.buildArena();

    }
}


