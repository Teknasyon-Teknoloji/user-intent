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
function idle() {
    const boundListener = handleIdleness.bind(this);
    this.attachEvents([{ el: window, type: 'load', listener: boundListener }]);
    registerIdlenessHandler.call(this);
}

let lastScrollTop = 0; // To detect scroll direction
let lastScrollTopBeforeUp = 0;

/**
 * @param {Number} docHeight
 * @returns {void}
 */
function handleScroll(docHeight, percentUp) {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const downScroll = scrollTop > lastScrollTop;
    const downScrollPercent = docHeight * (parseFloat(this._opts.percentDown) / 100);
    const upScrollPercent = percentUp
        ? lastScrollTopBeforeUp - Math.round((lastScrollTopBeforeUp / 100) * percentUp)
        : 0;

    if (downScroll && !percentUp && scrollTop >= downScrollPercent) {
        this.fire();
    }

    if (!downScroll && upScrollPercent && scrollTop <= upScrollPercent && lastScrollTopBeforeUp >= downScrollPercent) {
        this.fire();
    }

    if (downScroll && percentUp) {
        lastScrollTopBeforeUp = scrollTop;
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
}

/**
 * @returns {void}
 */
function scroll() {
    const { body } = document;
    const html = document.documentElement;
    let docHeight = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight,
    );

    // Calculate the bottom of the viewport
    docHeight = parseInt(docHeight - window.innerHeight, 10);
    if (this._opts.offsetTop) {
        docHeight -= this._opts.offsetTop;
    }
    if (this._opts.offsetBottom) {
        docHeight += this._opts.offsetBottom;
    }

    const boundListener = handleScroll.bind(this, docHeight, this._opts.percentUp);

    if (!this.invoked) {
        this.attachEvents([{ el: window, type: 'scroll', listener: boundListener }]);
    }
}

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
function windowFocus() {
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

/**
 * @param {MouseEvent} event
 * @returns {void}
 */
function handleMouseLeave(event) {
    if (!this.invoked && event.clientY < 0) {
        this.fire();
    }
}

/**
 * @returns {void}
 */
function windowOut() {
    const boundMouseLeave = handleMouseLeave.bind(this);
    this.attachEvents([{ el: document, type: 'mouseleave', listener: boundMouseLeave }]);
}

/**
 * @returns {void}
 */
function target() {
    if (!this._opts.target) {
        console.error('🔥 you have to provide a target selector within the options object to UserIntent().');
        return;
    }

    const targetEl = document.querySelector(this._opts.target);
    if (!targetEl) {
        console.error(`🔥 cannot find the provided target "${this._opts.target}".`);
        return;
    }

    const observerOpts = { rootMargin: `${this._opts.offsetTop}px 0px ${this._opts.offsetBottom}px 0px` };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting && !this.invoked) {
                this.fire();
                if (!this._opts.multiple) {
                    observer.unobserve(entry.target);
                }
            }
        });
    }, observerOpts);

    observer.observe(targetEl);
}

const schema = {
    idle: {
        fn: idle,
        opts: {
            events: ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'],
            delay: 10000,
            multiple: false,
        },
    },
    scroll: {
        fn: scroll,
        opts: {
            percentDown: 50,
            percentUp: 0,
            offsetTop: 0,
            offsetBottom: 0,
        },
    },
    target: {
        fn: target,
        opts: {
            target: '',
            offsetTop: 0,
            offsetBottom: 0,
            multiple: false,
        },
    },
    focus: {
        fn: windowFocus,
        opts: {
            multiple: false,
        },
    },
    out: {
        fn: windowOut,
        opts: {
            multiple: false,
        },
    },
};

var schema$1 = Object.freeze(schema);

/**
 * @param {Object[]} eventsArr
 * @returns {void}
 */
function eventsListenersCleanup(eventsArr = []) {
    const eventsArrLen = eventsArr.length;

    if (!eventsArrLen) return;

    for (let i = 0; i < eventsArrLen; i += 1) {
        const eventObj = eventsArr[i];
        eventObj.el.removeEventListener(eventObj.type, eventObj.listener);
    }
}

/**
 * @param {Object[]} eventsArr
 * @returns {void}
 */
function eventsListenersAttach(eventsArr = []) {
    const eventsArrLen = eventsArr.length;

    if (!eventsArrLen) return;

    for (let i = 0; i < eventsArrLen; i += 1) {
        const { el, type, listener } = eventsArr[i];
        el.addEventListener(type, listener);
    }
}

function UserIntent(cb, opts = {}) {
    if (typeof opts !== 'object') {
        console.error('🔥 wrong options type passed to UserIntent().');
        return;
    }
    if (typeof cb === 'undefined') {
        console.error('🔥 you have to pass a callback to UserIntent().');
        return;
    }
    if (opts.mode && typeof schema$1[opts.mode] === 'undefined') {
        console.error('🔥 wrong mode passed to UserIntent().');
        return;
    }

    const mode = opts.mode || 'out';

    // Clone the passed options to delete the mode key from it
    const optsClone = { ...opts };
    delete optsClone.mode;

    // Now we have all the other passed options, let's validate and fallback to default options
    const defaultOpts = schema$1[mode].opts;
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

    schema$1[mode].fn.call(this);
}

export { UserIntent as default };
//# sourceMappingURL=index.js.map
