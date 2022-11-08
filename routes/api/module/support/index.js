const SupportController = require('../../../../controller/SupportController');
const requireLogin = require('../../../../middleware/requireLogin');

const router = require('express').Router();

router.post('/create', requireLogin, SupportController.create);
router.post('/get', requireLogin, SupportController.get);
router.post('/detail', requireLogin, SupportController.detail);
router.post('/edit', requireLogin, SupportController.edit);

module.exports = router;
