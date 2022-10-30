const StaffController = require('../../../../controller/modules/StaffController');

const staffRouter = require('express').Router();

staffRouter.post('/create', StaffController.create);
staffRouter.post('/edit', StaffController.edit);
staffRouter.post('/remove', StaffController.remove);
staffRouter.get('/list', StaffController.list);
staffRouter.get('/:id', StaffController.detail);

module.exports = staffRouter;
