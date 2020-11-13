const Recipe = require('../models/Recipe');
const { getImages } = require('../../lib/utils');

const loadService = {
    load(service, filter) {
        this.filter = filter;
        return this[service]();
    },
    async recipe() {
        try {
            const recipe = await Recipe.find(this.filter);
            recipe.files = await getImages(recipe.id);
            return recipe;
        } catch (error) {
            console.error(error);
        }
    },
    async recipes() {
        try {
            let recipes;

            this.filter
            ? recipes = await Recipe.recipes(this.filter)
            : recipes = await Recipe.all();

            const recipesPromise = recipes.map(async recipe => {
                const files = await getImages(recipe.id);
                recipe.image = files[0].src;
                return recipe;
            });
            const allRecipes = Promise.all(recipesPromise);
            return allRecipes;
        } catch (error) {
            console.error(error);
        }
    },
    async userRecipes() {
        const recipes = await Recipe.userRecipes(this.filter);
        const recipesPromise = recipes.map(async recipe => {
            const files = await getImages(recipe.id);
            recipe.image = files[0].src;
            return recipe;
        });
        const allRecipes = Promise.all(recipesPromise);
        return allRecipes;

    }
};

module.exports = loadService;