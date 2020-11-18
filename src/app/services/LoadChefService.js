const Chef = require('../models/Chef');
const File = require('../models/File');
const { getImages } = require('../../lib/utils');

const loadService = {
    load(service, filter) {
        this.filter = filter;
        return this[service]();
    },
    async chef() {
        try {
            const chef = await Chef.find(this.filter);
            chef.file = await File.findOne({ where: { id: chef.file_id } });
            chef.file.src = `${chef.file.path.replace('public', '')}`;
            const recipes = await Chef.chefRecipes(chef.id);
            const recipesPromise = recipes.map(async recipe => {
                const files = await getImages(recipe.id);
                recipe.image = files[0].src;
                return recipe;
            });
            
            chef.recipes = await Promise.all(recipesPromise);
            return chef;
        } catch (error) {
            console.error(error);
        }
    },
    async chefs() {
        try {
            const chefs = await Chef.pagination(this.filter)
            const chefsPromise = chefs.map(async chef => {
                const file = await File.findOne({ where: { id: chef.file_id } });
                chef.image = `${file.path.replace('public', '')}`;
                return chef;
            });
            const allChefs = Promise.all(chefsPromise);
            return allChefs;
        } catch (error) {
            console.error(error);
        }
    }
};

module.exports = loadService;