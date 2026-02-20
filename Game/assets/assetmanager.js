/**
 * @typedef FileAssetPaths
 * @property {string} relativePath
 * @property {string} absolutePath
 */

/**
 * Static class that manages assets
 *
 * @author (original author undocumented)
 * @author Roman Bureacov
 */
export class AssetManager {

    /** @type {URL} the absolute path to the assets folder */
    static #root = new URL("./", import.meta.url);

    static {
        /** @type {number} */
        this.successCount = 0;
        /** @type {number} */
        this.errorCount = 0;
        /** @type {{string : Image}} */
        this.imageCache = {};
        /** @type {{string : Audio}} */
        this.audioCache = {};
        /** @type {{string : string}} */
        this.textCache = {};
        /** @type {string[]} */
        this.downloadQueue = [];
    }

    /**
     * Determines the absolute file path from the relative file
     * @param {string} path the relative path from the assets folder to the file
     * @return {string} the absolute path to the file
     */
    static #resolve(path) {
        return new URL(path, AssetManager.#root).href;
    }

    /**
     * Queue the download of a file
     * @param {string} path the path relative to where the asset manager lives
     */
    static queueDownload(path) {
        let resolvedPath = AssetManager.#resolve(path);
        console.log("Queueing " + resolvedPath);
        this.downloadQueue.push(path);
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

        Promise.all(
            this.downloadQueue.map(path => this.downloadOne(path))
        ).then(callback);

    };

    /**
     * Downloads a single file
     *
     * @param {string} relativePath the relative path to the file from the assets folder
     * @return {Promise<void>} the promise for downloading the file
     */
    static async downloadOne(relativePath) {
        return new Promise((res, rej) => {
            if (!relativePath) rej(`bad asset file path: ${relativePath}`)

            if (
                this.imageCache[relativePath]
                || this.textCache[relativePath]
                || this.audioCache[relativePath]
            ) { // this asset may or may not already exist
                res(`Asset "${relativePath}" already loaded, skipping...`);
            }
            
            const absolutePath = this.#resolve(relativePath);

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

        })
    }

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
        return this.audioCache[path];
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

