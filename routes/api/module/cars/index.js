const { saveCarCrawl, getListCars } = require('../../../../controller/modules/CarListController');
const CarTypeController = require('../../../../controller/modules/CarTypeController');

const routerCars = require('express').Router();

routerCars.post('/save', saveCarCrawl);
routerCars.post('/save-type', CarTypeController.saveCarTypeCrawl);
routerCars.post('/list', getListCars);

routerCars.get('/category', CarTypeController.getListCategory);

module.exports = routerCars;
