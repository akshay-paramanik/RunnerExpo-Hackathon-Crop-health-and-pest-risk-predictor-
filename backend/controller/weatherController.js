const weatherModel = require('../models/weatherModel');
const locationModel = require('../models/locationModel');

const weatherController = {
    getWeather: async (req, res) => {
        try {
            const weatherData = await weatherModel.findOne().sort({ createdAt: -1 });

            if (!weatherData) {
                return res.status(404).json({ error: 'Weather data not found' });
            }

            res.json(weatherData);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch weather data' });
        }
    },
    storeWeather: async (req,res)=>{
        const locationData = await locationModel.findOne().sort({ createdAt: -1 });
    }
}

module.exports = weatherController;