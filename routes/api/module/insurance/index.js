const InsuranceController = require('../../../../controller/InsuranceController');
const requireLogin = require('../../../../middleware/requireLogin');

const router = require('express').Router();

router.post('/detail', InsuranceController.get);
router.post('/edit', requireLogin, InsuranceController.update);

module.exports = router;
