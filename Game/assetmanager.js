export class AssetManager {

    static root = "./assets/";

    constructor() {
        this.successCount = 0;
        this.errorCount = 0;
        this.imageCache = [];
        this.audioCache = [];
        this.downloadQueue = [];
    };

    queueDownload(path) {
        path = AssetManager.root + path
        console.log("Queueing " + path);
        this.downloadQueue.push(path);
    };

    isDone() {
        return this.downloadQueue.length === this.successCount + this.errorCount;
    };

    downloadAll(callback) {
        if (this.downloadQueue.length === 0) setTimeout(callback, 10);

        Promise.all(
            this.downloadQueue.map(path => new Promise((res, rej) => {

                let file;
                const successMsg = () => {
                    this.successCount++;
                    console.log(res("Loaded " + file.src));
                };
                const failMsg = () => {
                    this.errorCount++;
                    console.log(rej("Error loading " + file.src));
                };

                const ext = path.split(".").pop().toLowerCase();
                console.log("Loading... " + path);

                switch(ext) {
                    case "png":
                    case "jpg":
                    case "jpeg":
                        file = new Image();
                        file.src = path;
                        file.onload = successMsg;
                        file.onerror = failMsg;
                        this.imageCache[path] = file;
                        break;
                    case "mp3":
                    case "wav":
                        file = new Audio();
                        file.src = path;
                        file.onloadeddata = successMsg;
                        file.onerror = failMsg;
                        this.audioCache[path] = file;
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
    getAsset(path) {
        return this.imageCache[AssetManager.root + path];
    };

    /**
     * Gets the image from this manager
     * @param path the relative path to the file from the asset folder
     * @returns {Audio}
     */
    getAudio(path) {
        return this.audioCache[AssetManager.root + path];
    };
}

