const AuthController = require('../../../../controller/AuthController');

const routerAuht = require('express').Router();
const requireLogin = require('../../../../middleware/requireLogin');

routerAuht.post('/login', AuthController.login);
routerAuht.post('/relogin', AuthController.relogin);
routerAuht.post('/infor', requireLogin, AuthController.infor);
routerAuht.post('/infor-public', AuthController.infoPublic);
routerAuht.post('/change-infor', requireLogin, AuthController.update);
routerAuht.post('/change-password', requireLogin, AuthController.changePassword);
module.exports = routerAuht;
