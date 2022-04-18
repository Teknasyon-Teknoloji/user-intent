/**
 * @returns {void}
 */
export default function target() {
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
