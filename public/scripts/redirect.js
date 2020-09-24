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