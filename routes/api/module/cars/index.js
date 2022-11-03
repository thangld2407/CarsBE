const CarListController = require('../../../../controller/modules/CarListController');

const routerCars = require('express').Router();

routerCars.post('/save', CarListController.saveCarCrawl);
routerCars.post('/list', CarListController.getListCars);
routerCars.get('/list/hotsale', CarListController.getListHotsale);
routerCars.post('/detail', CarListController.getCarDetail);

module.exports = routerCars;
