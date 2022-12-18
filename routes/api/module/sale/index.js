const SaleController = require('../../../../controller/SaleController');
const requireLogin = require('../../../../middleware/requireLogin');

const router = require('express').Router();

router.post('/settings', requireLogin, SaleController.setSale);
router.post('/status', requireLogin, SaleController.getSale);

module.exports = router;
