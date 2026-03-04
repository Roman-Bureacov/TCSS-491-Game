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
    static ARENAS = Object.freeze({
        ARENA1 : "arena1",
        ARENA2: "arena2"
    });

    constructor() {
        throw new Error("Cannot instantiate factory (anti-pattern)");
    }

    /**
     * Creates an arena
     *
     * @param {ARENAS} name the arena name
     * @return {ArenaProperties} the collection of static entities that make up this arena
     */
    static makeArena(name) {
        let text;

        switch (name) {
            case this.ARENAS.ARENA1 :
                text = AssetManager.getText("arena/arena1.txt");
                break;
            case this.ARENAS.ARENA2:
                text = AssetManager.getText("arena/arena2.txt")
                break;
            default: throw new Error("Unknown arena name " + name);
        }

        let builder = new ArenaParser(text);

        return builder.buildArena();

    }
}


