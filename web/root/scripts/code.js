const input = document.getElementById('input');
const button = document.getElementById('button');

async function init() {
    input.addEventListener('input', () => {
        if (input.value) {
            button.disabled = false;
        } else {
            button.disabled = true;
        }
    });

    button.addEventListener('click', async () => {
        const text = input.value;

        const baseUrl = window.location.origin;

        const url = `${baseUrl}/m/add?code=${text}`;

        window.location.href = url;
    });
}

init();