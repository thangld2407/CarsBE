const CarListController = require('../../../../controller/CarListController');

const routerCars = require('express').Router();

routerCars.post('/save', CarListController.saveCarCrawl);
routerCars.post('/list', CarListController.getListCars);
routerCars.get('/list/hotsale', CarListController.getListHotsale);
routerCars.post('/detail', CarListController.getCarDetail);
routerCars.post('/update-price', CarListController.updatePrice);
routerCars.post('/update-hotsale', CarListController.updateHotsale);
routerCars.post('/create', CarListController.create);

module.exports = routerCars;
