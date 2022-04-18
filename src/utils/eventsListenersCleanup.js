/**
 * @param {Object[]} eventsArr
 * @returns {void}
 */
export default function eventsListenersCleanup(eventsArr = []) {
    const eventsArrLen = eventsArr.length;

    if (!eventsArrLen) return;

    for (let i = 0; i < eventsArrLen; i += 1) {
        const eventObj = eventsArr[i];
        eventObj.el.removeEventListener(eventObj.type, eventObj.listener);
    }
}
