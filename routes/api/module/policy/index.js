const PolicyController = require('../../../../controller/PolicyController');
const requireLogin = require('../../../../middleware/requireLogin');

const router = require('express').Router();

router.post('/create', PolicyController.create);
router.post('/edit', PolicyController.update);
router.post('/remove', PolicyController.delete);
router.post('/get', PolicyController.get);
router.post('/detail', PolicyController.getDetail);

module.exports = router;
