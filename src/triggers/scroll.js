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
export default function scroll() {
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
