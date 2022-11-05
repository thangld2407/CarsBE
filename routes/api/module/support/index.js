const SupportController = require('../../../../controller/SupportController');

const router = require('express').Router();

router.post('/create', SupportController.create);

module.exports = router;
