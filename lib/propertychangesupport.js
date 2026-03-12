/*

The interface for listening to properties

 */

/**
 * The class for implementing property change notifying.
 *
 * Note that this is a class for composition, the general pattern for this being
 * to instantiate this class to implement the interface
 * functions as calls to this class.
 *
 * Note: it is recommended to implement the property names
 * as static `enum`s of the class mapping keys to strings of
 * the general style `"[ClassName].[PROPERTY_NAME]"` to prevent
 * generic naming collisions.
 * 
 * @example
 * ```js
 * // @implements PropertyChangeNotifier...
 * class Something {
 *   // doc...
 *   // @enum {string}...
 *   static PROPERTIES = Object.freeze({
 *     PROP1 = "Something.PROP1",
 *     PROP2 = "Something.PROP2",
 *     PROP3 = "Something.PROP3",
 *   });
 * 
 *   // code...
 *   constructor(params...) {
 *     this.PCS = new PropertyChangeSupport(this);
 *   }
 *   // code...
 *
 * }
 * ```
 *
 * @see {PropertyChangeListener}
 * @see {PropertyChangeNotifier}
 * @implements {PropertyChangeNotifier}
 * @author Roman Bureacov
 */
export class PropertyChangeSupport {

    /**
     * The collection of property change listeners.
     * 
     * @type {{string : PropertyChangeListener[]}}
     */
    listeners = {}
    
    /**
     * Creates a property change notifier and binds necessary functions.
     *
     * For implementing classes which want to delegate binding to this constructor,
     * annotate them as extending this class.
     *
     * @example
     * ```js
     * // @implements {PropertyChangeNotifier} ...
     * // @extends {PropertyChangeSupport} ...
     * class Something {
     *   // ...
     *   constructor(params) {
     *     // ...
     *     this.PCS = new PropertyChangeSupport(this);
     *   }
     *   // ...
     * }
     * ```
     *
     * @param {*} [source] if defined, assigns the implemented interface methods to the source
     */
    constructor(source) {
        if (source) Object.assign(source,
            {
                listeners: this.listeners,
                addPropertyListener: this.addPropertyListener,
                removePropertyListener: this.removePropertyListener,
                notifyListeners: this.notifyListeners,
            });
    }

    /**
     * @inheritDoc 
     */
    addPropertyListener(prop, listener) {
        if (!listener) console.log(`Warning: passing falsy listener to notifier`);
        if (!this.listeners[prop]) this.listeners[prop] = [];
        this.listeners[prop].push(listener);
    }

    /**
     * @inheritDoc 
     */
    removePropertyListener(prop, listener) {
        const list = this.listeners[prop];
        if (!list) console.log(`Warning: tried to remove unknown property "${prop}"`);
        else list.remove(listener);
    }

    /**
     * @inheritDoc
     */
    notifyListeners(prop, then = undefined, now = undefined) {
        const list = this.listeners[prop];
        if (list) list.forEach(l => l.notify(prop, then, now));
    }
}

// noinspection JSUnusedGlobalSymbols
/**
 * The interface describing a class capable of notifying
 * other objects that some of its properties have changed.
 *
 * @see {PropertyChangeSupport}
 * @interface
 */
export class PropertyChangeNotifier {

    /**
     * Adds a property change listener to this notifier.
     *
     * @param {string} prop the property name
     * @param {PropertyChangeListener} listener the listener to add
     */
    addPropertyListener(prop, listener) {}

    /**
     * Removes a property change listener from this notifier.
     *
     * @param {string} prop the property name
     * @param {PropertyChangeListener} listener the listener to remove
     */
    removePropertyListener(prop, listener) {}

    /**
     * Notifies the listeners for this object that the property
     * has changed.
     *
     * @param {string} prop the property name
     * @param {*} [then] the old property value, if any
     * @param {*} [now] the new property value, if any
     */
    notifyListeners(prop, then = undefined, now = undefined) {}
}

/**
 * The interface for an object capable of receiving
 * calls that properties have changed.
 *
 * @see {PropertyChangeSupport}
 * @interface
 * @author Roman Bureacov
 */
export class PropertyChangeListener {

    /**
     * Notifies this listener that a property has changed.
     *
     * @param {string} prop the property name
     * @param {*} [then] the old value of the property, if any
     * @param {*} [now] the new value of the property, if any
     */
    notify(prop, then = undefined, now = undefined) {}

}