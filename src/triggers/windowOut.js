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
export default function windowOut() {
    const boundMouseLeave = handleMouseLeave.bind(this);
    this.attachEvents([{ el: document, type: 'mouseleave', listener: boundMouseLeave }]);
}
