const ReviewController = require('../../../../controller/ReviewController');

const router = require('express').Router();

router.post('/list', ReviewController.list);
router.post('/create', ReviewController.create);
router.post('/edit', ReviewController.edit);
router.post('/detail', ReviewController.detail);
router.post('/remove', ReviewController.remove);

module.exports = router;
