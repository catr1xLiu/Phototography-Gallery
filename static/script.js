const animationDelayMS = 200
const animationDurationMS = 600

document.addEventListener('DOMContentLoaded', () => {

    // --- Keyboard Navigation (No changes here) ---
    const prevLink = document.getElementById('prev-link');
    const nextLink = document.getElementById('next-link');

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && prevLink) {
            window.location.href = prevLink.href;
        } else if (e.key === 'ArrowRight' && nextLink) {
            window.location.href = nextLink.href;
        }
    });


    // --- Custom JavaScript Animations ---

    /**
     * Animates a number counting up.
     * @param {HTMLElement} el The element to update.
     * @param {number} end The final number.
     * @param {function} formatter A function to format the number for display.
     */
    const animateCountUp = (el, end, formatter) => {
        let startTime = null;

        const step = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / animationDurationMS, 1);
            
            // Apply an easing function to make it look smooth
            const easedProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            
            const currentValue = easedProgress * end;
            el.innerHTML = formatter(currentValue);

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                // Ensure the final value is exact
                el.innerHTML = formatter(end);
            }
        };
        requestAnimationFrame(step);
    };

    // 1. Get elements and parse target values
    const isoEl = document.getElementById('iso-value');
    const apertureEl = document.getElementById('aperture-value');
    const shutterEl = document.getElementById('shutter-value');

    const isoTarget = (isoEl && isoEl.textContent !== 'N/A') ? parseInt(isoEl.textContent, 10) : NaN;
    const apertureTarget = (apertureEl && apertureEl.textContent.startsWith('f/')) ? parseFloat(apertureEl.textContent.replace('f/', '')) : NaN;
    const shutterTarget = (shutterEl && shutterEl.textContent.startsWith('1/')) ? parseInt(shutterEl.textContent.split('/')[1], 10) : NaN;

    // 2. Run the animations after a short delay to sync with the CSS animation
    setTimeout(() => {
        if (!isNaN(isoTarget)) {
            const formatter = (value) => Math.round(value);
            animateCountUp(isoEl, isoTarget, formatter);
        }
        if (!isNaN(apertureTarget)) {
            const formatter = (value) => `f/${value.toFixed(1)}`;
            animateCountUp(apertureEl, apertureTarget, formatter);
        }
        if (!isNaN(shutterTarget)) {
            const formatter = (value) => `1/${Math.round(value)}`;
            animateCountUp(shutterEl, shutterTarget, formatter);
        }
    }, animationDelayMS);
});