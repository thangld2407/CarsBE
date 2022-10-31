const { saveCarCrawl, getListCars } = require('../../../../controller/modules/CarListController');
const CarTypeController = require('../../../../controller/modules/CarTypeController');

const routerCars = require('express').Router();

routerCars.post('/save', saveCarCrawl);
routerCars.post('/save-type', CarTypeController.saveCarTypeCrawl);
routerCars.get('/list', getListCars);

module.exports = routerCars;
