'use strict';

import {AssetManager} from "../assets/assetmanager.js";
import {ArenaParser} from "./compiler/arenaParser.js";
import {SoundFX} from "../engine/soundFX.js";

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
        BASIC : "basicArena",
        ARENA2: "arena2"
    });

    constructor() {
        throw new Error("Cannot instantiate factory (anti-pattern)");
    }

    /**
     * Creates an arena
     *
     * @param {string} name the arena name
     * @return {ArenaProperties} the collection of static entities that make up this arena
     */
    static makeArena(name) {
        let text;

        switch (name) {
            case this.arenas.BASIC :
                text = AssetManager.getText("arena/basic.txt");
                break;
            case this.arenas.ARENA2:
                text = AssetManager.getText("arena/arena2.txt")
                break;
            default: throw new Error("Unknown arena name " + name);
        }

        let builder = new ArenaParser(text);

        return builder.buildArena();

    }
}


