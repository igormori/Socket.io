const express = require('express');
const router = express.Router();
const eventController = require("../controller/eventController.js");
const history = require("../controller/historyController.js");


router.post('/eventLog', eventController.registerEvents);
router.get('/eventLog',eventController.getEvents);
router.post('/history',history.registerHistories);
router.put('/history/:user',history.editOne);
router.get('/history',history.getHistory);




module.exports = router;