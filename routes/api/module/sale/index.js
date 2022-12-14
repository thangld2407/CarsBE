const SaleController = require('../../../../controller/SaleController');
const requireLogin = require('../../../../middleware/requireLogin');

const router = require('express').Router();

router.post('/settings', SaleController.setSale);

module.exports = router;
