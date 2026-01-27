'use strict';

/**
 * @author Kassie Whitney
 */
export class SoundFX {
    constructor({masterVolume = 1.0} = {}) {
        this.masterVolume = masterVolume;
        this.sounds = new Map();

        this.add("swordCollide", "./assets/soundFx/swordSFX/8swordCollide7.mp3");
        this.add("heavySwordSwoosh1", "./assets/soundFx/swordSFX/heavySwordSwoosh1.mp3");
        this.add("heavySwordSwoosh2", "./assets/soundFx/swordSFX/heavySwordSwoosh2.mp3");
        this.add("heavySwordSwoosh3", "./assets/soundFx/swordSFX/heavySwordSwoosh3.mp3");
        this.add("quickSwordSwoosh1", "./assets/soundFx/swordSFX/quickSwordSwoosh1.mp3");
        this.add("quickSwordSwoosh2", "./assets/soundFx/swordSFX/quickSwordSwoosh2.mp3");
        this.add("swordCollide1", "./assets/soundFx/swordSFX/swordCollide1.mp3");
        this.add("swordCollide2", "./assets/soundFx/swordSFX/swordCollide2.mp3");
        this.add("swordCollide3", "./assets/soundFx/swordSFX/swordCollide3.mp3");
        this.add("swordCollide4", "./assets/soundFx/swordSFX/swordCollide4.mp3");
        this.add("swordCollide5", "./assets/soundFx/swordSFX/swordCollide5.mp3");
        this.add("swordCollide6", "./assets/soundFx/swordSFX/swordCollide6.mp3");
        this.add("swordCollide7", "./assets/soundFx/swordSFX/swordCollide7.mp3");
        this.add("swordCollide8", "./assets/soundFx/swordSFX/swordCollide8.mp3");
        this.add("backgroundMusic1" , "./assets/music/backgroundMusic1.mp3");
        this.add("backgroundMusic2" , "./assets/music/backgroundMusic2.mp3");
        this.add("backgroundMusic2" , "./assets/music/backgroundMusic2.mp3");
        this.add("timeForAdventure","./assets/music/timeForAdventure.mp3" );
    }

    add(name, path, {volume = 1.0, loop = false} = {}) {
        const audio = new Audio(path);
        audio.preload = "auto";
        audio.loop = loop;
        audio.volume = this._clamp(volume * this.masterVolume);
        this.sounds.set(name, audio);
    }

    play(name, {restart = true} = {}) {
        const audio = this.sounds.get(name);
        if (!audio) throw new Error(`Unknown sound: ${name}`);
        if (restart) audio.currentTime = 0;

        const p = audio.play();
        if (p && typeof p.catch === "function") {
            p.catch(err => console.warn("Audio play blocked (need users action):", err));

        }
    }

    pause(name) {
        const audio = this.sounds.get(name);
        if (a) audio.pause();
    }

    stop(name) {
        const audio = this.sounds.get(name);
        if (!audio) return;
        audio.pause();
        audio.currentTime = 0;
    }

    setMasterVolume(volumeValue) {
        this.masterVolume = this._clamp(volumeValue);
        for (const a of this.sounds.values()) {
            a.volume = this._clamp(a.volume);
        }
    }

    _clamp(x) {
        return Math.max(0, Math.min(1, x));
    }

}


