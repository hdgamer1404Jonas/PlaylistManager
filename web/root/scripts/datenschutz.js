const drawer = document.querySelector('.drawer-overview');
const closeButton = drawer.querySelector('sl-button[variant="primary"]');
const openButton = document.getElementById('openMenu');

openButton.addEventListener('click', () => drawer.show());
closeButton.addEventListener('click', () => drawer.hide());