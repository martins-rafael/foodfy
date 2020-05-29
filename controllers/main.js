const { recipes } = require('../data.json')

exports.index = function (req, res) {
    return res.render('main/index', { recipes })
}

exports.about = function (req, res) {
    return res.render('main/about')
}

exports.recipes = function (req, res) {
    return res.render('main/recipes', { recipes })
}

exports.recipe = function (req, res) {
    const recipesIndex = req.params.index
    return res.render('main/recipe', { recipe: recipes[recipesIndex] })
}