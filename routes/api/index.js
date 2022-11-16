const routerApi = require('express').Router();

routerApi.get('/', (req, res) => {
	res.json({
		message: req.__('API_WORKING')
	});
});
routerApi.use('/cars', require('./module/cars'));
routerApi.use('/upload', require('./module/uploads'));
routerApi.use('/staff', require('./module/staff'));
routerApi.use('/category', require('./module/category'));
routerApi.use('/review', require('./module/review'));
routerApi.use('/auth', require('./module/auth'));
routerApi.use('/support', require('./module/support'));
routerApi.use('/filter', require('./module/filter_list'));

module.exports = routerApi;
