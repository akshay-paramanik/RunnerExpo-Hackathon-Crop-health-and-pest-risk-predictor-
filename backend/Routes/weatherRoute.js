const weatherController = require('../controller/weatherController');
const express = require('express');
const router = express.Router();

router.get('/weather', weatherController.getWeather);

module.exports = router;