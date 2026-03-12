import {Token} from "./Token.js";

/**
 * Instantiates a scanner for an arena text file
 */
export class ArenaScanner {

    regexWhitespace = /^[ \n\r]$/;
    regexLetter = /^[A-Z]$/;
    regexTextLetter = /^[a-z]$/
    regexDigit = /^\d$/;
    index = 0;
    ch = "";
    line = 1;

    reservedWords = {
        "dimension" : Token.TYPES.DIMENSION,
        "matrix" : Token.TYPES.MATRIX,
        "size" : Token.TYPES.SIZE,
        "arena" : Token.TYPES.ARENA,
        "set" : Token.TYPES.SET,
        "by" : Token.TYPES.BY,
        "rows" : Token.TYPES.ROWS,
        "columns" : Token.TYPES.COLS,
        "end" : Token.TYPES.END,
        "origin" : Token.TYPES.ORIGIN,
        "default" : Token.TYPES.DEFAULT,
        "auto" : Token.TYPES.AUTO,
        "tiles" : Token.TYPES.TILES,
        "detail" : Token.TYPES.DETAIL,
        "background" : Token.TYPES.BACKGROUND,
        "music" : Token.TYPES.MUSIC,
    }

    /**
     * Constructs a scanner for the text input.
     * @param {string} text the text to scan
     */
    constructor(text) {
        Object.assign(this, {text});
        this.nextCh();
    }

    /**
     * Reads and returns the next token found
     * @return {Token}
     */
    next() {

        if (this.index >= this.text.length) throw new Error("Asking for more token when at EOF")

        while (this.regexWhitespace.test(this.ch)) {
            if (this.ch === "\n") this.line++;
            this.nextCh();
        }

        switch (this.ch) {
            case "*":
                this.nextCh()
                return new Token(Token.TYPES.ASTR, "*", this.line);
            case ":":
                this.nextCh()
                return new Token(Token.TYPES.COLN, ":", this.line);
            case "|":
                this.nextCh()
                return new Token(Token.TYPES.PIPE, "|", this.line);
            case ".":
                this.nextCh()
                return new Token(Token.TYPES.DOT, ".", this.line);
            case "-":
                this.nextCh()
                return new Token(Token.TYPES.MINS, "-", this.line);
            case ",":
                this.nextCh()
                return new Token(Token.TYPES.COMMA, ",", this.line);
            // now it's either a number or text
            default:
                if (this.ch === "\"") {
                    let str = this.buildStr();
                    return new Token(Token.TYPES.STR, str, this.line)
                } else if (this.regexTextLetter.test(this.ch)) {
                    // build text
                    let str = this.buildText();
                    let type = this.reservedWords[str];
                    if (type === undefined)
                        return new Token(Token.TYPES.TEXT, str, this.line);
                    else
                        return new Token(type, str, this.line);

                } else if (this.regexDigit.test(this.ch)) {
                    // build number
                    return new Token(Token.TYPES.NUMBER, this.buildNumber(), this.line);
                } else if (this.regexLetter.test(this.ch)) {
                    // build letter
                    let image = this.ch;
                    this.nextCh()
                    return new Token(Token.TYPES.LETTER, image, this.line);
                } else throw new Error(`(line ${this.line}) Unexpected token: ${this.ch}`);
        }
    }

    /**
     * Builds a string from the input
     * @return {string} the image
     */
    buildStr() {
        let str = this.ch;
        this.nextCh();
        while (this.ch !== "\"") {
            str = str.concat(this.ch);
            this.nextCh();
        }
        str = str.concat(this.ch);
        this.nextCh();

        return str;
    }

    /**
     * Builds text from the input
     * @return {string} the image
     */
    buildText() {

        let str = ""
        while (this.regexTextLetter.test(this.ch)) {
            str = str.concat(this.ch);
            this.nextCh();
        }

        return str;
    }

    /**
     * Builds a number from the input
     * @return {string} the image
     */
    buildNumber() {

        let n = ""
        while (this.regexDigit.test(this.ch)) {
            n = n.concat(this.ch);
            this.nextCh();
        }
        if (this.ch === ".") {
            n = n.concat(this.ch);
            this.nextCh();
        }
        while (this.regexDigit.test(this.ch)) {
            n = n.concat(this.ch);
            this.nextCh();
        }

        return n;
    }

    /**
     * Reads and returns the next character found
     */
    nextCh() {
        this.ch = this.text.charAt(this.index++);
    }
}