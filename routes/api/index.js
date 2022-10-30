const routerApi = require('express').Router();

routerApi.get('/', (req, res) => {
	res.json({
		message: req.__('API_WORKING')
	});
});
routerApi.use('/cars', require('./module/cars'));
routerApi.use('/images', require('./module/images'));
routerApi.use('/staff', require('./module/staff'));

module.exports = routerApi;
