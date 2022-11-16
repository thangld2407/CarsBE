const HomeController = require('../../../../controller/HomeController');
const requireLogin = require('../../../../middleware/requireLogin');

const router = require('express').Router();

router.post('/banner/create', requireLogin, HomeController.create);
router.post('/banner/update', requireLogin, HomeController.update);

module.exports = router;
