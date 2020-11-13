// Active menu //
const currentPage = location.pathname;
const menuItens = document.querySelectorAll('header .links-wrapper > li > a');

menuItens.forEach(item => {
    if (currentPage.includes(item.getAttribute('href'))) {
        item.classList.add('active');
    }
});

// Confirm recipe/chef/user deletion //
function confirmDelete(formDelete) {
    formDelete.addEventListener('submit', event => {
        const totalRecipes = document.querySelector('.total-recipes');
        const confirmation = confirm('Tem certeza que deseja deletar? Essa operação não poderá ser desfeita!');
        if (!confirmation) event.preventDefault();

        // Check if the chef has recipes //
        if (totalRecipes) {
            const total = +totalRecipes.dataset.total;
            if (total) {
                event.preventDefault();
                alert('Não é possivel deletar chefs que possuem receitas!');
            }
        }
    });
}

const formDelete = document.querySelector('#form-delete');
if (formDelete) confirmDelete(formDelete);

const usersFormDelete = document.querySelectorAll('.form-delete');
usersFormDelete.forEach(form => confirmDelete(form));

const ImageGallery = {
    highlight: document.querySelector('.gallery .highlight > img'),
    previews: document.querySelectorAll('.gallery .gallery-preview img'),
    setImage(event) {
        const { target } = event;
        ImageGallery.previews.forEach(preview => preview.classList.remove('active-image'));
        target.classList.add('active-image');
        ImageGallery.highlight.src = target.src;
        Lightbox.image.src = target.src;
    }
};

const Lightbox = {
    target: document.querySelector('.lightbox-target'),
    image: document.querySelector('.lightbox-target img'),
    closeButton: document.querySelector('.lightbox-target a.lightbox-close'),
    open() {
        Lightbox.target.style.opacity = 1;
        Lightbox.target.style.top = 0;
        Lightbox.target.style.bottom = 0;
        Lightbox.closeButton.style.top = 0;
    },
    close() {
        Lightbox.target.style.opacity = 0;
        Lightbox.target.style.top = '-100%';
        Lightbox.target.style.bottom = 'initial';
        Lightbox.closeButton.style.top = '-80px';
    }
};

// Form validation //
const Validate = {
    apply(input, func) {
        Validate.clearErrors(input);
        let results = Validate[func](input.value);

        if (results.error) Validate.displayError(input, results.error);
    },
    displayError(input, error) {
        const div = document.createElement('div');
        div.classList.add('error');
        div.innerText = error;
        input.parentNode.appendChild(div);
    },
    clearErrors(input) {
        let errorDiv;
        const formErrors = document.querySelectorAll('.error.messages');
        if (input) errorDiv = input.parentNode.querySelector('.error');
        if (errorDiv) errorDiv.remove();
        if (formErrors) formErrors.forEach(error => error.remove());
    },
    isEmail(value) {
        let error = null;
        const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (!value.match(mailFormat)) error = 'Email inválido';

        return {
            error,
            value
        };
    },
    allFields(event) {
        Validate.clearErrors();

        const items = document.querySelectorAll('.item input, .item select, .item textarea');
        items.forEach(item => {
            item.style.borderColor = '#ddd';
            if (item.value == '' && item.name != 'removed_files' && item.type != 'file') {
                const message = document.createElement('div');
                message.classList.add('messages');
                message.classList.add('error');
                message.innerHTML = 'Por favor, preencha todos os campos.';
                document.querySelector('body').appendChild(message);
                item.style.borderColor = '#ff3131';
                event.preventDefault();
            }
        });
    }
}

const formError = document.querySelector('.error.messages');
if (formError) {
    const fields = document.querySelectorAll('input');
    fields.forEach(field => field.style.borderColor = '#ff3131');
}