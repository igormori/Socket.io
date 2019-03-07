const express = require('express');
const router = express.Router();
const eventController = require("../controller/eventController.js");
const users = require("../controller/users.js");
const history = require("../controller/historyController")
const register = require("../auth/AuthController")


router.post('/eventLog', eventController.registerEvents);
router.get('/eventLog',eventController.getEvents);
router.post('/users',users.registerUsers);
router.put('/users/:user',users.editOne);
router.get('/users',users.getusers);
router.post('/history',history.registerHystory);

//registration route
router.post('/register',register.register);
router.get('/me',register.getMe)

//login routes
router.post('/login',register.login);
router.get('/logout',register.logout);


module.exports = router;