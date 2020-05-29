const currentPage = location.pathname
const menuItens = document.querySelectorAll('header .links a')
const recipes = document.querySelectorAll('.recipe')
const recipeWrapers = document.querySelectorAll('.recipe-wraper')

// Active menu
for (let item of menuItens) {
    if (currentPage.includes(item.getAttribute('href'))) {
        item.classList.add('active')
    }
}

// Redirect to recipe
for (let i = 0; i < recipes.length; i++) {
    recipes[i].addEventListener('click', function () {
        let recipeIndex = 0
        recipeIndex += i
        window.location.href = `/recipes/${recipeIndex}`
    })
}

// Hide recipe content
for (let wraper of recipeWrapers) {
    const hide = wraper.querySelector('.hide')

    hide.addEventListener('click', function () {
        wraper.querySelector('.content').classList.toggle('hidden')
        if (hide.innerHTML == 'ESCONDER') {
            hide.innerHTML = 'MOSTRAR'
        } else {
            hide.innerHTML = 'ESCONDER'
        }
    })
}