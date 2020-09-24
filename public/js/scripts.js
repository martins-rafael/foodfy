// Active menu //
const currentPage = location.pathname;
const menuItens = document.querySelectorAll('header .links a');

menuItens.forEach(item => {
    if (currentPage.includes(item.getAttribute('href'))) {
        item.classList.add('active');
    }
});

// Redirect to recipe/chef //
function redirectTo(collection) {
    collection.forEach(item => {
        item.addEventListener('click', () => {
            const id = item.dataset.id;
            if (collection == recipes) {
                window.location.href = `/recipes/${id}`;
            } else {
                window.location.href = `/chefs/${id}`;
            }
        });
    });
}

const recipes = document.querySelectorAll('.recipe-container .recipe');
const chefs = document.querySelectorAll('.chef-container .chef');
redirectTo(recipes);
redirectTo(chefs);

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

// Confirm recipe/chef deletion //
function confirmDelete(formDelete) {
    formDelete.addEventListener('submit', event => {
        const totalRecipes = document.querySelector('.total-recipes');
        const confirmation = confirm('Deseja Deletar?');
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

// Pagination //
function paginate(selectedPage, totalPages) {
    let pages = [], oldPage;

    for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
        const firstAndLastPage = currentPage == 1 || currentPage == totalPages;
        const pagesAfterSelectedPAge = currentPage <= selectedPage + 2;
        const pagesBeforeSelectedPAge = currentPage >= selectedPage - 2;

        if (firstAndLastPage || pagesAfterSelectedPAge && pagesBeforeSelectedPAge) {
            if (oldPage && currentPage - oldPage > 2) pages.push('...');
            if (oldPage && currentPage - oldPage == 2) pages.push(oldPage + 1);

            pages.push(currentPage);
            oldPage = currentPage;
        }
    }

    return pages;
}

function createPagination(pagination) {
    const page = +pagination.dataset.page;
    const total = +pagination.dataset.total;
    const search = pagination.dataset.filter;
    const pages = paginate(page, total);
    let elements = '';

    pages.forEach(page => {
        if (String(page).includes('...')) {
            elements += `<span>${page}</span>`;
        } else {
            if (search) {
                elements += `<a href="?page=${page}&search=${search}">${page}</a>`;
            } else {
                elements += `<a href="?page=${page}">${page}</a>`;
            }
        }
    });

    pagination.innerHTML = elements;
    activePage(page);
}

function activePage(page) {
    const pagesOfPagination = document.querySelectorAll('.pagination a');
    pagesOfPagination.forEach(currentPage => {
        if (Number(currentPage.innerHTML) == page) currentPage.classList.add('active');
    });
}

const pagination = document.querySelector('.pagination');
if (pagination) createPagination(pagination);

// Photos Upload //
const PhotosUpload = {
    input: '',
    preview: document.querySelector('#photos-preview'),
    uploadLimit: '',
    files: [],
    handleFileInput(event, uploadLimit) {
        const { files: fileList } = event.target;
        PhotosUpload.input = event.target;
        PhotosUpload.uploadLimit = uploadLimit;

        if (PhotosUpload.hasLimit(event)) return;

        Array.from(fileList).forEach(file => {
            PhotosUpload.files.push(file);
            const reader = new FileReader();

            reader.onload = () => {
                const image = new Image;
                image.src = String(reader.result);

                const div = PhotosUpload.getContainer(image);
                PhotosUpload.preview.appendChild(div);
            };

            reader.readAsDataURL(file);
        });

        PhotosUpload.input.files = PhotosUpload.getAllfiles();
    },
    hasLimit(event) {
        const { uploadLimit, input, preview } = PhotosUpload;
        const { files: fileList } = input;

        if (fileList.length > uploadLimit) {
            alert(`Envie no máximo ${uploadLimit} imagens!`);
            event.preventDefault();

            return true;
        }

        const photoDiv = [];
        preview.childNodes.forEach(item => {
            if (item.classList && item.classList.value == 'photo') photoDiv.push(item);
        });

        const totalPhotos = fileList.length + photoDiv.length;
        if (totalPhotos > uploadLimit) {
            alert(`Você atingiu o limite máximo de ${uploadLimit} imagens!`);
            event.preventDefault();

            return true;
        }

        return false;
    },
    getAllfiles() {
        const dataTransfer = new ClipboardEvent('').clipboardData || new DataTransfer();
        PhotosUpload.files.forEach(file => dataTransfer.items.add(file));

        return dataTransfer.files;
    },
    getContainer(image) {
        const div = document.createElement('div');
        div.classList.add('photo');
        div.onclick = PhotosUpload.removePhoto;
        div.appendChild(image);
        div.appendChild(PhotosUpload.getRemoveButton());

        return div;
    },
    getRemoveButton() {
        const button = document.createElement('i');
        button.classList.add('material-icons');
        button.innerHTML = 'close';

        return button;
    },
    removePhoto(event) {
        const photoDiv = event.target.parentNode;
        const photosArray = Array.from(PhotosUpload.preview.children);
        const index = photosArray.indexOf(photoDiv);

        PhotosUpload.files.splice(index, 1);
        PhotosUpload.input.files = PhotosUpload.getAllfiles();

        photoDiv.remove();
    },
    removeOldPhoto(event) {
        const photoDiv = event.target.parentNode;

        if (photoDiv.id) {
            const removedFiles = document.querySelector('input[name="removed_files"]');
            if (removedFiles) removedFiles.value += `${photoDiv.id},`;
        }

        photoDiv.remove();
    }
}

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

        input.focus();
    },
    clearErrors(input) {
        const errorDiv = input.parentNode.querySelector('.error');
        if (errorDiv) errorDiv.remove();
    },
    isEmail(value) {
        let error = null;
        const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if(!value.match(mailFormat)) error = 'Email inválido';

        return {
            error,
            value
        };
    }
}