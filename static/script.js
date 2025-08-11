document.addEventListener('DOMContentLoaded', () => {

    const prevLink = document.getElementById('prev-link');
    const nextLink = document.getElementById('next-link');

    // Handle keyboard navigation
    document.addEventListener('keydown', (e) => {
        // If an input field is focused, do nothing
        if (document.activeElement.tagName === 'INPUT') {
            return;
        }

        if (e.key === 'ArrowLeft') {
            // Navigate to the 'previous' image URL
            if (prevLink) {
                window.location.href = prevLink.href;
            }
        } else if (e.key === 'ArrowRight') {
            // Navigate to the 'next' image URL
            if (nextLink) {
                window.location.href = nextLink.href;
            }
        }
    });

});