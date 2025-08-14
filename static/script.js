const LOADING_ANIMATION_DELAY = 200
const LOADING_ANIMATION_DURATION_MS = 600
const EXIT_ANIMATION_DURATION_MS = 400

document.addEventListener('DOMContentLoaded', () => {
    /**
     * Adds the exiting class to all elements, waits for the animation
     * to complete, and then navigates to the specified URL.
     * @param {string} url - The destination URL to navigate to.
     */
    function navigateWithAnimation(url) {
        // 1. Add the "exiting" class to the body to trigger the animation.
        //    Assuming your CSS applies the animation to children of .exiting.
        document.body.classList.add('exiting');
        document.getElementsByClassName('photo-frame')[0].classList.add('exiting')

        // 2. Wait for the animation to finish.
        setTimeout(() => {
            // 3. Navigate to the new page.
            window.location.href = url;
        }, EXIT_ANIMATION_DURATION_MS);
    }

    // --- Handle Clicks on Links ---
    /**
     * Listens for clicks anywhere in the document. If a link is clicked,
     * it prevents the default navigation and uses our animation function instead.
     */
    document.addEventListener('click', (e) => {
        // Find the closest ancestor 'a' tag. This handles cases where
        // the user clicks on an element inside a link (e.g., an image or <strong> tag).
        const link = e.target.closest('a');

        // Proceed only if a link was actually clicked and it has a valid href.
        if (link && link.href) {
            // Stop the browser from navigating immediately.
            e.preventDefault();

            // Call our function to navigate with the animation.
            navigateWithAnimation(link.href);
        }
    });

    // --- Keyboard Navigation (Modified) ---
    const prevLink = document.getElementById('prev-link');
    const nextLink = document.getElementById('next-link');

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && prevLink) {
            // Instead of navigating directly, call our animation function.
            navigateWithAnimation(prevLink.href);
        } else if (e.key === 'ArrowRight' && nextLink) {
            // Same for the right arrow.
            navigateWithAnimation(nextLink.href);
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
            const progress = Math.min((currentTime - startTime) / LOADING_ANIMATION_DURATION_MS, 1);
            
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
    }, LOADING_ANIMATION_DELAY);
});