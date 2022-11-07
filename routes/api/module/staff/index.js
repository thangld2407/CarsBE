const StaffController = require('../../../../controller/StaffController');
const requireLogin = require('../../../../middleware/requireLogin');

const staffRouter = require('express').Router();

staffRouter.post('/create', requireLogin, StaffController.create);
staffRouter.post('/edit', requireLogin, StaffController.edit);
staffRouter.post('/remove', requireLogin, StaffController.remove);
staffRouter.post('/list', StaffController.list);
staffRouter.get('/:id', requireLogin, StaffController.detail);

module.exports = staffRouter;
