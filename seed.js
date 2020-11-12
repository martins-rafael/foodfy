const faker = require('faker');
const { hash } = require('bcryptjs');

const User = require('./src/app/models/User');
const File = require('./src/app/models/File');
const Chef = require('./src/app/models/Chef');
const Recipe = require('./src/app/models/Recipe');
const RecipeFile = require('./src/app/models/RecipeFile');

function createFiles(num, placeholder) {
    const files = [];
    while (files.length < num) {
        files.push({
            name: faker.image.image(),
            path: `public/images/${placeholder}.png`
        });
    }
    return files;
}

let totalUsers = 6,
    totalChefs = 8,
    totalRecipes = 9,
    usersId,
    chefsId;

async function createUsers() {
    const users = [];
    const password = await hash('rocket', 8);

    while (users.length < totalUsers) {
        users.push({
            name: faker.name.firstName(),
            email: faker.internet.email().toLowerCase(),
            password,
            is_admin: Math.round(Math.random())
        });
    }

    const usersPromise = users.map(user => User.create(user));
    usersId = await Promise.all(usersPromise);
}

async function createChefs() {
    const chefs = [];
    const files = createFiles(totalChefs, 'chef_placeholder');
    const filesPromise = files.map(file => File.create(file));
    const filesId = await Promise.all(filesPromise);

    for (let fileIndex = 0; chefs.length < totalChefs; fileIndex++) {
        chefs.push({
            name: faker.name.firstName(),
            file_id: filesId[fileIndex]
        });
    }

    const chefsPromise = chefs.map(chef => Chef.create(chef));
    chefsId = await Promise.all(chefsPromise);
}

async function createRecipes() {
    try {
        const recipes = [];
        const ingredients = [];
        const preparation = [];

        for (let i = 0; i < 5; i++) {
            ingredients.push(faker.lorem.words(Math.ceil(Math.random() * 6)));
            preparation.push(faker.lorem.words(Math.ceil(Math.random() * 6)));
        }

        while (recipes.length < totalRecipes) {
            recipes.push({
                chef_id: chefsId[Math.floor(Math.random() * totalChefs)],
                user_id: usersId[Math.floor(Math.random() * totalUsers)],
                title: faker.commerce.productName(),
                ingredients,
                preparation,
                information: faker.lorem.paragraph(Math.ceil(Math.random() * 10))
            });
        }

        const recipesPromise = recipes.map(recipe => Recipe.create(recipe));
        const recipesId = await Promise.all(recipesPromise);

        const files = createFiles(45, 'recipe_placeholder');
        const filesPromise = files.map(file => File.create(file));
        const filesId = await Promise.all(filesPromise);

        const recipeFiles = [];
        let fileIndex = 0,
            recipeIndex = totalRecipes - 1,
            recipeImageLimit = 5;

        while (recipeFiles.length < 45) {
            for (let i = 0; i < recipeImageLimit; i++) {
                recipeFiles.push({
                    recipe_id: recipesId[recipeIndex],
                    file_id: filesId[fileIndex]
                });

                fileIndex++;
            }
            recipeIndex--;
        }

        const recipeFilesPromise = recipeFiles.map(recipe_file =>
            RecipeFile.create(recipe_file)
        );
        await Promise.all(recipeFilesPromise);
    } catch (error) {
        console.error(error);
    }
}

async function init() {
    await createUsers();
    await createChefs();
    await createRecipes();
}

init();