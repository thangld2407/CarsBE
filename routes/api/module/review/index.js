const ReviewController = require('../../../../controller/ReviewController');
const requireLogin = require('../../../../middleware/requireLogin');

const router = require('express').Router();

router.post('/list', ReviewController.list);
router.post('/create', requireLogin, ReviewController.create);
router.post('/edit', requireLogin, ReviewController.edit);
router.post('/detail', requireLogin, ReviewController.detail);
router.post('/remove', requireLogin, ReviewController.remove);

module.exports = router;
