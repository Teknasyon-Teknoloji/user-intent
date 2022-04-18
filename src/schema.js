import * as triggers from './triggers';

const schema = {
    idle: {
        fn: triggers.idle,
        opts: {
            events: ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'],
            delay: 10000,
            multiple: false,
        },
    },
    scroll: {
        fn: triggers.scroll,
        opts: {
            percentDown: 50,
            percentUp: 0,
            offsetTop: 0,
            offsetBottom: 0,
        },
    },
    target: {
        fn: triggers.target,
        opts: {
            target: '',
            offsetTop: 0,
            offsetBottom: 0,
            multiple: false,
        },
    },
    focus: {
        fn: triggers.windowFocus,
        opts: {
            multiple: false,
        },
    },
    out: {
        fn: triggers.windowOut,
        opts: {
            multiple: false,
        },
    },
};

export default Object.freeze(schema);
