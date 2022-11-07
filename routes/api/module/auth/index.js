const AuthController = require('../../../../controller/AuthController');

const routerAuht = require('express').Router();

routerAuht.post('/login', AuthController.login);
routerAuht.post('/relogin', AuthController.relogin);
module.exports = routerAuht;
