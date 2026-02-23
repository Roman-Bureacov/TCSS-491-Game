/*

The test for the property change support

 */

import test from "node:test";
import {notStrictEqual, strictEqual} from "node:assert/strict";
import {PropertyChangeSupport} from "../lib/propertychangesupport.js";

/**
 * @implements {PropertyChangeNotifier}
 * @extends {PropertyChangeSupport}
 */
class A {
    constructor() {
        this.PCS = new PropertyChangeSupport(this);
    }
}

/**
 * @implements {PropertyChangeListener}
 */
class B {
    /**
     * @override
     */
    notify(prop, then, now) {
        
    }
}

/**
 * @implements {PropertyChangeNotifier}
 */
class SelfImplementor {

    constructor() {
        this.PCS = new PropertyChangeSupport(undefined);
    }

    addPropertyListener(prop, listener) {
        this.PCS.addPropertyListener(prop, listener);
    }

    notifyListeners(prop, then, now) {
        this.PCS.notifyListeners(prop, then, now);
    }

    removePropertyListener(prop, listener) {
        this.PCS.removePropertyListener(prop, listener);
    }
}

const expectedChangeString = (expected, result) => {
    return `Expected property change: ${expected}, found ${result}`
}

test("property listener notifying", () => {
    const notifier = new A();
    const listener = new B();
    testListeners(notifier, listener)
})
test("property listener notifying a self-implementor", () => {
    const notifier = new A();
    const listener = new SelfImplementor();
    testListeners(notifier, listener);
})

const testListeners = (notifier, listener) => {
    const PROPS = {
        A : "something???",
        B : "idunno",
        C : "property",
    }

    listener.propA = 0;
    listener.propB = 0;
    listener.propC = 0;

    listener.notify = (props, then, now) => {
        switch (props) {
            case PROPS.A: listener.propA = 1; break;
            case PROPS.B: listener.propB -= 1; break;
            case PROPS.C: {
                if (now === 0) listener.propC = 0;
                else {
                    listener.propC = then + now;
                }
            } break;
        }
    }

    notifier.addPropertyListener(PROPS.A, listener);
    notifier.addPropertyListener(PROPS.B, listener);
    notifier.addPropertyListener(PROPS.C, listener);

    notifier.notifyListeners(PROPS.A, undefined, undefined);
    strictEqual(listener.propA, 1, expectedChangeString(1, listener.propA));

    strictEqual(listener.propB, 0);
    notifier.notifyListeners(PROPS.B, null, 20);
    strictEqual(listener.propB, -1);

    strictEqual(listener.propC, 0);
    notifier.notifyListeners(PROPS.C, listener.propC, 3);
    strictEqual(listener.propC, 3);
    notifier.notifyListeners(PROPS.C, listener.propC, 7);
    strictEqual(listener.propC, 10);
}