/**
 * @param {FocusEvent} event
 * @returns {void}
 */
function handleWindowBlur() {
    this.windowBlurred = true;
}

/**
 * @param {FocusEvent} event
 * @returns {void}
 */
function handleWindowFocus() {
    if (this.windowBlurred && !this.invoked) {
        this.fire();
        this.windowBlurred = false;
    }
}

/**
 * @returns {void}
 */
export default function windowFocus() {
    const boundWindowBlur = handleWindowBlur.bind(this);
    const boundWindowFocus = handleWindowFocus.bind(this);

    // detect visibilitychange in browser
    let hiddenVar = '';
    let eventType = '';
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if ('hidden' in document) {
        hiddenVar = 'hidden';
        eventType = 'visibilitychange';
    }

    if ('mozHidden' in document) {
        hiddenVar = 'mozHidden';
        eventType = 'mozvisibilitychange';
    }

    if ('webkitHidden' in document) {
        hiddenVar = 'webkitHidden';
        eventType = 'webkitvisibilitychange';
    }

    if ('msHidden' in document) {
        hiddenVar = 'msHidden';
        eventType = 'msvisibilitychange';
    }

    if (hiddenVar && eventType && !isSafari) {
        const handleVisibility = () => {
            (document[hiddenVar] ? boundWindowBlur : boundWindowFocus)();
        };
        this.attachEvents([{ el: document, type: eventType, listener: handleVisibility }]);
    } else {
        this.attachEvents([
            { el: window, type: 'blur', listener: boundWindowBlur },
            { el: window, type: 'focus', listener: boundWindowFocus },
        ]);
    }
}
