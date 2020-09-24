// Hide recipe content //
const hideContent = document.querySelectorAll('.recipe-hide');

for (let item of hideContent) {
    const hideButton = item.querySelector('.hide');

    hideButton.addEventListener('click', () => {
        item.querySelector('.content').classList.toggle('hidden');
        if (hideButton.innerHTML == 'ESCONDER') {
            hideButton.innerHTML = 'MOSTRAR';
        } else {
            hideButton.innerHTML = 'ESCONDER';
        }
    });
}