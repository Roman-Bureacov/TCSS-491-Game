/**
 * A class for handling keymapping
 *
 * @author Roman Bureacov
 */
export class KeyMapper {

    /**
     * The map of key names to action names. Use function keyName to get the appropriate name.
     * @type {Record<String, String>}
     */
    inputMap = {};

    /**
     * The map of action names to functions
     * @type {Record<String, function>}
     */
    outputMap = {};

    constructor() {

    }

    /**
     * Sends and translates the key for the keymapper to look up the function and call it
     * @param keyEvent the key event to look up with
     */
    sendKeyEvent(keyEvent) {
        this.outputMap[this.inputMap[KeyMapper.keyName(keyEvent)]]?.();
    }

    /**
     * Sends the key name for the keymapper to look up the function and call it
     * @param keyName
     */
    sendKeyName(keyName) {
        this.outputMap[this.inputMap[keyName]]?.();
    }

    /**
     * Constructs the name of a key to feed into the input map
     * @return String the full key name
     */
    static keyName(keyEvent) {
        return (keyEvent.ctrlKey ? " ctrl" : "")
            + (keyEvent.altKey ? " alt" : "")
            + (keyEvent.shiftKey ? " shift" : "")
            + (keyEvent.metaKey ? " meta" : "")
            + (keyEvent.type + " ")
            + keyEvent.code;
    }

    /**
     * Builds a valid key name for the input map
     * @param code the key code
     * @param isDown keydown on true, otherwise keyup
     * @param ctrl if the ctrl modifier is active
     * @param alt if the alt modifier is active
     * @param shift if the shift modifier is active
     * @param meta if the meta modifier is active
     * @returns {String} the valid key name the key mapper will understand
     */
    static getName(code, isDown,
                   ctrl = false,
                   alt = false,
                   shift = false,
                   meta = false) {
        return (ctrl ? " ctrl" : "")
            + (alt ? " alt" : "")
            + (shift ? " shift" : "")
            + (meta ? " meta" : "")
            + (isDown ? "keydown " : "keyup ")
            + code;
    }
}