const StaffController = require('../../../../controller/StaffController');

const staffRouter = require('express').Router();

staffRouter.post('/create', StaffController.create);
staffRouter.post('/edit', StaffController.edit);
staffRouter.post('/remove', StaffController.remove);
staffRouter.post('/list', StaffController.list);
staffRouter.get('/:id', StaffController.detail);

module.exports = staffRouter;
