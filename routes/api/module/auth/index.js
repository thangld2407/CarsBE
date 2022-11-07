const AuthController = require('../../../../controller/AuthController');

const routerAuht = require('express').Router();

routerAuht.post("/login", AuthController.login)
module.exports = routerAuht;
