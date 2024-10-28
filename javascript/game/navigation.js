// navigation.js

document.addEventListener('DOMContentLoaded', () => {
    const backToGameLink = document.querySelector('a[href="index.html"]');
    if (backToGameLink) {
        backToGameLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.close();
        });
    }
});