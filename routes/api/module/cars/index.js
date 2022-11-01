const CarListController = require('../../../../controller/modules/CarListController');
const CarTypeController = require('../../../../controller/modules/CarTypeController');

const routerCars = require('express').Router();

routerCars.post('/save', CarListController.saveCarCrawl);
routerCars.post('/list', CarListController.getListCars);
routerCars.post('/save-type', CarTypeController.saveCarTypeCrawl);

module.exports = routerCars;
