// Active menu //
const currentPage = location.pathname;
const menuItens = document.querySelectorAll('header .links a');

for (let item of menuItens) {
    if (currentPage.includes(item.getAttribute('href'))) {
        item.classList.add('active');
    }
}

// Redirect to recipe/chef //
function redirectTo(collection) {
    for (let item of collection) {
        item.addEventListener('click', function () {
            const id = item.dataset.id;
            if (collection == recipes) {
                window.location.href = `/recipes/${id}`;
            } else {
                window.location.href = `/chefs/${id}`;
            }
        });
    }
}

const recipes = document.querySelectorAll('.recipe-container .recipe');
const chefs = document.querySelectorAll('.chef-container .chef');

redirectTo(recipes);
redirectTo(chefs);

// Hide recipe content //
const recipeWrapers = document.querySelectorAll('.recipe-hide');

for (let wraper of recipeWrapers) {
    const hide = wraper.querySelector('.hide');

    hide.addEventListener('click', function () {
        wraper.querySelector('.content').classList.toggle('hidden');
        if (hide.innerHTML == 'ESCONDER') {
            hide.innerHTML = 'MOSTRAR';
        } else {
            hide.innerHTML = 'ESCONDER';
        }
    });
}

// Confirm recipe/chef deletion //
function confirmDelete(formDelete) {
    formDelete.addEventListener('submit', function (event) {
        const totalRecipes = document.querySelector('.total-recipes');
        const confirmation = confirm('Deseja Deletar?');

        if (!confirmation) {
            event.preventDefault();
        }
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

if (formDelete) {
    confirmDelete(formDelete);
}