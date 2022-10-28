const { saveCarCrawl, getListCars } = require('../../../../controller/modules/CarListController');

const routerCars = require('express').Router();

routerCars.post('/save', saveCarCrawl);
routerCars.get('/list', getListCars);

module.exports = routerCars;
