'use strict';


let sounds = new Map();


/**
 * @author Kassie Whitney
 */
export class SoundFX {

    /**
     * Adds the sound to the map for reference
     *
     * @param name The name of the soundFx or background music
     * @param path The relative path to the sound file
     * @param loop True if the soundFx or music needs to loop
     * @author Kassie Whitney
     */
    static add(name, path, loop = false) {
        const audio = new Audio(path);
        audio.preload = "auto";
        audio.loop = loop;
        sounds.set(name, audio);
    }

    static play(name, restart = true) {
        const audio = sounds.get(name);
        if (!audio) throw new Error(`Unknown sound: ${name}`);
        if (restart) audio.currentTime = 0;

        const p = audio.play();
        if (p && typeof p.catch === "function") {
            p.catch(err => console.warn("Audio play blocked (need users action):", err));
        }
    }

    static pause(name) {
        const audio = this.sounds.get(name);
        if (a) audio.pause();
    }

    static stop(name) {
        const audio = this.sounds.get(name);
        if (!audio) return;
        audio.pause();
        audio.currentTime = 0;
    }

    static _clamp(x) {
        return Math.max(0, Math.min(1, x));
    }

}


// Default sound files.
SoundFX.add("swordCollide", "./Game/assets/soundFx/swordSFX/8swordCollide7.mp3");
SoundFX.add("heavySwordSwoosh1", "./Game/assets/soundFx/swordSFX/heavySwordSwoosh1.mp3");
SoundFX.add("heavySwordSwoosh2", "./Game/assets/soundFx/swordSFX/heavySwordSwoosh2.mp3");
SoundFX.add("heavySwordSwoosh3", "./Game/assets/soundFx/swordSFX/heavySwordSwoosh3.mp3");
SoundFX.add("quickSwordSwoosh1", "./Game/assets/soundFx/swordSFX/quickSwordSwoosh1.mp3");
SoundFX.add("quickSwordSwoosh2", "./Game/assets/soundFx/swordSFX/quickSwordSwoosh2.mp3");
SoundFX.add("swordCollide1", "./Game/assets/soundFx/swordSFX/swordCollide1.mp3");
SoundFX.add("swordCollide2", "./Game/assets/soundFx/swordSFX/swordCollide2.mp3");
SoundFX.add("swordCollide3", "./Game/assets/soundFx/swordSFX/swordCollide3.mp3");
SoundFX.add("swordCollide4", "./Game/assets/soundFx/swordSFX/swordCollide4.mp3");
SoundFX.add("swordCollide5", "./Game/assets/soundFx/swordSFX/swordCollide5.mp3");
SoundFX.add("swordCollide6", "./Game/assets/soundFx/swordSFX/swordCollide6.mp3");
SoundFX.add("swordCollide7", "./Game/assets/soundFx/swordSFX/swordCollide7.mp3");
SoundFX.add("swordCollide8", "./Game/assets/soundFx/swordSFX/swordCollide8.mp3");
SoundFX.add("backgroundMusic1", "./Game/assets/music/backgroundMusic1.mp3", {loop: true});
SoundFX.add("backgroundMusic2", "./Game/assets/music/backgroundMusic2.mp3", {loop: true});
SoundFX.add("backgroundMusic2", "./Game/assets/music/backgroundMusic2.mp3", {loop: true});
SoundFX.add("timeForAdventure", "./Game/assets/music/timeForAdventure.mp3", {loop: true});

