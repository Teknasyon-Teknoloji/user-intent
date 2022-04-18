/**
 * @param {Object[]} eventsArr
 * @returns {void}
 */
export default function eventsListenersAttach(eventsArr = []) {
    const eventsArrLen = eventsArr.length;

    if (!eventsArrLen) return;

    for (let i = 0; i < eventsArrLen; i += 1) {
        const { el, type, listener } = eventsArr[i];
        el.addEventListener(type, listener);
    }
}
