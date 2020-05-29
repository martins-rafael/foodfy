const fs = require('fs')
const data = require('../data.json')

exports.index = function (req, res) {
    return res.render('admin/index', { recipes: data.recipes })
}

exports.create = function (req, res) {
    return res.render('admin/create')
}

exports.post = function (req, res) {
    const keys = Object.keys(req.body)

    for (let key of keys) {
        if (req.body[key] == '')
            return res.send('Por favor, preencha todos os campos.')
    }

    data.recipes.push({...req.body})

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function (err) {
        if (err) return res.send('Write file error!')
        return res.redirect('/admin/recipes')
    })
}

exports.show = function (req, res) {
    const recipeIndex = req.params.index
    const recipe = {
        ...data.recipes[recipeIndex],
        index: recipeIndex
    }
    return res.render('admin/show', { recipe })
}

exports.edit = function (req, res) {
    const recipeIndex = req.params.index
    const recipe = {
        ...data.recipes[recipeIndex],
        index: recipeIndex
    }
    return res.render('admin/edit', { recipe })
}

exports.put = function (req, res) {
    const recipeIndex = req.params.index
    const keys = Object.keys(req.body)

    for (let key of keys) {
        if (req.body[key] == '')
            return res.send('Por favor, preencha todos os campos.')
    }

    data.recipes[recipeIndex] = { ...req.body }

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function (err) {
        if (err) return res.send('Write file error!')
        return res.redirect(`/admin/recipes/${recipeIndex}`)
    })
}

exports.delete = function (req, res) {
    const recipeIndex = req.params.index

    data.recipes.splice(recipeIndex, 1)

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function (err){
        if (err) return res.send('Write file error!')
        return res.redirect('/admin/recipes')
    })
}