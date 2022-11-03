const CategoryController = require('../../../../controller/CategoryController');

const routerCategory = require('express').Router();

routerCategory.get('/list', CategoryController.getListCategory);
routerCategory.post('/save', CategoryController.saveCategory);

module.exports = routerCategory;
