const CarTypeController = require('../../../../controller/modules/CarTypeController');

const routerCategory = require('express').Router();

routerCategory.get('/list', CarTypeController.getListCategory);

module.exports = routerCategory;
