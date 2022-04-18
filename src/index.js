import schema from './schema';
import { eventsListenersAttach, eventsListenersCleanup } from './utils';

export default function UserIntent(cb, opts = {}) {
    if (typeof opts !== 'object') {
        console.error('🔥 wrong options type passed to UserIntent().');
        return;
    }
    if (typeof cb === 'undefined') {
        console.error('🔥 you have to pass a callback to UserIntent().');
        return;
    }
    if (opts.mode && typeof schema[opts.mode] === 'undefined') {
        console.error('🔥 wrong mode passed to UserIntent().');
        return;
    }

    const mode = opts.mode || 'out';

    // Clone the passed options to delete the mode key from it
    const optsClone = { ...opts };
    delete optsClone.mode;

    // Now we have all the other passed options, let's validate and fallback to default options
    const defaultOpts = schema[mode].opts;
    const defaultOptsKeys = Object.keys(defaultOpts);
    const defaultOptsKeysLen = defaultOptsKeys.length;
    if (defaultOptsKeysLen) {
        for (let i = 0; i < defaultOptsKeysLen; i += 1) {
            const optKey = defaultOptsKeys[i];
            const optDefaultValue = defaultOpts[optKey];
            if (typeof optsClone[optKey] === 'undefined') {
                optsClone[optKey] = optDefaultValue;
            }
        }
    }

    this._mode = mode;
    this._opts = optsClone;
    this._cb = cb;
    this.invoked = false;
    this.timer = null;
    this.windowBlurred = false;
    this.addedEvents = [];

    /**
     * @param {Object[]} eventsArr
     * @returns {void}
     */
    this.attachEvents = (eventsArr) => {
        eventsListenersAttach(eventsArr);
        this.addedEvents.push(...eventsArr);
    };

    /**
     * @returns {void}
     */
    this.fire = () => {
        cb(this._mode, { ...this._opts });
        if (!this._opts.multiple) {
            this.invoked = true;
            eventsListenersCleanup(this.addedEvents);
        }
    };

    schema[mode].fn.call(this);
}
