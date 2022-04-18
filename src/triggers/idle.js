/**
 * @param {MouseEvent|KeyEvent|TouchEvent} event
 * @returns {void}
 */
function handleIdleness() {
    if (this.invoked) return;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
        this.fire();
    }, this._opts.delay);
}

/**
 * @returns {void}
 */
function registerIdlenessHandler() {
    const eventsTypes = this._opts.events;
    const eventsTypesLen = eventsTypes.length;
    for (let i = 0; i < eventsTypesLen; i += 1) {
        const eventType = eventsTypes[i];
        const boundListener = handleIdleness.bind(this);
        this.attachEvents([{ el: document, type: eventType, listener: boundListener }]);
    }
}

/**
 * @returns {void}
 */
export default function idle() {
    const boundListener = handleIdleness.bind(this);
    this.attachEvents([{ el: window, type: 'load', listener: boundListener }]);
    registerIdlenessHandler.call(this);
}
