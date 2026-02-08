/**
 * Static class that manages assets
 *
 * @author (original author undocumented)
 * @author Roman Bureacov
 */
export class AssetManager {

    static #root = new URL("./", import.meta.url);

    static {
        this.successCount = 0;
        this.errorCount = 0;
        this.imageCache = [];
        this.audioCache = [];
        this.textCache = [];
        this.downloadQueue = [];
    }

    static #resolve(path) {
        return new URL(path, AssetManager.#root).href;
    }

    /**
     * Queue the download of a file
     * @param path the path relative to where the asset manager lives
     */
    static queueDownload(path) {
        let resolvedPath = AssetManager.#resolve(path);
        console.log("Queueing " + resolvedPath);
        this.downloadQueue.push([path, resolvedPath]);
    };

    /**
     * If the queue is downloaded
     * @returns {boolean} if the queue is downloaded
     */
    static isDone() {
        return this.downloadQueue.length === this.successCount + this.errorCount;
    };

    /**
     * Downloads the assets queued
     * @param callback the callback to fire when finished
     */
    static downloadAll(callback) {
        // if (this.downloadQueue.length === 0) setTimeout(callback, 10);

        Promise.all(
            this.downloadQueue.map(paths => new Promise((res, rej) => {

                let [relativePath, absolutePath] = paths;

                let file;
                const successMsg = () => {
                    this.successCount++;
                    console.log("Loaded " + file.src);
                    res(file);
                };
                const failMsg = () => {
                    this.errorCount++;
                    console.log("Error loading " + file.src);
                    rej(file);
                };

                const ext = relativePath.split(".").pop().toLowerCase();
                console.log("Loading... " + absolutePath);

                switch(ext) {
                    case "png":
                    case "jpg":
                    case "jpeg":
                        file = new Image();
                        file.src = absolutePath;
                        file.onload = successMsg;
                        file.onerror = failMsg;
                        this.imageCache[relativePath] = file;
                        break;
                    case "mp3":
                    case "wav":
                        file = new Audio();
                        file.src = absolutePath;
                        file.onloadeddata = successMsg;
                        file.onerror = failMsg;
                        this.audioCache[relativePath] = file;
                        break;
                    case "txt":
                        fetch(absolutePath)
                            .then(resp => resp.text())
                            .then(text => {
                                this.successCount++;
                                this.textCache[relativePath] = text;
                                res(text);
                            })
                            .catch(err => {
                                this.errorCount++;
                                rej(err);
                            })
                        break;
                    default:
                        rej("Unknown file extension: " + ext);
                }

            }))
        ).then(callback);

        // same function above as below

        /*
        for (let i = 0; i < this.downloadQueue.length; i++) {
            const img = new Image();

            const path = this.downloadQueue[i];
            console.log(path);

            img.addEventListener("load", () => {
                console.log("Loaded " + img.src);
                this.successCount++;
                if (this.isDone()) callback();
            });

            img.addEventListener("error", () => {
                console.log("Error loading " + img.src);
                this.errorCount++;
                if (this.isDone()) callback();
            });

            img.src = path;
            this.cache[path] = img;
        }
         */
    };

    /**
     * gets the asset from this manager
     * @param path the relative path to the file from the asset folder
     * @returns {Image}
     */
    static getAsset(path) {
        return this.imageCache[path];
    };

    /**
     * Gets the image from this manager
     * @param path the relative path to the file from the asset folder
     * @returns {Audio}
     */
    static getAudio(path) {
        return this.audioCache[AssetManager.#root + path];
    };

    /**
     * Gets the text from this manager
     * @param path the relative path to the file from the asset folder
     * @returns {string}
     */
    static getText(path) {
        return this.textCache[path];
    }
}

