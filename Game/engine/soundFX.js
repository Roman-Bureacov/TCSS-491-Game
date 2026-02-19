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
    
     static stop() {
        const audio = ["backgroundMusic1","backgroundMusic2","backgroundMusic2","timeForAdventure"]
        if (!audio) return;
        for (let sound of audio) {
            sounds.get(sound).pause();
        }
        audio.currentTime = 0;
    }

}


// Default sound files.
SoundFX.add("victory", "./Game/assets/soundFx/sounds/VictoryMusic.mp3");
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
SoundFX.add("backgroundMusic1", "./Game/assets/music/backgroundMusic1.mp3", true);
SoundFX.add("backgroundMusic2", "./Game/assets/music/backgroundMusic2.mp3", true);
SoundFX.add("backgroundMusic2", "./Game/assets/music/backgroundMusic2.mp3", true);
SoundFX.add("timeForAdventure", "./Game/assets/music/timeForAdventure.mp3", true);
SoundFX.add("femaleHurt1", "./Game/assets/soundFx/characterSFX/FemaleHurt1.mp3");
SoundFX.add("femaleHurt2", "./Game/assets/soundFx/characterSFX/FemaleHurt2.mp3");
SoundFX.add("femaleHurt3", "./Game/assets/soundFx/characterSFX/FemaleHurt3.mp3");
SoundFX.add("femaleHurt4", "./Game/assets/soundFx/characterSFX/FemaleHurt4.mp3");
SoundFX.add("femaleHurt5", "./Game/assets/soundFx/characterSFX/FemaleHurt5.mp3");
SoundFX.add("femaleHurt6", "./Game/assets/soundFx/characterSFX/FemaleHurt6.mp3");
SoundFX.add("femaleHurt7", "./Game/assets/soundFx/characterSFX/FemaleHurt7.mp3");
SoundFX.add("femaleDeath1", "./Game/assets/soundFx/characterSFX/femaleDeath1.mp3")
SoundFX.add("femaleDeath2", "./Game/assets/soundFx/characterSFX/femaleDeath2.mp3")
SoundFX.add("femaleDeath3", "./Game/assets/soundFx/characterSFX/femaleDeath3.mp3")
SoundFX.add("femaleDeath4", "./Game/assets/soundFx/characterSFX/femaleDeath4.mp3")
SoundFX.add("femaleDeath5", "./Game/assets/soundFx/characterSFX/femaleDeath5.mp3")
SoundFX.add("maleDeath1", "./Game/assets/soundFx/characterSFX/maleDeath1.mp3")
SoundFX.add("maleDeath2", "./Game/assets/soundFx/characterSFX/maleDeath2.mp3")
SoundFX.add("maleDeath3", "./Game/assets/soundFx/characterSFX/maleDeath3.mp3")
SoundFX.add("maleDeath4", "./Game/assets/soundFx/characterSFX/maleDeath4.mp3")
SoundFX.add("maleDeath5", "./Game/assets/soundFx/characterSFX/maleDeath5.mp3")
SoundFX.add("maleHurt1", "./Game/assets/soundFx/characterSFX/MaleHurt1.mp3");
SoundFX.add("maleHurt2", "./Game/assets/soundFx/characterSFX/MaleHurt2.mp3");
SoundFX.add("maleHurt3", "./Game/assets/soundFx/characterSFX/MaleHurt3.mp3");
SoundFX.add("maleHurt4", "./Game/assets/soundFx/characterSFX/MaleHurt4.mp3");
SoundFX.add("maleHurt5", "./Game/assets/soundFx/characterSFX/MaleHurt5.mp3");
SoundFX.add("maleHurt6", "./Game/assets/soundFx/characterSFX/MaleHurt6.mp3");
SoundFX.add("maleHurt7", "./Game/assets/soundFx/characterSFX/MaleHurt7.mp3");


